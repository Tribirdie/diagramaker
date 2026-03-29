import {useCallback, memo} from 'react';
import {Position, Handle} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const RectangularNode = memo(() =>{
	return (
		<div id="rectangle"> 
		<input id="input"></input>

		<Handle type='target' position={Position.Top} id="top"/>
		<Handle type='target' position={Position.Left} id="left"/>

		<Handle type='source' position={Position.Bottom} id="bottom"/>
		<Handle type='source' position={Position.Right} id="right"/>
		</div>
	)
})

export default RectangularNode
