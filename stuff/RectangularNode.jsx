import {useCallback, memo} from 'react';
import {Position, Handle, NodeResizer} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const RectangularNode = memo(({selected}) =>{
	return (
		<div id="rectangle">
		<NodeResizer isVisible={selected} color="#304b6b">
		</NodeResizer>
		<textarea id="input"></textarea>
		<Handle type='target' position={Position.Top} id="top"/>
		<Handle type='target' position={Position.Left} id="left"/>

		<Handle type='source' position={Position.Bottom} id="bottom"/>
		<Handle type='source' position={Position.Right} id="right"/>
		</div>

	)
})

export default RectangularNode
