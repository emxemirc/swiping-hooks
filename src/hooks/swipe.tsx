//

import { useEffect, useState } from "react";

/*
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
*/

/*
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
*/

type TSwipeDir = "up" | "down" | "left" | "right";

type TMousePosition = { x: number; y: number };
type TSwipeConfig = {
  threshold: number;
  onSwiped: (payload: { dir: TSwipeDir }) => void;
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

type TState = {
  isMouseDown: boolean;
  mousePosition: TMousePosition | undefined;
  startingPoint: TMousePosition | undefined;
};

function useSwipe(config: TSwipeConfig) {
  const [state, setState] = useState<TState>({
    isMouseDown: false,
    mousePosition: undefined,
    startingPoint: undefined,
  });

  const { isMouseDown, mousePosition, startingPoint } = state;

  const handleMouseDown = (e) => {
    setState((curr) => ({ ...curr, startingPoint: curr.mousePosition, isMouseDown: true }));
  };

  const handleMouseUp = (e) => {
    setState((curr) => ({ ...curr, startingPoint: undefined, isMouseDown: false }));

    if (!startingPoint) {
      return;
    }

    if (!mousePosition) {
      return;
    }

    const computed = checkMoveLenAndType(startingPoint, mousePosition, config.threshold);
  };

  const { x: mouseX, y: mouseY } = state.mousePosition || {};

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setState((curr) => ({ ...curr, mousePosition: { x: ev.clientX, y: ev.clientY } }));
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return {
    isMouseDown,
    mousePosition,
    handleMouseDown,
    handleMouseUp,
  };
}

export default useSwipe;
