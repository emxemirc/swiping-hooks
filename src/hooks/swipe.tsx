//

import { useState } from "react";
import { TMousePosition, TSwipeDir } from "./types";
import { computeSwipeAndDecideDirection } from "./helpers";

type TSwipeConfig = {
  threshold: number;
  onSwiped: (payload: { dir: TSwipeDir }) => void;
};

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

  const handleMouseDown = () => {
    setState((curr) => ({ ...curr, startingPoint: curr.mousePosition, isMouseDown: true }));
  };

  const handleMouseUp = () => {
    setState((curr) => ({ ...curr, startingPoint: undefined, isMouseDown: false }));

    if (!startingPoint) {
      return;
    }

    if (!mousePosition) {
      return;
    }

    const swipe = computeSwipeAndDecideDirection(startingPoint, mousePosition, config.threshold);
    if (!swipe.computed.hasSwipe) {
      return;
    }

    config.onSwiped({ dir: swipe.dir as TSwipeDir });
  };

  const updateMousePosition = (ev: any) => {
    setState((curr) => ({ ...curr, mousePosition: { x: ev.clientX, y: ev.clientY } }));
  };

  const handleMouseMove = (e: any) => {
    updateMousePosition(e);
  };

  return {
    isMouseDown,
    mousePosition,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  };
}

export default useSwipe;
