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
const elementsToHide = [["configPNG"], ["configStyle"]]

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
		const node = Recipe.createNode(Math.random(), pos, "", "RectNode", true);
		setNodes((nds) => nds.concat(node));

	}, []);

	const MakeCircle = useCallback(() => {
		const node = Recipe.createNode(Math.random(), pos, "", "circleNode", true);
		setNodes((nds) => nds.concat(node));
	}, [])

	const HideConfig = useCallback((elements, divnumber) =>{
		const buttons = document.querySelectorAll(".sideButtonsBar button")

		for (let butt = 0; butt < buttons.length; butt++){
			if (butt != divnumber){
				buttons[butt].style.borderLeft = "0px solid";
				buttons[butt].style.borderColor = "#1D54B7"
				continue;
			}

			buttons[butt].style.borderLeft = "2px solid";
			buttons[butt].style.borderColor = "#1D54B7"
		}

		for (let div = 0; div < elements.length; div++){
			for (let i = 0; i < elements[div].length; i++){
				if (div == divnumber){
					document.getElementById(elements[div][i]).style.display = "initial";
					const buttons = document.querySelectorAll(".sideButtonsBar button");
	
				}
			
				else{

					document.getElementById(elements[div][i]).style.display = "none";
					const buttons = document.querySelectorAll(".sideButtonsBar button");

				}
			}
		
		}
	
	})

	return 	(

		<div style={{ height: '100%', width: '100%' }}>
		<div id="overlay" style={{height:"100%", width:"100%", zIndex: "50", position:"fixed"}}>

		<header id="settings">
		<div id="ExitDiv">
		<button id="exitButt" onClick={() => {document.getElementById("overlay").style.display="none"}}>Exit</button>
		<hr style={{color: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.08)"}}></hr>
		</div>

		<div style={{display: "flex", backgroundColor: "#1C283E", borderRadius: "50px", height: "8vh"}}>
		<button id="magnifyingGlass">h</button>
		<input id="settingsinput"></input>
		</div>

		<hr style={{color: "#355B87",height:"1px", backgroundColor: "rgba(255,255,255,0.08)", marginBottom: "0", marginTop: "0"}}></hr>

		<div style={{display: "flex"}}>

		<div id="settingsContent" style={{height: "70vh", width: "25%", backgroundColor: "#162030", display: "flex"}}>

		<div className="sideButtonsBar">
		<button onClick={() => {HideConfig(elementsToHide, 0)}}>Output</button>
		<button onClick={() => {HideConfig(elementsToHide, 1)}}>Appearance</button>
		</div>

		</div>

		<div id="longVertLine"></div>

		<div style={{width: "100%", height: "100vh", backgroundColor: "#1a2a3a", minHeight: "0", overflow: "auto"}}>

		<div id="configPNG" style={{display: "block"}}>
		<div style={{backgroundColor: "#1c283e", width: "100%"}}>
		<header style={{backgroundColor: "#1c283e", color: "rgba(255, 255, 255, 0.8)", 
				marginLeft: "45%", display: "flex"}}>Image</header>
		<hr style={{height: "2px", width: "100vw", color: "#204b6b", backgroundColor: "rgba(255,255,255,0.012)"}}></hr>
		</div>

		<div>
		<div style={{display: "flex", flexDirection: "rows"}}>
		<p style={{color: "rgba(255, 255, 255, 0.8)", marginLeft: "2%"}}>Width: </p>
		<div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
		<input id="DimensionInput"></input>
		</div>

		</div>

		<div style={{display: "flex", flexDirection: "rows"}}>
		<p style={{color: "rgba(255, 255, 255, 0.8)", marginLeft: "2%"}}>Height: </p>

		<div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
		<input id="DimensionInput"></input>
		</div>

		</div>

		</div>

		</div>
		
		<div id="configStyle" style={{display: "none"}}>
		<div style={{backgroundColor: "#1c283e"}}>
		<header style={{color: "rgba(255,255,255, 0.8)", marginLeft: "40%", display: "flex"}}>Appearance</header>
		<hr style={{color: "#204b6b"}}></hr>
		</div>

		<div style={{display: "flex", flexDirection: "rows", marginLeft: "20px"}}>
		<p style={{color: "rgba(255, 255, 255, 0.8)"}}>Language:</p>
		<select id="DropdownSelect">
		<option value="english">English</option>
		<option value="spanish">Spanish</option>
		</select>
		</div>

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
