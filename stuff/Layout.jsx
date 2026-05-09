import '@xyflow/react/dist/style.css';
import {applyNodeChanges, useNodesState,
	Panel, Position, Background, BackgroundVariant,
	ConnectionMode} from '@xyflow/react';
import {memo} from 'react'
import exit from './assets/exitButton.png'
import palette from './assets/palette.png'
import square from './assets/square.png'
import circle from './assets/circle.png'
import output from './assets/output.png'
import text from './assets/text.png'
import regularEdge from './assets/regularEdge.png'
import textEdge from './assets/textEdge.png'

const elementsToHide = [["configPNG"], ["configStyle"]];

const setLanguage = (event) =>{
	window.localStorage.setItem("lang", parseInt(event.target.value));
	location.reload();
}

const setExtension = (event) =>{
	document.extension = event.target.value;
}

const saveDimension = (element, dimension) =>{
	element.addEventListener("keydown", (e) =>{
		if (e.key === "Enter"){
			if (dimension !== "w"){
				document.imageHeight = element.value;
				return;
			}
			
			document.imageWidth = element.value;
		}
	});

}
const HideConfig = (elements, divnumber) =>{

	const dropdown = document.querySelectorAll(".DropdownSelect");
	for (let drop = 0; drop < dropdown.length; drop++){
		if (drop !== 0){
			dropdown[drop].removeEventListener("change", setLanguage);
			dropdown[drop].addEventListener("change", setLanguage);
			continue
		}
		
		dropdown[drop].removeEventListener("change", setExtension);
		dropdown[drop].addEventListener("change", setExtension);
	}

	const buttons = document.querySelectorAll(".sideButtonsBar div")

	for (let butt = 0; butt < buttons.length; butt++){
		if (butt !== divnumber){
			buttons[butt].style.borderLeft = "0px solid";
			buttons[butt].style.borderColor = "#1D54B7"
			continue;
		
		}

		buttons[butt].style.borderLeft = "2px solid";
		buttons[butt].style.borderColor = "#1D54B7"
	}

	for (let div = 0; div < elements.length; div++){
		for (let i = 0; i < elements[div].length; i++){
			if (div !== divnumber){
				document.getElementById(elements[div][i]).style.display = "none";
				continue;
			}
			
			document.getElementById(elements[div][i]).style.display = "initial";
		}

	}
}

