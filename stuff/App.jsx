import {React, useCallback, useEffect, useRef, useState, useMemo, memo} from 'react'
import {reconnectEdge, addEdge, useEdgesState,
	ReactFlow, ReactFlowProvider, useReactFlow, useViewport,
	applyNodeChanges, useNodesState, 
	Panel, Background, BackgroundVariant,
	ConnectionMode} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {RectangularNode, CircleNode, Origin, Text,TextEdge, RegEdge} from './Components'
import {DropdownButton, ImportButton, ExportButton} from './TopButtons'
import {Recipes, Oven} from './NodeEdgeOven'
import {ConnectionBuilder} from './EventHandlers'
import {Settings, Main} from './Layout'
import {LanguageObj, LanguageWords} from './Languages'
import {RegularEdge, ConnectorEdge, MakeSquare, MakeCircle, TextNode} from './NodesNEdges.jsx'
import {getAllPropertyNames}  from './Utils.jsx'
import {Shortcuts, addBorderRadius} from './Effects.jsx'

const nodeTypes = {circleNode: CircleNode, origin: Origin, RectNode: RectangularNode, text: Text}
const edgeTypes = {textEdge: TextEdge, reg: RegEdge};

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

const Inner = memo(({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange, actionBuffer}) =>{
	const handlesCheck = useRef([ ["bottom", "bottom", "top"], ["top", "bottom", "top"]
	, ["right", "right", "left"] , ["left", "right", "left"]]);
	let pos = useRef({x:50, y:50});

	const edgeReconnect = useRef(true);
	const edgeType = useRef("reg");
	const reactFlow = useReactFlow();

	const result = useMemo(() => getAllPropertyNames());

	const DropButton = useMemo(() => (new DropdownButton()));
	const ImportButt = useMemo(() => (new ImportButton(DropButton, true, 1, language)));
	const ExportButt = useMemo(() => (new ExportButton(DropButton, reactFlow, node, result)));

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
	connectionBuild.setEdgeType(edgeType.current);

	const connectionHandler = useMemo( () => (connectionBuild.build()));

	const onNodeDoubleClick = (_, node) =>{
		setNodes((nds) => nds.filter((n) => n.id != node.id)) 
	}

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
		onConnectStart={useCallback(connectionHandler.onConnectStart, [])}
		onConnect={useCallback(connectionHandler.onConnect, [])}
		onConnectEnd={useCallback(connectionHandler.onConnectEnd, [])}
		onReconnect={useCallback(connectionHandler.onReconnect, [])}
		onReconnectStart={useCallback(connectionHandler.onReconnectStart, [])}
		onReconnectEnd={useCallback(connectionHandler.onReconnectEnd, [])}
		onNodeDoubleClick={useCallback(onNodeDoubleClick, [])}
		onlyRenderVisibleElements={true}
		>

		<Main ImportButt={ImportButt} RegularEdge={() => RegularEdge(edgeType, connectionHandler)} 
		ConnectorEdge={() => ConnectorEdge(edgeType, connectionHandler)}
		ExportButt={ExportButt} 
		DropButton={DropButton}
		 nodes={nodes} 
		setEdges={setEdges} 
		TextNode={() => TextNode({setNodes}, Recipe, pos, node)} 
		setNodes={setNodes} 
		edges={edges}
		MakeSquare={useCallback(() => MakeSquare({setNodes}, Recipe, pos, node))}
		MakeCircle={useCallback(() => MakeCircle({setNodes}, Recipe, pos, node))}
		language={language}>
		</Main>

		</ReactFlow>
		</div>
 	)
})

export default function App() {
	useEffect(() => addBorderRadius());

	const actionBuffer = useRef([])
	const edgeReconnect = useRef(true)
	const [nodes, setNodes, onNodesChange] = useNodesState(node);
	const [edges, setEdges, onEdgesChange] = useEdgesState(edge)

	const removeLatestNode = (n,i,a) =>{
		if (n !== a[a.length-1 || n.id  == "og"]){
			return n
		}
		
		actionBuffer.current.push(n);
	}

	useEffect(() => Shortcuts({setNodes, setEdges}, removeLatestNode, actionBuffer));

  return (
    <div style={{ height: '100%', width: '100%' }}>
	  <ReactFlowProvider>
	  <Inner setEdges={setEdges} 
	  edges={edges}
	  onEdgesChange={onEdgesChange} 
	  setNodes={setNodes} 
	  nodes={nodes} 
	  onNodesChange={onNodesChange}
	  actionBuffer={actionBuffer}/>
	  </ReactFlowProvider>
    </div>
  );
}
