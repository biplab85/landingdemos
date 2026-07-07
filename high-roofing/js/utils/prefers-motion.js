// Reduced-motion guard
const mq =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

export const prefersReducedMotion = () => mq.matches;
export const canHover = () =>
  window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
