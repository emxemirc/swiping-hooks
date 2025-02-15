import { describe, it, expect, vi } from "vitest";
import { checkMoveLenAndType, computeSwipeAndDecideDirection } from "./helpers";
import { renderHook, act } from "@testing-library/react";
import useSwipe from "./swipe";
import { TSwipeDir } from "./types";

describe("checkMoveLenAndType", () => {
  it("should detect top-down swipe when y difference exceeds threshold", () => {
    const startPoint = { x: 0, y: 0 };
    const endPoint = { x: 0, y: 100 };
    const threshold = 50;

    const result = checkMoveLenAndType(startPoint, endPoint, threshold);

    expect(result.hasSwipe).toBe(true);
    expect(result.isTopDownSwipe).toBe(true);
    expect(result.isDownTopSwipe).toBe(false);
    expect(result.isLeftToRightSwipe).toBe(false);
    expect(result.isRightToLeftSwipe).toBe(false);
  });

  it("should detect down-top swipe when negative y difference exceeds threshold", () => {
    const startPoint = { x: 0, y: 100 };
    const endPoint = { x: 0, y: 0 };
    const threshold = 50;

    const result = checkMoveLenAndType(startPoint, endPoint, threshold);

    expect(result.hasSwipe).toBe(true);
    expect(result.isTopDownSwipe).toBe(false);
    expect(result.isDownTopSwipe).toBe(true);
    expect(result.isLeftToRightSwipe).toBe(false);
    expect(result.isRightToLeftSwipe).toBe(false);
  });

  it("should detect left-to-right swipe when x difference exceeds threshold", () => {
    const startPoint = { x: 0, y: 0 };
    const endPoint = { x: 100, y: 0 };
    const threshold = 50;

    const result = checkMoveLenAndType(startPoint, endPoint, threshold);

    expect(result.hasSwipe).toBe(true);
    expect(result.isTopDownSwipe).toBe(false);
    expect(result.isDownTopSwipe).toBe(false);
    expect(result.isLeftToRightSwipe).toBe(true);
    expect(result.isRightToLeftSwipe).toBe(false);
  });

  it("should detect right-to-left swipe when negative x difference exceeds threshold", () => {
    const startPoint = { x: 100, y: 0 };
    const endPoint = { x: 0, y: 0 };
    const threshold = 50;

    const result = checkMoveLenAndType(startPoint, endPoint, threshold);

    expect(result.hasSwipe).toBe(true);
    expect(result.isTopDownSwipe).toBe(false);
    expect(result.isDownTopSwipe).toBe(false);
    expect(result.isLeftToRightSwipe).toBe(false);
    expect(result.isRightToLeftSwipe).toBe(true);
  });

  it("should not detect any swipe when movement is below threshold", () => {
    const startPoint = { x: 0, y: 0 };
    const endPoint = { x: 20, y: 20 };
    const threshold = 50;

    const result = checkMoveLenAndType(startPoint, endPoint, threshold);

    expect(result.hasSwipe).toBe(false);
    expect(result.isTopDownSwipe).toBe(false);
    expect(result.isDownTopSwipe).toBe(false);
    expect(result.isLeftToRightSwipe).toBe(false);
    expect(result.isRightToLeftSwipe).toBe(false);
  });

  it("should return RIGHT direction for left-to-right swipe", () => {
    const startPoint = { x: 0, y: 0 };
    const endPoint = { x: 100, y: 0 };
    const threshold = 50;

    const result = computeSwipeAndDecideDirection(startPoint, endPoint, threshold);

    expect(result.dir).toBe("right");
  });

  it("should return LEFT direction for right-to-left swipe", () => {
    const startPoint = { x: 100, y: 0 };
    const endPoint = { x: 0, y: 0 };
    const threshold = 50;

    const result = computeSwipeAndDecideDirection(startPoint, endPoint, threshold);

    expect(result.dir).toBe("left");
  });

  it("should return UP direction for bottom-to-top swipe", () => {
    const startPoint = { x: 0, y: 100 };
    const endPoint = { x: 0, y: 0 };
    const threshold = 50;

    const result = computeSwipeAndDecideDirection(startPoint, endPoint, threshold);

    expect(result.dir).toBe("up");
  });

  it("should return DOWN direction for top-to-bottom swipe", () => {
    const startPoint = { x: 0, y: 0 };
    const endPoint = { x: 0, y: 100 };
    const threshold = 50;

    const result = computeSwipeAndDecideDirection(startPoint, endPoint, threshold);

    expect(result.dir).toBe("down");
  });

  it("should return NONE direction when movement is below threshold", () => {
    const startPoint = { x: 0, y: 0 };
    const endPoint = { x: 20, y: 20 };
    const threshold = 50;

    const result = computeSwipeAndDecideDirection(startPoint, endPoint, threshold);

    expect(result.dir).toBe(undefined);
  });

  it("should prioritize horizontal direction in diagonal movement", () => {
    const startPoint = { x: 0, y: 0 };
    const endPoint = { x: 120, y: 100 };
    const threshold = 50;

    const result = computeSwipeAndDecideDirection(startPoint, endPoint, threshold);

    expect(result.dir).toBe("right");
  });
});

