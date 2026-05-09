import {useEffect} from 'react'
	
const Shortcuts = ({setNodes, setEdges}, removeLatestNode, actionBuffer) =>{
	document.addEventListener("keydown", (event) =>{
		if (event.altKey && event.key == "z"){
			setNodes((nds) => nds.filter(removeLatestNode));
		}

		// redo shortcut
		if (event.altKey && event.key == "x" && actionBuffer.current.length != 0){
			setNodes((nds) => nds.concat(actionBuffer.current.pop()))
		}
	})

}

const addBorderRadius = () =>{
	const dropdowns = document.getElementsByClassName("dropdown-content");
	dropdowns[0].children[0].style.borderRadius = "0px 0px 10px 10px";
	dropdowns[1].children[1].style.borderRadius = "0px 0px 10px 10px";

};

export {Shortcuts, addBorderRadius}
