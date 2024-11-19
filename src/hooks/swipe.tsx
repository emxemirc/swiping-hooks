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

const useMousePosition = (disabled?: boolean) => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

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

type TMousePosition = ReturnType<typeof useMousePosition>;

function useSwipe() {
  const { isMouseDown, onMouseDown, onMouseUp } = useMouseIsDown();
  const { x: mouseX, y: mouseY } = useMousePosition();
  const [startingPoint, setStartingPoint] = useState<TMousePosition | null>(null);

  useEffect(() => {
    if (!isMouseDown && !!startingPoint) {
      setStartingPoint(null);
      return;
    }
    if (isMouseDown) {
      setStartingPoint({ x: mouseX, y: mouseY });
      return;
    }
  }, [isMouseDown]);
}
