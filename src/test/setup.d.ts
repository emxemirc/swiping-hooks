import "@testing-library/jest-dom";

interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
