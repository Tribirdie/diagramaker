import {addEdge} from '@xyflow/react';

class Recipes{
	createNode(ids, pos, labels, types, isDraggable){
		const newNode = {
		id: ids.toString(),
		position: pos,
		data: {label:labels},
		type: types,
		// only false for origin cursor. it should only move on click on pane, includes connecting edges.
		draggable: isDraggable 
		}
		
		return newNode

	}

	createEdge(ids, targets, sources, tHandle, sHandle){
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
}

class Oven{
	constructor(recipe){
		this.recipe = recipe;
	}

	renderNode = (props, {setNodes, nodes}) =>{
		const node = this.recipe.createNode(props[0], props[1], props[2], props[3], props[4]);
		setNodes((nds) => nds.concat(node));
	}

	renderEdge = (props, {setEdges, edges}) =>{
		const edge = this.recipe.createEdge(props[0], props[1], props[2], props[3], props[4]);
		setEdges((eds) => addEdge(edge, edges));
	}
}

export {Recipes, Oven};
