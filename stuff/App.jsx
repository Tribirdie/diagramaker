import {toPng} from 'html-to-image'
import {React, useCallback, useEffect, useRef, useMemo, memo} from 'react'
import {reconnectEdge, addEdge, useEdgesState,
	Position, ReactFlow, MarkerType, ReactFlowProvider, useReactFlow, useViewport,
	applyNodeChanges, useNodesState, 
	Panel, Background, BackgroundVariant,
	ConnectionMode} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CircleNode from './CircleNode'
import Origin from './Origin'
import RectangularNode from './RectangularNode'
import TextEdge from './TextEdge'
import {DropdownButton, ImportButton, ExportButton} from './TopButtons'
import {Recipes, Oven} from './Nodes'
import {ConnectionBuilder} from './EventHandlers'
import {Settings, Main} from './Layout'
import {LanguageObj, LanguageWords} from './Languages'

const nodeTypes = {circleNode: CircleNode, origin: Origin, RectNode: RectangularNode}
const edgeTypes = {textEdge: TextEdge}

const node = [
	{
		id: "og",
		position: {x:0, y:0},
		data: {label:""},
		type: "origin",
		// only false for origin cursor. it should only move on click on pane, includes connecting edges.
		draggable: false
	}
];

const edge = [];

const language = LanguageObj(LanguageWords, window.localStorage.getItem("lang"));

const Inner = memo(({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange}) =>{
	const addBorderRadius = useEffect(() =>{
		const dropdowns = document.getElementsByClassName("dropdown-content");
		dropdowns[0].children[0].style.borderRadius = "0px 0px 10px 10px";
		dropdowns[1].children[1].style.borderRadius = "0px 0px 10px 10px";

	});
	
	const handlesCheck = useRef([ ["bottom", "bottom", "top"], ["top", "bottom", "top"]
	, ["right", "right", "left"] , ["left", "right", "left"] ]);
	let pos = useRef({x:50, y:50});

	const edgeReconnect = useRef(true);
	const reactFlow = useReactFlow();

	const DropButton = useMemo(() => (new DropdownButton()));
	const ImportButt = useMemo(() => (new ImportButton(DropButton, true, 1)));
	const ExportButt = useMemo(() => (new ExportButton(DropButton, reactFlow, node)));

	const Recipe = useMemo(() => (new Recipes()), []); 
	const Baker = useMemo(() => {new Oven(Recipe)}, []);
	const connectionBuild = useMemo( () => (new ConnectionBuilder()), []);
		
	connectionBuild.setProps({setEdges});
	connectionBuild.setEdgeDropped(false);
	connectionBuild.setEdgeReconnect(edgeReconnect);
	connectionBuild.setHandlesCheck(handlesCheck.current);
	connectionBuild.setRecipe(Recipe);
	connectionBuild.setSource("right");
	connectionBuild.setTarget("left");

	const connectionHandler = useMemo( () => (connectionBuild.build()));

	const getPos = (e) => {
		if (!connectionHandler.edgeDropped){
			const screenPos = {x:e.clientX, y:e.clientY};
			pos.current = reactFlow.screenToFlowPosition(screenPos)

			setNodes((nds) => nds.map((node) =>{
				if (node.id !== "og"){
					return node
				}

			        return Recipe.createNode("og", pos.current, "", "origin", false)
			}))
		}

		connectionHandler.edgeDropped = false;
	}

	const MakeSquare = useCallback(() => {
		const node = Recipe.createNode(Math.random(), pos.current, "", "RectNode", true);
		setNodes((nds) => nds.concat(node));

	}, [setNodes]);

	const MakeCircle = useCallback(() => {
		const node = Recipe.createNode(Math.random(), pos.current, "", "circleNode", true);
		setNodes((nds) => nds.concat(node));
	}, [setNodes])

	const onNodeDoubleClick = useCallback((_, node) =>{
		setNodes((nds) => nds.filter((n) => n.id != node.id)) 
	}, [setNodes]);

	return 	(

		<div style={{ height: '100%', width: '100%' }}>
		
		<Settings language={language}>
		</Settings>

		<ReactFlow nodes={nodes} 
		edges={edges}

		connectionMode={ConnectionMode.loose}
		onEdgesChange={onEdgesChange} 
		onNodesChange={onNodesChange} 
		nodeTypes={nodeTypes}
		edgeTypes={edgeTypes}
		onPaneClick={getPos}
		onConnectStart={connectionHandler.onConnectStart}
		onConnect={connectionHandler.onConnect}
		onConnectEnd={connectionHandler.onConnectEnd}
		onReconnect={connectionHandler.onReconnect}
		onReconnectStart={connectionHandler.onReconnectStart}
		onReconnectEnd={connectionHandler.onReconnectEnd}
		onNodeDoubleClick={onNodeDoubleClick}
		>


		<Main ImportButt={ImportButt} ExportButt={ExportButt} DropButton={DropButton}
		 nodes={nodes} setEdges={setEdges} setNodes={setNodes} edges={edges}
		MakeSquare={MakeSquare}
		MakeCircle={MakeCircle}
		language={language}>
		</Main>

		</ReactFlow>
		</div>


 	)

})

export default function App() {
	const edgeReconnect = useRef(true)
	const [nodes, setNodes, onNodesChange] = useNodesState(node);
	const [edges, setEdges, onEdgesChange] = useEdgesState(edge)

  return (
    <div style={{ height: '100%', width: '100%' }}>
	  <ReactFlowProvider>
	  <Inner setEdges={setEdges} 
	  edges={edges}
	  onEdgesChange={onEdgesChange} 
	  setNodes={setNodes} 
	  nodes={nodes} 
	  onNodesChange={onNodesChange}/>
	  </ReactFlowProvider>
    </div>
  );
}
