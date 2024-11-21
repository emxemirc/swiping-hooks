import { describe, it, expect } from "vitest";
import { checkMoveLenAndType } from "./swipe";

describe("checkMoveLenAndType", () => {
  it("should detect top-down swipe when y difference exceeds threshold", () => {
    const startPoint = { x: 0, y: 0 };
    const endPoint = { x: 0, y: 100 };
    const threshold = 50;

    const result = checkMoveLenAndType(startPoint, endPoint, threshold);

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

    expect(result.isTopDownSwipe).toBe(false);
    expect(result.isDownTopSwipe).toBe(false);
    expect(result.isLeftToRightSwipe).toBe(false);
    expect(result.isRightToLeftSwipe).toBe(false);
  });
});
