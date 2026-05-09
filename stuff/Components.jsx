import {useCallback, memo} from 'react';
import {Position, Handle, NodeResizer} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getBezierPath, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';

const TextEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  // Create a Bezier path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
      <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            borderRadius: 5,
            fontWeight: 700,
	    pointerEvents: 'all',
          }}

	  className="nodrag nopan"

        >
          <textarea id="textarea"></textarea>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const RegEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  // Create a Bezier path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
      <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            borderRadius: 5,
            fontWeight: 700,
	    pointerEvents: 'all',
          }}

	  className="nodrag nopan"

        >
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const CircleNode = memo(({selected}) =>{
	return (
		<div id="circlenode">
		<NodeResizer isVisible={selected} color="#304b6b">
		</NodeResizer>
		<textarea id="input2"></textarea>
		<Handle type='source' position={Position.Bottom} id="bottom"/>
		<Handle type='target' position={Position.Top} id="top"/>
	
		<Handle type='target' position={Position.Left} id="left"/>
		<Handle type='source' position={Position.Right} id="right"/>

		</div>
	)

});

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

const Origin = memo(({data}) =>{

	return (
		<div id="OriginDiv" title="Spawning point for nodes">

		<div id="originNode">
		{data.label}
		</div>

		<div id="line-bottom">
		</div>

		<div id="line-right">
		</div>


		<div id="line-left">
		</div>

		<div id="line-top">
		</div>
		</div>
	)
});

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
});

export {RectangularNode, CircleNode, Origin, Text, TextEdge, RegEdge}
