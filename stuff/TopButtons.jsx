import {toPng} from 'html-to-image'
import {getNodesBounds, getViewportForBounds} from '@xyflow/react'

class DropdownButton{
	constructor(){
		this.times_clicked = [0,0,0];
	}

	showDropdown(cssClassNum){
		const element = document.getElementsByClassName("dropdown-content")[cssClassNum]

		if (!this.times_clicked[cssClassNum] == 1){
			element.style.display = "block";
			element.style.height = "50px";
			element.querySelector("button").style.height = "50px";

			if (cssClassNum == 0){
				document.getElementById("header").style.borderRadius = "5px 5px 5px 1px";
			}

			this.times_clicked[cssClassNum] += 1;
			return;
		}

		if (cssClassNum == 0){
			document.getElementById("header").style.borderRadius = "5px 5px 5px 5px";
		}

		element.style.display = "block";
		element.style.height = "0px";
		element.querySelector("button").style.height = "0px";

		this.times_clicked[cssClassNum] = 0;
	}

	showDropup(buttNum){
		if (!this.times_clicked[buttNum] == 1){
			document.getElementById("nodes-list").style.display = "block";
			this.times_clicked[buttNum] += 1;
			return
		}
		
		document.getElementById("nodes-list").style.display = "none";
		this.times_clicked[buttNum] = 0;
	}
}

class ImportButton{
	constructor(clickFunc, run, timesClickedImport){
		this.clickFunc = clickFunc;
		this.run = run;
		this.timesClickedImport = timesClickedImport;
	}

	FileDialog = ({setNodes, nodes, onNodesChange, setEdges, edges, onEdgesChange}) => {
		const file = document.getElementById("file-dialog")
		const read = new FileReader()
	
		read.onload = (e) => {
			const str_to_obj = JSON.parse(e.target.result)
			setNodes([])
			setEdges([])
			setNodes((nds) => nds.concat(str_to_obj.nodes))
			setEdges((eds) => eds.concat(str_to_obj.edges))
			this.timesClickedImport = 1
			document.getElementsByClassName("dropdown-content")[0].children[0].textContent = "Select Diagram"
		};

		// don't open file dialog if clicked for second time. that's when the nodes load.
		if (this.timesClickedImport != 2){
			read.onload = null; // release previous result
			this.timesClickedImport = 2;
			file.click();
			document.getElementsByClassName("dropdown-content")[0].children[0].textContent = "Load Diagram";
		}

		const ImportedNodes = file.files[0];

		try{
			const readText = read.readAsText(ImportedNodes);
		}

		catch (e){

		}

	}
}

class ExportButton{
	constructor(clickFunc, hook, node){
		this.clickFunc = clickFunc;
		this.hook = hook;
		this.node = node;
	}

	ExportImage = () =>{
		const getApp = document.querySelector('.react-flow__viewport');
		const nodesBounds = this.hook.getNodesBounds(this.node);
		const viewport = getViewportForBounds(nodesBounds, 1366, 768, 0.5, 2);

		toPng(getApp, {
			width: 1366,
			height: 1366,
			style: {
				width: 1366,
				height: 768,
			},
		}

		).then( (url) => {
			const dwn = document.createElement('a');
			dwn.href = url
			dwn.download = url.split('/').pop();
			document.body.appendChild(dwn);
			dwn.click()
			document.body.removeChild(dwn);
		})
	}

	ExportJson = () =>{
		const json = this.hook.toObject();
		const json_string = JSON.stringify(json);

		const str_to_blob = new Blob([json_string], {type: "application/json"});
		const url = URL.createObjectURL(str_to_blob);

		const dwn = document.createElement('a');
		dwn.href = url;
		dwn.download = url.split('/').pop();
		document.body.appendChild(dwn);
		dwn.click();
		document.body.removeChild(dwn);
	}
}


export {DropdownButton, ImportButton, ExportButton};