function ExitSection({}){
	return (
		<div id="exitdiv">
		<button id="exitButt" onClick={() => {document.getElementById("overlay").style.display="none"}}>
		<img src={exit} width="30px" height="30px"></img>
		</button>
		<hr style={{color: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.08)"}}></hr>
		</div>
	)
}

function SearchBar({language}) {
	return (
		<div style={{display: "flex", backgroundColor: "#1C283E", justifyContent: "center",
				borderRadius: "50px", height: "8vh"}}>
		<p style={{color: "rgba(255,255,255,0.8)"}}>{language.settings}</p>

		</div>
	)

}

function SideBar({language}){
	return (
		<div id="settingsContent" style={{height: "70vh", width: "25%", backgroundColor: "#162030", display: "flex"}}>
		<div className="sideButtonsBar">

		<div>
		<button onClick={() => {HideConfig(elementsToHide, 0)}}>{language.output}</button>
		<img src={output} width="20px" height="20px"></img>
		</div>

		<div>
		<button onClick={() => {HideConfig(elementsToHide, 1)}}>{language.appearance}</button>
		<img src={palette} width="20px" height="20px"></img>
		</div>

		</div>

		</div>

	)
}

function MainContent({language}){
	return (
		<div style={{width: "100%", height: "100vh", backgroundColor: "#1a2a3a", minHeight: "0", overflow: "auto"}}>

		<div id="configPNG" style={{display: "block"}}>
		<div style={{backgroundColor: "#1c283e", width: "100%"}}>
		<header style={{backgroundColor: "#1c283e", color: "rgba(255, 255, 255, 0.8)", 
				marginLeft: "45%", display: "flex"}}>{language.image}</header>
		<hr style={{height: "2px", width: "100vw", color: "#204b6b", backgroundColor: "rgba(255,255,255,0.012)"}}></hr>
		</div>

		<div>
		<div className="ImageDimensionsOptions">
		<p>{language.width} </p>
		<div>
		<input defaultValue="1366"></input>
		</div>

		</div>

		<div className="ImageDimensionsOptions">
		<p>{language.height} </p>

		<div>
		<input defaultValue="768"></input>
		</div>

		</div>

		<div style={{display: "flex", flexDirection: "rows", marginLeft: "10px"}}>
		<p style={{color: "rgba(255, 255, 255, 0.8)"}}>{language.extension}:</p>
		<select className="DropdownSelect">
		<option value="">{language.select}</option>
		<option value="PNG">PNG</option>
		<option value="JPEG">JPEG</option>
		</select>
		</div>

		</div>

		</div>
		
		<div id="configStyle" style={{display: "none"}}>
		<div style={{backgroundColor: "#1c283e"}}>
		<header style={{color: "rgba(255,255,255, 0.8)", marginLeft: "40%", display: "flex"}}>{language.appearance}</header>
		<hr style={{color: "#204b6b"}}></hr>
		</div>

		<div style={{display: "flex", flexDirection: "rows", marginLeft: "20px"}}>
		<p style={{color: "rgba(255, 255, 255, 0.8)"}}>{language.language}:</p>
		<select className="DropdownSelect">
		<option value="">{language.select}</option>
		<option value="3">Français</option>
		<option value="2">Italiano</option>
		<option value="1">English</option>
		<option value="0">Español</option>
		</select>
		</div>

		</div>

		</div>
	)
}

function Settings({language}){
	return (
		<div id="overlay" style={{height:"100%", width:"100%", zIndex: "50", position:"fixed"}}>

		<header id="settings">
		<ExitSection></ExitSection>
		<SearchBar language={language}></SearchBar>

		<hr style={{color: "#355B87",height:"1px", backgroundColor: "rgba(255,255,255,0.08)", marginBottom: "0", marginTop: "0"}}></hr>

		<div style={{display: "flex"}}>
		<SideBar language={language}></SideBar>
	        <div id="longVertLine"></div>
		<MainContent language={language}></MainContent>
		</div>

		</header>
		</div>
	)
}


function TopPanel({ImportButt, ExportButt, language, setNodes, nodes, setEdges, edges}){
	return (
		<header id="header">
		<input type="file" accept=".json" id="file-dialog"></input>

		<div className="dropdown">
		<button id="button" onClick={() => {ImportButt.clickFunc.showDropdown(0)}}>{language.import}</button>
		<div className="dropdown-content">
		<button onClick={() => {ImportButt.FileDialog({setNodes, nodes, setEdges, edges, language})}}>{language.importJson}</button>
		</div>
		</div>

		<div className="dropdown">
		<button id="button" onClick={() =>{ImportButt.clickFunc.showDropdown(1)}}>{language.export}</button>
		<div className="dropdown-content">
		<button onClick={ExportButt.ExportJson}>{language.exportJson}</button>
		<button onClick={ExportButt.ExportImage}>{language.exportImg}</button>
		</div>
		</div>

		<button id="button" onClick={() => {
			document.getElementById("overlay").style.display="flex"
			const dimensionInputs = document.querySelectorAll(".ImageDimensionsOptions input");

			for (let dimension = 0; dimension < dimensionInputs.length; dimension++){
				if (dimension !== 0){
					saveDimension(dimensionInputs[dimension], "h");
					continue;
				}

				saveDimension(dimensionInputs[dimension], "w");
			}
		}}>{language.settings}</button>

		</header>
	)
}

function PanelBottom({ConnectorEdge, RegularEdge, TextNode, MakeSquare, MakeCircle, DropButton, language}){
	return (
		<>
		<div id="nodes-list">
                <div className="rows">
                  <button onClick={MakeSquare} title="Draws a square">
		  <img src={square} width="30px" height="30px"></img>
                  </button>

                  <button onClick={MakeCircle} title="Draws a circle">
		  <img src={circle} width="30px" height="30px"></img>
                  </button>
		  
		  <button onClick={TextNode} title="Draws a text node">
		  <img src={text} width="30px" height="30px"></img>
		  </button>
                </div>

		<div>
		<hr></hr>
		<p style={{color: "rgba(255, 255, 255, 0.8)", display: "flex", justifyContent: "center"}}>Edges</p>
		<hr></hr>
		</div>

                <div className="rows">
                  <button onClick={RegularEdge} title="Draws a square">
		  <img src={regularEdge} width="30px" height="30px"></img>
                  </button>

		  <button onClick={ConnectorEdge} title="Changes edge type to connector">
		  <img src={textEdge} width="30px" height="30px"></img>
		  </button>
                </div>

		</div>

		<div id="nodes">
		<button id="butt" onClick={() => {DropButton.showDropup(2)}}>{language.nodes}</button>
		</div>
		</>
 	)

}

const Main = memo(({ImportButt, ExportButt, DropButton, MakeSquare, MakeCircle, RegularEdge, ConnectorEdge,
	TextNode, language, nodes, setEdges, setNodes, edges}) =>{
	return (
		<>
		<Panel position="top-left">
		<TopPanel ImportButt={ImportButt} ExportButt={ExportButt} language={language} nodes={nodes}
		setEdges={setEdges} setNodes={setNodes} edges={edges}>
		</TopPanel>
		</Panel>

		<Panel position="bottom-left">

		<PanelBottom RegularEdge={RegularEdge} ConnectorEdge={ConnectorEdge} MakeSquare={MakeSquare} TextNode={TextNode}
		MakeCircle={MakeCircle} DropButton={DropButton} language={language}>
		</PanelBottom>

		</Panel>

		<Background variant={BackgroundVariant.Lines}/>
		</>
 	)
})

export {Settings, Main};
