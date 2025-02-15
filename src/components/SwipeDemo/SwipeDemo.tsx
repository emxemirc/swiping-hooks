import { useState } from "react";
import useSwipe from "../../hooks/swipe";
import { TSwipeDir } from "../../hooks/types";

type SwipeDemoProps = {
  threshold?: number;
};

const SwipeDemo = ({ threshold = 50 }: SwipeDemoProps) => {
  const [lastSwipe, setLastSwipe] = useState<TSwipeDir | null>(null);

  const { isMouseDown, mousePosition, handleMouseDown, handleMouseUp, handleMouseMove } = useSwipe({
    threshold,
    onSwiped: ({ dir }) => {
      setLastSwipe(dir);
    },
  });

  return (
    <div
      style={{
        width: "300px",
        height: "300px",
        background: isMouseDown ? "#e0e0e0" : "#f5f5f5",
        border: "2px solid #ccc",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        userSelect: "none",
        padding: "10px",
      }}
      data-testid="swipe-container"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div>Swipe anywhere in this box</div>
      {lastSwipe && (
        <div data-testid="swipe-direction" data-swipe-state={lastSwipe}>
          Last swipe direction: <strong>{lastSwipe}</strong>
        </div>
      )}
      {mousePosition && (
        <div data-testid="mouse-position" data-position-x={mousePosition.x} data-position-y={mousePosition.y}>
          Position: {mousePosition.x}, {mousePosition.y}
        </div>
      )}
    </div>
  );
};

export default SwipeDemo;
