import {toPng} from 'html-to-image'
import {React, useCallback, useRef} from 'react'
import {reconnectEdge, addEdge, useEdgesState,
	Position, ReactFlow, MarkerType, ReactFlowProvider, useReactFlow,
	applyNodeChanges, useNodesState, 
	Panel, Background, Controls, ControlButton, BackgroundVariant,
	ConnectionMode, getNodesBounds, getViewportForBounds} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CircleNode from './CircleNode'
import Origin from './Origin'
import RectangularNode from './RectangularNode'
import TextEdge from './TextEdge'
import {DropdownButton, ImportButton, ExportButton} from './TopButtons'

const nodeTypes = {circleNode: CircleNode, origin: Origin, RectNode: RectangularNode}
const edgeTypes = {textEdge: TextEdge}

let node = [];
const edge = [];

const createNode = (ids, pos,labels, types, isDraggable) =>{
	const newnode = {
		id: ids.toString(),
		position: pos,
		data: {label:labels},
		type: types,
		// only false for origin cursor. it should only move on click on pane, includes connecting edges.
		draggable: isDraggable 	}

	return newnode
}

const createEdge = (ids, targets, sources, tHandle, sHandle) =>{
	const newEdge = {
		id: ids.toString(),
		source: sources,
		target: targets,
		targetHandle: tHandle,
		sourceHandle: sHandle,
		type: 'textEdge'
	}

	return newEdge
}

let clicked = 0;
let origin_exists = false;
let pos = {x:50, y:50}
let edgeDropped = false;
let target = 'left';
let source = 'right'
let header_butt_count = 0;
let export_butt_count = 0;
let import_butt_count = 0;
let run = true;
let img_run = true;
let count = 1;
let nodes_butt_count = 0;

function Inner({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange}){
	const edgeReconnect = useRef(true);
	const reactFlow = useReactFlow();

	const DropButton = new DropdownButton();
	const ImportButt = new ImportButton(DropButton, true, 1);
	const ExportButt = new ExportButton(DropButton, reactFlow, node);

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
		addNode('RectNode', true)
	}, []);

	const MakeCircle = useCallback(() => {
		addNode('circleNode', true)
	}, [])

	const onConnectStart = useCallback((_, {handleId}) =>{

		if (handleId == "bottom"){
			source = handleId
			target = "top"
		}

		if (handleId == "top"){
			source = "bottom"
			target = handleId
		}

		if (handleId == "right"){
			source = handleId;
			target = "left";
		}

		if (handleId == "left"){
			source = "right";
			target = handleId;
		}
	})

	const onConnect = useCallback((connection) =>{
		const CreatedEdge = createEdge(Math.random(), connection.target, connection.source, target, source)
		edgeDropped = true;
		setEdges((eds) => addEdge(CreatedEdge, eds));
	}, [setEdges]);

	const onConnectEnd = useCallback(() =>{
		edgeDropped = true;
	}, []);

	const onReconnectStart = useCallback(() =>{
		edgeDropped = true;
		edgeReconnect.current = false;
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

	const showNodesList = () =>{
		if (nodes_butt_count == 0){
			document.getElementById("nodes-list").style.display = "flex";
			nodes_butt_count += 1;
		}

		else{
			document.getElementById("nodes-list").style.display = "none";
			nodes_butt_count = 0;
		}
	}
	return 	(
		<div style={{ height: '100%', width: '100%' }}>
		<ReactFlow nodes={nodes} 
		edges={edges}

		connectionMode={ConnectionMode.loose}
		onEdgesChange={onEdgesChange} 
		onNodesChange={onNodesChange} 
		nodeTypes={nodeTypes}
		edgeTypes={edgeTypes}
		onPaneClick={getPos}
		onConnectStart={onConnectStart}
		onConnect={onConnect}
		onConnectEnd={onConnectEnd}
		onReconnect={onReconnect}
		onReconnectStart={onReconnectStart}
		onReconnectEnd={onReconnectEnd}
		>

		<Panel position="top-left">
		<header id="header">
		<input type="file" accept=".json" id="file-dialog"></input>
		
		<div className="dropdown">
		<button id="import-button" onClick={() => {ImportButt.clickFunc.showDropdown(0)}}> Import</button>
		<div className="dropdown-content">
		<button onClick={() => {ImportButt.FileDialog({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange})}}>Import Diagram</button>
		</div>
		</div>

		<div className="dropdown">
		<button id="export-button" onClick={() =>{ImportButt.clickFunc.showDropdown(1)}}>Export</button>
		<div className="dropdown-content">
		<button onClick={ExportButt.ExportJson}>Export as JSON</button>
		<button onClick={ExportButt.ExportImage}>Export as image</button>
		</div>
		</div>

		<button id="header-button">Help</button>
		</header>
		</Panel>

		<Panel position="bottom-left">

		<div id="nodes-list">
                <div id="rows">
                  <button id="bottom-bar-butts" onClick={MakeSquare}>
                  Square
                  </button> 
                  <button id="bottom-bar-butts" onClick={MakeCircle} title="Draws a circle at the origin"
                     >Circle
                  </button>
                </div>
		
		</div>


		<div id="nodes">
		<button id="butt" onClick={showNodesList}>Nodes</button>
		</div>

		</Panel>

		<Background variant={BackgroundVariant.Lines}/>


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
