import {memo} from 'react';
import {Position, Handle, NodeResizer} from '@xyflow/react';

const Text = memo((selected) =>{
	return (
		<div className="textnode">

		<Handle type='source' position={Position.Bottom} id="bottom"/>
		<Handle type='target' position={Position.Top} id="top"/>

		<Handle type='target' position={Position.Left} id="left"/>
		<Handle type='source' position={Position.Right} id="right"/>

		<textarea></textarea>
		</div>
	)
});

export default Text;
