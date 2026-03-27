
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
const createNode = (ids, pos,labels, types, isDraggable) =>{
	const newnode = {
		id: ids.toString(),
		position: pos,
		data: {label:labels},
		type: types,
		draggable: isDraggable // only false for origin cursor. it should only move on clicking on pane
	}

	return newnode
}

let clicked = 0;
let origin_exists = false;
let pos = {x:50, y:50}
let edgeDropped = false;

function Inner({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange}){
	const edgeReconnect = useRef(true)
	const reactFlow = useReactFlow();

	const getPos = (e) => {
		if (!edgeDropped){
			const screenPos = {x:e.clientX, y:e.clientY};
			pos = reactFlow.screenToFlowPosition(screenPos)
		

		        if (!origin_exists){
				const OriginNode = createNode("og", pos, "", "origin", false)
				setNodes((nds) => nds.concat(OriginNode))
				origin_exists = true;
			}
			
			setNodes((nds) => nds.map((node) =>{
				if (!(node.id == "og") ){
					return node
				}

			        return createNode("og", pos, "", "origin", false)
			}))
		}

		edgeDropped = false;
	}
	const addNode = (type, isDraggable) => {
		const CreatedNode = createNode(Math.random(), pos, Math.random(), type, isDraggable)
		setNodes((nds) => nds.concat(CreatedNode));
	}

	const MakeSquare = useCallback(() => {
		addNode('default', true)
	}, []);

	const MakeCircle = useCallback(() => {
		addNode('circleNode', true)
	}, [])

	const onConnect = useCallback((connection) =>{
		edgeDropped = true;
		setEdges((eds) => addEdge(connection, eds));
	}, [setEdges]);

	const onReconnectStart = useCallback(() =>{
		edgeDropped = true;
		edgeReconnect.current = false;
		console.log("obama")
	}, []);
	const onReconnect = useCallback((oldEdge, newConnection) =>{
		edgeDropped = true;
		edgeReconnect.current = true;
		setEdges((eds) => reconnectEdge(oldEdge,newConnection,eds)); 
	}, [setEdges]);

	const onReconnectEnd = useCallback((_, edge) =>{
		if (!edgeReconnect.current){
			setEdges((eds) => eds.filter((e) => e.id !== edge.id))
			edgeDropped = true;
		}

	}, [setEdges])


	return 	(
		<div style={{ height: '100%', width: '100%' }}>
		<ReactFlow nodes={nodes} 
		edges={edges}

		onEdgesChange={onEdgesChange} 
		onNodesChange={onNodesChange} 
		nodeTypes={nodeTypes}
		onPaneClick={getPos}
		onConnect={onConnect}
		onReconnect={onReconnect}
		onReconnectStart={onReconnectStart}
		onReconnectEnd={onReconnectEnd}

		>

		<Panel position="top-left">
		<footer id="bottom-sidebar">
                <div id="rows">
                  <button id="bottom-bar-butts" onClick={MakeSquare}>
                  Square
                  </button> 
                  <button id="bottom-bar-butts" onClick={MakeCircle} title="Draws a circle at the origin"
                     >Circle
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
