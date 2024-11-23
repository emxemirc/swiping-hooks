import { describe, it, expect } from "vitest";
import { checkMoveLenAndType, computeSwipeAndDecideDirection } from "./helpers";

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
