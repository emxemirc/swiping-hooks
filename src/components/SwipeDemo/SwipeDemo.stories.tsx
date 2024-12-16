import type { Meta, StoryObj } from "@storybook/react";
import SwipeDemo from "./SwipeDemo";

const meta = {
  title: "Components/SwipeDemo",
  component: SwipeDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SwipeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    threshold: 50,
  },
};

export const HighThreshold: Story = {
  args: {
    threshold: 150,
  },
};

export const LowThreshold: Story = {
  args: {
    threshold: 20,
  },
};
