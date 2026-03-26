
import {React, useCallback, useRef} from 'react'
import {reconnectEdge, addEdge, Position, ReactFlow, MarkerType, useEdgesState, ReactFlowProvider, useReactFlow, applyNodeChanges, useNodesState, Panel, Background, Controls, ControlButton, BackgroundVariant} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CircleNode from './CircleNode'
import Origin from './Origin'

const nodeTypes = {circleNode: CircleNode, origin: Origin}

let node = [{
	id: 'hi',
	position: {x:0, y:0},
	data: {label: "test"},
	draggable: true,

   },

   {
	   id:"p",
	   position: {x:10, y:10},
	   data: {label: "test2"},

   },

   {
	   id:"ha",
	   position: {x:50, y:50},
	   data: {label: "test3"}
   }
];

const edge = [{
	id: "mom",
	source: "hi",
	target: "p",
	edgesReconnectable: true

}]
const createNode = (ids, pos,labels, types) =>{
	const newnode = {
		id: ids.toString(),
		position: pos,
		data: {label:labels},
		type: types
	}

	return newnode
}

let clicked = 0;
let origin_exists = false;
let pos = {x:50, y:50}
let Node1 = 0
let Node2 = 0
let nodes_clicked = 0

function Inner({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange}){
	const edgeReconnect = useRef(true)
	const reactFlow = useReactFlow();

	const getPos = (e) => {
		const screenPos = {x:e.clientX, y:e.clientY};
		pos = reactFlow.screenToFlowPosition(screenPos)

		if (!origin_exists){
			const OriginNode = createNode("og", pos, "", "origin")
			setNodes((nds) => nds.concat(OriginNode))
			origin_exists = true;
		}

		setNodes((nds) => nds.map((node) =>{
			if (!(node.id == "og") ){
				return node
			}

			return createNode("og", pos, "", "origin")
		}))
		console.log("hi")
	}
	const addNode = useCallback((type) => {
		const CreatedNode = createNode(Math.random(), pos, Math.random(), type)
		setNodes((nds) => nds.concat(CreatedNode));
	}, [setNodes]);

	const onConnect = useCallback((connection) =>{
		setEdges((eds) => addEdge(connection, eds));
	}, [setEdges]);

	const onReconnectStart = useCallback(() =>{
		edgeReconnect.current = false;
	}, []);
	const onReconnect = useCallback((oldEdge, newConnection) =>{
		edgeReconnect.current = true;
		setEdges((eds) => reconnectEdge(oldEdge,newConnection,eds)); 
	}, [setEdges]);

	const onReconnectEnd = useCallback((_, edge) =>{
		if (!edgeReconnect.current){
			setEdges((eds) => eds.filter((e) => e.id !== edge.id))	
		}
	}, [setEdges])

	const onNodeClick = useCallback((event, node) => {
		console.log("My grandest delusion")
		if (nodes_clicked == 0){
			Node1 = node.id;
		}

		else{
			Node2 = node.id;
			nodes_clicked = 0;
		}

		nodes_clicked += 1
	}, [])

	return 	(
		<div style={{ height: '100%', width: '100%' }}>
		<ReactFlow nodes={nodes} 
		edges={edges}

		onEdgesChange={onEdgesChange} 
		onNodesChange={onNodesChange} 
		nodeTypes={nodeTypes}
		onPaneClick={getPos}
		onConnect={onConnect}
		onNodeClick={onNodeClick}
		onReconnect={onReconnect}
		onReconnectStart={onReconnectStart}
		onReconnectEnd={onReconnectEnd}

		>

		<Panel position="top-left">
		<footer id="bottom-sidebar">
                <div id="rows">
                  <button id="bottom-bar-butts" onClick={addNode}>
                  Square
                  </button>
                  <button id="bottom-bar-butts" title="Arrow connecting shapes">
                  Arrow
                  </button>
                  <button id="bottom-bar-butts" title="Draws a circle at the origin"
                     >Circle
                  </button>
                  <button id="bottom-bar-butts" title="Arrow that can be bent"
                     >PolyArrow
                  </button>
                  <button id="bottom-bar-butts" onClick={addNode}title="Sets shape drawing point">
                  Origin
                  </button>
                  <button id="bottom-bar-butts" title="Adds text">
                  Text
                  </button>
                </div>
		</footer>
		</Panel>

		<Background variant={BackgroundVariant.Lines}/>
		<Controls>
		<ControlButton onClick={() => alert('Something magical just happened. ✨')}>
		hi
		</ControlButton>
		</Controls>
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