describe("useSwipe", () => {
  type SwipeTestConfig = {
    startCoords: { x: number; y: number };
    endCoords: { x: number; y: number };
    expectedDir: TSwipeDir | undefined;
    threshold?: number;
  };

  const testSwipe = async (config: SwipeTestConfig) => {
    const { startCoords, endCoords, expectedDir, threshold = 50 } = config;
    const onSwiped = vi.fn();
    const { result } = renderHook(() => useSwipe({ threshold, onSwiped }));

    act(() => {
      result.current.handleMouseMove(
        new MouseEvent("mousemove", {
          clientX: startCoords.x,
          clientY: startCoords.y,
        })
      );
      result.current.handleMouseDown();
    });

    expect(result.current.isMouseDown).toBe(true);
    expect(result.current.mousePosition).toEqual(startCoords);

    act(() => {
      result.current.handleMouseMove(
        new MouseEvent("mousemove", {
          clientX: endCoords.x,
          clientY: endCoords.y,
        })
      );
    });

    expect(result.current.mousePosition).toEqual(endCoords);

    act(() => {
      result.current.handleMouseUp();
    });

    if (expectedDir) {
      expect(onSwiped).toHaveBeenCalledWith({ dir: expectedDir });
    } else {
      expect(onSwiped).not.toHaveBeenCalled();
    }
  };

  it("should detect right swipe correctly", async () => {
    await testSwipe({
      startCoords: { x: 0, y: 0 },
      endCoords: { x: 100, y: 0 },
      expectedDir: "right",
    });
  });

  it("should detect left swipe correctly", async () => {
    await testSwipe({
      startCoords: { x: 100, y: 0 },
      endCoords: { x: 0, y: 0 },
      expectedDir: "left",
    });
  });

  it("should detect up swipe correctly", async () => {
    await testSwipe({
      startCoords: { x: 0, y: 100 },
      endCoords: { x: 0, y: 0 },
      expectedDir: "up",
    });
  });

  it("should detect down swipe correctly", async () => {
    await testSwipe({
      startCoords: { x: 0, y: 0 },
      endCoords: { x: 0, y: 100 },
      expectedDir: "down",
    });
  });

  it("should not trigger swipe when below threshold", async () => {
    await testSwipe({
      startCoords: { x: 0, y: 0 },
      endCoords: { x: 20, y: 0 },
      expectedDir: undefined,
    });
  });

  it("should track mouse position correctly during movement", async () => {
    const onSwiped = vi.fn();
    const { result } = renderHook(() => useSwipe({ threshold: 50, onSwiped }));

    act(() => {
      result.current.handleMouseMove(new MouseEvent("mousemove", { clientX: 0, clientY: 0 }));
      result.current.handleMouseDown();
    });

    expect(result.current.mousePosition).toEqual({ x: 0, y: 0 });

    act(() => {
      result.current.handleMouseMove(new MouseEvent("mousemove", { clientX: 25, clientY: 25 }));
    });

    expect(result.current.mousePosition).toEqual({ x: 25, y: 25 });
  });
});
