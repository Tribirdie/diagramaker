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

window.addEventListener("load", () =>{
	const dropdowns = document.getElementsByClassName("dropdown-content");
	dropdowns[0].children[0].style.borderRadius = "0px 0px 10px 10px";
	dropdowns[1].children[1].style.borderRadius = "0px 0px 10px 10px";


})

const nodeTypes = {circleNode: CircleNode, origin: Origin, RectNode: RectangularNode}
const edgeTypes = {textEdge: TextEdge}

const node = [];
const edge = [];

let clicked = 0;
let origin_exists = false;
let pos = {x:50, y:50}
let edgeDropped = false;
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
		if (!edgeDropped){
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

		edgeDropped = false;
	}

	const MakeSquare = useCallback(() => {
		const node = Recipe.createNode(Math.random(), pos, "", "RectNode", true)
		setNodes((nds) => nds.concat(node));

	}, []);

	const MakeCircle = useCallback(() => {
		const node = Recipe.createNode(Math.random(), pos, "", "circleNode", true)
		setNodes((nds) => nds.concat(node));
	}, [])
	const HideConfig = useCallback((elements) =>{
		if (times_clicked == 0){
			document.getElementById(elements[0]).style.display = "none"
			document.getElementById(elements[1]).style.display = "none";

			times_clicked += 1;
		}

		else{
			document.getElementById(elements[0]).style.display = "flex";
			document.getElementById(elements[1]).style.display = "flex";
			console.log(elements[1])

			times_clicked = 0;
		}
	
	})

	return 	(

		<div style={{ height: '100%', width: '100%' }}>
		<div id="overlay" style={{height:"100%", width:"100%", zIndex: "50", position:"fixed"}}>

		<header id="settings">
		<button id="exitButt" onClick={() => {document.getElementById("overlay").style.display="none"}}>Exit</button>
		<hr style={{marginTop: "0", marginBottom: "1px"}}></hr>

		<div style={{display: "flex", backgroundColor: "white", borderRadius: "20px", height: "8vh"}}>
		<button id="magnifyingGlass">h</button>
		<input id="settingsinput"></input>
		</div>

		<hr style={{color: "#355B87",height:"2px", backgroundColor: "#355B87", marginBottom: "0", marginTop: "0"}}></hr>

		<div style={{display: "flex"}}>

		<div id="settingsContent" style={{height: "70vh", width: "25%", backgroundColor: "red", display: "flex"}}>

		<div style={{marginBottom: "auto", display: "flex", flexDirection: "column"}}>
		<button onClick={() => {HideConfig(["configPNG", "configJSON"])}}>Output</button>
		<button style={{width: "10vw"}}>Appearance</button>
		</div>

		</div>

		<div id="longVertLine"></div>

		<div style={{width: "100%", height: "70vh", backgroundColor: "green", display: "flex"
				, alignItems: "center", justifyContent: "center", 
				flexDirection: "column", overflow: "auto"}}>

		<div id="configPNG">
		<header style={{marginLeft: "45%", display: "flex"}}>Image</header>
		<hr></hr>

		</div>
		
		<div id="configJSON">
		<header style={{marginLeft: "45%", display: "flex"}}>JSON</header>
		<hr></hr>
		</div>

		</div>

		</div>

		</header>
		</div>

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
		>

		<Panel position="top-left">
		<header id="header">
		<input type="file" accept=".json" id="file-dialog"></input>
		
		<div className="dropdown">
		<button id="button" onClick={() => {ImportButt.clickFunc.showDropdown(0)}}> Import</button>
		<div className="dropdown-content">
		<button onClick={() => {ImportButt.FileDialog({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange})}}>Select Diagram</button>
		</div>
		</div>

		<div className="dropdown">
		<button id="button" onClick={() =>{ImportButt.clickFunc.showDropdown(1)}}>Export</button>
		<div className="dropdown-content">
		<button onClick={ExportButt.ExportJson}>Export as JSON</button>
		<button onClick={ExportButt.ExportImage}>Export as image</button>
		</div>
		</div>

		<button id="button" onClick={() => {document.getElementById("overlay").style.display="flex"}}>Settings</button>
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
