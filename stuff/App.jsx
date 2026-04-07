import {toPng} from 'html-to-image'
import {React, useCallback, useRef} from 'react'
import {reconnectEdge, addEdge, useEdgesState,
	Position, ReactFlow, MarkerType, ReactFlowProvider, useReactFlow,
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

const nodeTypes = {circleNode: CircleNode, origin: Origin, RectNode: RectangularNode}
const edgeTypes = {textEdge: TextEdge}

let node = [];
const edge = [];

let clicked = 0;
let origin_exists = false;
let pos = {x:50, y:50}
let edgeDropped = false;
let target = 'left';
let source = 'right'

function Inner({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange}){
	const edgeReconnect = useRef(true);
	const reactFlow = useReactFlow();

	const DropButton = new DropdownButton();
	const ImportButt = new ImportButton(DropButton, true, 1);
	const ExportButt = new ExportButton(DropButton, reactFlow, node);

	const Recipe = new Recipes(); 
	const Baker = new Oven(Recipe);

	const getPos = (e) => {
		if (!edgeDropped){
			const screenPos = {x:e.clientX, y:e.clientY};
			pos = reactFlow.screenToFlowPosition(screenPos)
		

		        if (!origin_exists){
				const originNode = ["og", pos, "", "origin", false]
				Baker.renderNode(originNode, {setNodes, nodes})
				origin_exists = true;
			}
			
			setNodes((nds) => nds.map((node) =>{
				if (!(node.id == "og") ){
					return node
				}

			        return Recipe.createNode("og", pos, "", "origin", false)
			}))
		}

		edgeDropped = false;
	}

	const MakeSquare = useCallback(() => {
		const props = [Math.random(), pos, "", "RectNode", true]
		Baker.renderNode(props, {setNodes, nodes})
	}, []);

	const MakeCircle = useCallback(() => {
		const props = [Math.random(), pos, "", "circleNode", true]
		Baker.renderNode(props, {setNodes, nodes})
	}, [])

	const connectHandles = (handleId, cmp,src, tar) =>{
		if (handleId == cmp){
			source = src;
			target = target;
		}
	}

	const onConnectStart = useCallback((_, {handleId}) =>{
		connectHandles(handleId, "bottom", "bottom" ,"top")
		connectHandles(handleId, "top", "bottom", "top")
		connectHandles(handleId, "right", "right", "left")
		connectHandles(handleId, "left", "right", "left")
	})

	const onConnect = useCallback((connection) =>{
		const CreatedEdge = [Math.random(), connection.target, connection.source, target, source]
		Baker.renderEdge(CreatedEdge, {setEdges, edges})
		edgeDropped = true;
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
		<button id="butt" onClick={() => {DropButton.showDropup(2)}}>Nodes</button>
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
