import {useCallback} from 'react';
import {Position, Handle} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function CircleNode({data}){


	return (
		<div id="circlenode">
		<p>
		{data.label}
		</p>

		<Handle type='loose' position={Position.Bottom}/>
		</div>
	)
}

export default CircleNode
