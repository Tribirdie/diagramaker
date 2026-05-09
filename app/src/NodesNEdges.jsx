import {useCallback} from 'react'

const MakeSquare = ({setNodes}, Recipe, pos) => {
	const node = Recipe.createNode(Math.random(), pos.current, "", "RectNode", true);
	setNodes((nds) => nds.concat(node));
}

const MakeCircle = ({setNodes}, Recipe, pos) => {
	const node = Recipe.createNode(Math.random(), pos.current, "", "circleNode", true);
	setNodes((nds) => nds.concat(node));
}

const TextNode = ({setNodes}, Recipe, pos) => {
	const node = Recipe.createNode(Math.random(), pos.current, "", "text", true);
	setNodes((nds) => nds.concat(node));
}

const ConnectorEdge = (edgeType, connectionHandler) =>{
	edgeType.current = "textEdge";
	connectionHandler.edgeType =  edgeType.current;

	const e = document.getElementById("nodes-list").children;
	const p = e[2].children;
		
	for (let j = 0; j < p.length; j++){
		if (j != 0){
			p[j].style.backgroundColor = "#6a4d31"
			continue;
		}

		p[j].style.backgroundColor = "#204B6B";
	}
	
}

const RegularEdge = (edgeType, connectionHandler) =>{
	edgeType.current = "reg";
	connectionHandler.edgeType = edgeType.current;
	const e = document.getElementById("nodes-list").children;
	const p = e[2].children;
		
	for (let j = 0; j < p.length; j++){
		if (j != 1){
			p[j].style.backgroundColor = "#6a4d31"
			continue;
		}

		p[j].style.backgroundColor = "#204B6B";
	}
}

export {RegularEdge,MakeSquare,MakeCircle,TextNode,ConnectorEdge}
