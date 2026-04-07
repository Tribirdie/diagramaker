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
}

class NodeOven{
	constructor(recipe){
		this.recipe = recipe;
	}

	render = (type, props, {setNodes, nodes}) =>{
		const node = this.recipe.createNode(props[0], props[1], props[2], props[3], props[4])
		setNodes((nds) => nds.concat(node))
	}
}

export {Recipes, NodeOven};
