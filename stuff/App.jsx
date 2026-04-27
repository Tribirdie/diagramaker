import {toPng} from 'html-to-image'
import {React, useCallback, useRef} from 'react'
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

window.addEventListener("load", () =>{
	const dropdowns = document.getElementsByClassName("dropdown-content");
	dropdowns[0].children[0].style.borderRadius = "0px 0px 10px 10px";
	dropdowns[1].children[1].style.borderRadius = "0px 0px 10px 10px";
});

const nodeTypes = {circleNode: CircleNode, origin: Origin, RectNode: RectangularNode}
const edgeTypes = {textEdge: TextEdge}

const node = [];
const edge = [];

const language = LanguageObj(LanguageWords, window.localStorage.getItem("lang"));

let clicked = 0;
let origin_exists = false;
let pos = {x:50, y:50}
let handlesCheck = [ ["bottom", "bottom", "top"], ["top", "bottom", "top"]
	, ["right", "right", "left"] , ["left", "right", "left"]];
let times_clicked = 0;

function Inner({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange}){
	const edgeReconnect = useRef(true);
	const reactFlow = useReactFlow();

	const DropButton = new DropdownButton();
	const ImportButt = new ImportButton(DropButton, true, 1);
	const ExportButt = new ExportButton(DropButton, reactFlow, node);

	const Recipe = new Recipes(); 
	const Baker = new Oven(Recipe);
	const connectionBuilder = new ConnectionBuilder();
	connectionBuilder.setProps({setEdges});
	connectionBuilder.setEdgeDropped(false);
	connectionBuilder.setEdgeReconnect(edgeReconnect);
	connectionBuilder.setHandlesCheck(handlesCheck);
	connectionBuilder.setRecipe(Recipe);
	connectionBuilder.setSource("right");
	connectionBuilder.setTarget("left");
	const connectionHandler = connectionBuilder.build();

	const getPos = (e) => {
		if (!connectionHandler.edgeDropped){
			const screenPos = {x:e.clientX, y:e.clientY};
			pos = reactFlow.screenToFlowPosition(screenPos)
		

		        if (!origin_exists){
				const props = ["og", pos, "", "origin", false]
				const node = Recipe.createNode(props[0], props[1], props[2], props[3], props[4]);
				setNodes((nds) => nds.concat(node));
				origin_exists = true;
			}
			
			setNodes((nds) => nds.map((node) =>{
				if (!(node.id == "og") ){
					return node
				}

			        return Recipe.createNode("og", pos, "", "origin", false)
			}))
		}

		connectionHandler.edgeDropped = false;
	}

	const MakeSquare = useCallback(() => {
		const node = Recipe.createNode(Math.random(), pos, "", "RectNode", true);
		setNodes((nds) => nds.concat(node));

	}, []);

	const MakeCircle = useCallback(() => {
		const node = Recipe.createNode(Math.random(), pos, "", "circleNode", true);
		setNodes((nds) => nds.concat(node));
	}, [])

	const onNodeDoubleClick = useCallback((_, node) =>{
		setNodes((nds) => nds.filter((n) => n.id != node.id)) 
	});

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

}
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
