import {useCallback} from 'react'
import {addEdge, reconnectEdge} from '@xyflow/react'

class Connection{
	constructor(props={}, edgeDropped=false, edgeReconnect=true, handlesCheck=[], Recipe=null, source='left', target='right'){
		this.props = props;
		this.edgeDropped = edgeDropped;
		this.edgeReconnect = edgeReconnect;
		this.handlesCheck = handlesCheck;
		this.Recipe = Recipe;
		this.source = source;
		this.target = target
	}
	
	connectHandles = (handleId, cmp,src, tar) =>{
		if (handleId == cmp){
			this.source = src;
			this.target = tar;
		}
	}
	
	onConnectStart = (_, {handleId}) =>{
		for (let i = 0; i < this.handlesCheck.length; i++){
			this.connectHandles(handleId, this.handlesCheck[i][0], this.handlesCheck[i][1], this.handlesCheck[i][2]);
		}
	};

	onConnect = (connection) =>{
		const CreatedEdge = this.Recipe.createEdge(Math.random(), connection.target, connection.source, this.target, this.source)
		this.props.setEdges((eds) => addEdge(CreatedEdge, eds));
		this.edgeDropped = true;
	};

		
	onConnectEnd = () =>{
		this.edgeDropped = true;

	};

        onReconnectStart = () =>{
		this.edgeDropped = true;
		this.edgeReconnect.current = false;
	};
	
	onReconnect = (oldEdge, newConnection) =>{
		this.edgeDropped = true;
		this.edgeReconnect.current = true;
		this.props.setEdges((eds) => reconnectEdge(oldEdge,newConnection,eds));
	};
	
	onReconnectEnd = (_, edge) =>{
		if (!this.edgeReconnect.current){
			this.props.setEdges((eds) => eds.filter((e) => e.id !== edge.id))
			this.edgeDropped = true;
		}
	};

}

class ConnectionBuilder{
	constructor(){
		this.Connection = new Connection()
	}

	setProps = (propsObj) =>{
		this.Connection.props = propsObj;
	}

	setEdgeDropped = (droppedEdge) =>{
		this.Connection.edgeDropped = droppedEdge;
	}

	setEdgeReconnect = (edgeReconnection) =>{
		this.Connection.edgeReconnect = edgeReconnection;
	}

	setHandlesCheck = (handlesChecks) =>{
		this.Connection.handlesCheck = handlesChecks;
	}

	setRecipe = (recipe) =>{
		this.Connection.Recipe = recipe;
	}

	setSource = (Source) =>{
		this.Connection.source = Source;
	}

	setTarget = (Target) =>{
		this.Connection.target = Target;
	}

	build = () =>{
		return this.Connection;
	}
}

export {ConnectionBuilder}
