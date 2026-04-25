import '@xyflow/react/dist/style.css';
import {useCallback} from 'react'
import exit from './assets/exitButton.png'
import glass from './assets/magnifyingGlass.png'

const elementsToHide = [["configPNG"], ["configStyle"]];

const HideConfig = (elements, divnumber) =>{
	document.getElementById("DropdownSelect").addEventListener("change", (event) =>{
		window.localStorage.setItem("lang", parseInt(event.target.value));
		window.location.reload();
	});

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

function SearchBar({}) {
	return (
		<div style={{display: "flex", backgroundColor: "#1C283E", borderRadius: "50px", height: "8vh"}}>
		<button style={{border: "none", backgroundColor: "transparent"}}>
		<img src={glass} width="45px" height="45px"></img>
		</button>

		<input id="settingsinput"></input>
		</div>
	)

}

function SideBar({language}){
	return (
		<div id="settingsContent" style={{height: "70vh", width: "25%", backgroundColor: "#162030", display: "flex"}}>
		<div className="sideButtonsBar">
		<button onClick={() => {HideConfig(elementsToHide, 0)}}>{language.output}</button>
		<button onClick={() => {HideConfig(elementsToHide, 1)}}>{language.appearance}</button>
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

		</div>

		</div>
		
		<div id="configStyle" style={{display: "none"}}>
		<div style={{backgroundColor: "#1c283e"}}>
		<header style={{color: "rgba(255,255,255, 0.8)", marginLeft: "40%", display: "flex"}}>{language.appearance}</header>
		<hr style={{color: "#204b6b"}}></hr>
		</div>

		<div style={{display: "flex", flexDirection: "rows", marginLeft: "20px"}}>
		<p style={{color: "rgba(255, 255, 255, 0.8)"}}>{language.language}:</p>
		<select id="DropdownSelect">
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
		<SearchBar></SearchBar>

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

export {Settings};
