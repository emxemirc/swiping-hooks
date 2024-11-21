//

import { useEffect, useState } from "react";

//

//

const useMouseIsDown = () => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const onMouseDown = (e) => {
    setIsMouseDown(true);
  };

  const onMouseUp = (e) => {
    setIsMouseDown(false);
  };

  return {
    isMouseDown,
    onMouseDown,
    onMouseUp,
  };
};

type TSwipeDir = "up" | "down" | "left" | "right";

type TMousePosition = { x: number; y: number };
type TSwipeConfig = {
  threshold: number;
  onSwiped: (payload: { dir: TSwipeDir }) => void;
};

const useMousePosition = (disabled?: boolean) => {
  const [mousePosition, setMousePosition] = useState<TMousePosition>();

  useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    if (!disabled) {
      window.addEventListener("mousemove", updateMousePosition);
    }

    if (disabled) {
      window.removeEventListener("mousemove", updateMousePosition);
    }

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [disabled]);

  return mousePosition;
};

export function checkMoveLenAndType(startingPoint: TMousePosition, currentPoint: TMousePosition, threshold: number) {
  const xAxisDiff = currentPoint.x - startingPoint.x;
  const yAxisDiff = currentPoint.y - startingPoint.y;

  const calculated = {
    isTopDownSwipe: Math.abs(yAxisDiff) > threshold && yAxisDiff > 0,
    isDownTopSwipe: Math.abs(yAxisDiff) > threshold && yAxisDiff < 0,
    isLeftToRightSwipe: Math.abs(xAxisDiff) > threshold && xAxisDiff > 0,
    isRightToLeftSwipe: Math.abs(xAxisDiff) > threshold && xAxisDiff < 0,
  };

  return calculated;
}

function useSwipe(config: TSwipeConfig) {
  const { isMouseDown, onMouseDown, onMouseUp } = useMouseIsDown();
  const mousePosition = useMousePosition();
  const { x: mouseX, y: mouseY } = mousePosition || {};
  const [startingPoint, setStartingPoint] = useState<TMousePosition | null>(null);

  useEffect(() => {
    if (!isMouseDown && !!startingPoint) {
      setStartingPoint(null);
      return;
    }

    if (!mousePosition || !mouseX || !mouseY) {
      return;
    }

    if (isMouseDown) {
      setStartingPoint({ x: mouseX, y: mouseY });
      return;
    }
  }, [isMouseDown]);

  useEffect(() => {
    if (!isMouseDown || !startingPoint) {
      return;
    }

    if (!mousePosition) {
      return;
    }

    checkMoveLenAndType(startingPoint, mousePosition, config.threshold);
  }, [mouseX, mouseY]);

  return {
    isMouseDown,
    mousePosition,
  };
}

export default useSwipe;
