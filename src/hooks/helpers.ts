import { TMousePosition, TSwipeDir } from "./types";

export function checkMoveLenAndType(startingPoint: TMousePosition, currentPoint: TMousePosition, threshold: number) {
  const xAxisDiff = currentPoint.x - startingPoint.x;
  const yAxisDiff = currentPoint.y - startingPoint.y;

  const calculated = {
    isTopDownSwipe: Math.abs(yAxisDiff) > threshold && yAxisDiff > 0,
    isDownTopSwipe: Math.abs(yAxisDiff) > threshold && yAxisDiff < 0,
    isLeftToRightSwipe: Math.abs(xAxisDiff) > threshold && xAxisDiff > 0,
    isRightToLeftSwipe: Math.abs(xAxisDiff) > threshold && xAxisDiff < 0,
    diff: {
      xAxisDiff,
      yAxisDiff,
    },
    hasSwipe: Math.abs(yAxisDiff) > threshold || Math.abs(xAxisDiff) > threshold,
  };

  return calculated;
}

export function computeSwipeAndDecideDirection(
  startingPoint: TMousePosition,
  currentPoint: TMousePosition,
  threshold: number
): { dir: TSwipeDir | undefined; computed: ReturnType<typeof checkMoveLenAndType> } {
  const computed = checkMoveLenAndType(startingPoint, currentPoint, threshold);
  const {
    diff: { xAxisDiff, yAxisDiff },
    hasSwipe,
  } = computed;

  if (!hasSwipe) {
    return {
      dir: undefined,
      computed,
    };
  }

  let dir: TSwipeDir;
  const swipeAxis = Math.abs(xAxisDiff) >= Math.abs(yAxisDiff) ? "xaxis" : "yaxis";

  if (swipeAxis === "xaxis") {
    dir = xAxisDiff > 0 ? "right" : "left";
  } else {
    dir = yAxisDiff > 0 ? "down" : "up";
  }

  return {
    dir,
    computed,
  };
}
