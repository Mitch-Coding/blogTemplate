export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const easeOutCubic = (value: number) => 1 - (1 - value) ** 3

export const easeInCubic = (value: number) => value ** 3

export const easeInOutQuad = (value: number) =>
  value < 0.5 ? 2 * value * value : 1 - ((-2 * value + 2) ** 2) / 2
