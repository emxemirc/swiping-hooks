import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import SwipeDemo from "./SwipeDemo";

describe("SwipeDemo", () => {
  it("should show swipe direction after right swipe", async () => {
    const user = userEvent.setup();
    render(<SwipeDemo threshold={50} />);

    const swipeArea = screen.getByTestId("swipe-container");

    await user.pointer([
      { target: swipeArea, coords: { x: 10, y: 10 } },
      { target: swipeArea, coords: { x: 15, y: 12 } },
      { target: swipeArea, coords: { x: 18, y: 15 } },
      { keys: "[MouseLeft>]", target: swipeArea, coords: { x: 20, y: 20 } },
      { coords: { x: 100, y: 30 } },
      { keys: "[/MouseLeft]" },
    ]);

    const directionElement = await screen.findByTestId("swipe-direction");
    expect(directionElement).toHaveAttribute("data-swipe-state", "right");
  });

  /*
  it("should not trigger swipe when movement is below threshold", async () => {
    const user = userEvent.setup();
    render(<SwipeDemo threshold={50} />);

    const swipeArea = screen.getByTestId("swipe-container");

    await user.pointer([
      { keys: "[MouseLeft>]", target: swipeArea, coords: { x: 0, y: 0 } },
      { coords: { x: 20, y: 0 } },
      { keys: "[/MouseLeft]" },
    ]);

    expect(screen.queryByTestId("swipe-direction")).not.toBeInTheDocument();
  });

  it("should handle swipes in all directions correctly", async () => {
    const user = userEvent.setup();
    render(<SwipeDemo threshold={50} />);
    const swipeArea = screen.getByTestId("swipe-container");

    await user.pointer([
      { keys: "[MouseLeft>]", target: swipeArea, coords: { x: 100, y: 100 } },
      { coords: { x: 200, y: 100 } },
      { keys: "[/MouseLeft]" },
    ]);
    expect(screen.getByTestId("swipe-direction")).toHaveAttribute("data-swipe-state", "right");

    await user.pointer([
      { keys: "[MouseLeft>]", target: swipeArea, coords: { x: 200, y: 100 } },
      { coords: { x: 100, y: 100 } },
      { keys: "[/MouseLeft]" },
    ]);
    expect(screen.getByTestId("swipe-direction")).toHaveAttribute("data-swipe-state", "left");

    await user.pointer([
      { keys: "[MouseLeft>]", target: swipeArea, coords: { x: 100, y: 100 } },
      { coords: { x: 100, y: 200 } },
      { keys: "[/MouseLeft]" },
    ]);
    expect(screen.getByTestId("swipe-direction")).toHaveAttribute("data-swipe-state", "down");

    await user.pointer([
      { keys: "[MouseLeft>]", target: swipeArea, coords: { x: 100, y: 200 } },
      { coords: { x: 100, y: 100 } },
      { keys: "[/MouseLeft]" },
    ]);
    expect(screen.getByTestId("swipe-direction")).toHaveAttribute("data-swipe-state", "up");
  });
  */
});
