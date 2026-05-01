import {toPng, toJpeg} from 'html-to-image'
import {getNodesBounds, getViewportForBounds, useReactFlow} from '@xyflow/react'

class DropdownButton{
	constructor(){
		this.times_clicked = [0,0,0];
	}

	showDropdown(cssClassNum){
		const element = document.getElementsByClassName("dropdown-content")[cssClassNum]


		if (!this.times_clicked[cssClassNum] == 1){
			if (cssClassNum === 0){
				element.style.height = "10vh";
				element.querySelector("button").style.height = "10vh";
				document.getElementById("header").style.borderRadius = "5px 5px 5px 1px";
			}

			else{
				element.style.height = "20vh";
				element.querySelectorAll("button")[0].style.height = "10vh";
				element.querySelectorAll("button")[1].style.height = "10vh";
			}

			this.times_clicked[cssClassNum] += 1;
			return;
		}

		if (cssClassNum === 0){
			element.style.height = "0px";
			element.querySelector("button").style.height = "0px";
			element.addEventListener("transitionend", () =>{
				document.getElementById("header").style.borderRadius = "5px 5px 5px 5px";
			}, {once: true});
		}

		else{
			element.style.height = "0px";
			const dropdowns = element.querySelectorAll("button");
			dropdowns[0].style.height = "0px";
			dropdowns[1].style.height = "0px";
		}

		this.times_clicked[cssClassNum] = 0;
	}

	showDropup(buttNum){
		const nodes_list = document.getElementById("nodes-list");
		if (this.times_clicked[buttNum] !== 1){
			nodes_list.style.height = "25vh";
			this.times_clicked[buttNum] += 1;
			return
		}
		
		document.getElementById("nodes-list").style.height = "0px";
		this.times_clicked[buttNum] = 0;
	}
}

class ImportButton{
	constructor(clickFunc, run, timesClickedImport, lang){
		this.clickFunc = clickFunc;
		this.run = run;
		this.timesClickedImport = timesClickedImport;
		this.lang = lang;
	}

	checkForCancel = (language) =>{
		this.timesClickedImport = 1;
		document.getElementsByClassName("dropdown-content")[0].children[0].textContent = this.lang.importJson;
	}

	FileDialog = ({setNodes, nodes,  setEdges, edges}) => {
		const file = document.getElementById("file-dialog")

		file.removeEventListener("cancel", this.checkForCancel);
		file.addEventListener("cancel", this.checkForCancel);

		const read = new FileReader()
	
		read.onload = (e) => {
			const str_to_obj = JSON.parse(e.target.result)
			setNodes([]);
			setEdges([]);
			setNodes((nds) => nds.concat(str_to_obj.nodes));
			setEdges((eds) => eds.concat(str_to_obj.edges));
			this.timesClickedImport = 1
			document.getElementsByClassName("dropdown-content")[0].children[0].textContent = this.lang.importJson; 
		};

		// don't open file dialog if clicked for second time. that's when the nodes load.
		if (this.timesClickedImport !== 2){
			read.onload = null; // release previous result
			this.timesClickedImport = 2;
			file.click();
			document.getElementsByClassName("dropdown-content")[0].children[0].textContent = this.lang.loadDiagram;
		}

		const ImportedNodes = file.files[0];
		try{
			const readText = read.readAsText(ImportedNodes);
		}

		catch (e){
			console.log("No file selected.")
		}
	}

}

class ExportButton{
	constructor(clickFunc, hook, node, props){
		this.clickFunc = clickFunc;
		this.hook = hook;
		this.node = node;
		this.props = props;
	}

	ImgExt = (ext, app, h, w) =>{
		if (ext !== "PNG"){
			return toJpeg(app, {
				width: w,
				height: h,
				quality: 1,
				backgroundColor: "white",
				includeStyleProperties: this.props
			})
		}

		return toPng(app, {
			width: w,
			height: h,
			quality: 1,
			backgroundColor: "white",
			includeStyleProperties: this.props
		})

	}

	makeImage = (getApp, h, w) =>{

		this.ImgExt(document.extension, getApp, h, w).then( (url) => {
			const dwn = document.createElement('a');
			dwn.href = url
			dwn.download = url.split('/').pop();
			document.body.appendChild(dwn);
			dwn.click()
			document.body.removeChild(dwn);
		});
	}

	ExportImage = async () =>{
		const getApp = document.querySelector('.react-flow__viewport');	
		this.makeImage(getApp, document.imageHeight, document.imageWidth);
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
