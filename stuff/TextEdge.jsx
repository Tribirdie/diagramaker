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
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
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

export default TextEdge;
