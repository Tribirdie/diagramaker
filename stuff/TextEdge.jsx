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
            background: '#ffcc00',
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
	    pointerEvents: 'all',
          }} 
	  
	  className="nodrag nopan"

        >
          <input id="input"></input>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default TextEdge;
