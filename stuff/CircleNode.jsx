import {useCallback} from 'react';
import {Position, Handle} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function CircleNode({data}){


	return (
		<div id="circlenode">
		<p>
		<input id="input"></input>
		</p>

		<Handle type='source' position={Position.Bottom}/>
		<Handle type='target' position={Position.Top} id="top"/>

		</div>
	)
}

export default CircleNode
