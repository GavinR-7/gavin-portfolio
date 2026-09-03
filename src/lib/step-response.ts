/**
 * The math behind the signature element, shared by the hero canvas and the
 * generated OG cards so the curve on a social preview is literally the same
 * curve as the one on the page — not a redrawing of it.
 */

/** ζ — damping ratio. 0.28 overshoots ~40% and rings twice before settling. */
export const ZETA = 0.28;
/** ωₙ — natural frequency. Tuned so two rings fit across the width. */
export const OMEGA_N = 14;
/** Where along the width the step input arrives. */
export const STEP_AT = 0.14;

/** Unit step response of an underdamped second-order system. y(0) = 0. */
export function stepResponse(t: number): number {
  if (t <= 0) return 0;
  const damped = Math.sqrt(1 - ZETA * ZETA);
  const decay = Math.exp(-ZETA * OMEGA_N * t) / damped;
  return 1 - decay * Math.sin(OMEGA_N * damped * t + Math.acos(ZETA));
}

/**
 * The curve as an SVG path, for contexts that can't run canvas — the OG cards.
 * Satori (which renders those) has patchy inline-SVG support, so callers wrap
 * this in a data URI and hand it over as an <img>.
 */
export function stepResponsePath(width: number, height: number): string {
  const baseline = height * 0.8;
  const amplitude = baseline - height * 0.34;
  const points: string[] = [];

  for (let x = 0; x <= width; x += 2) {
    const t = (x / width - STEP_AT) * 1.15;
    const y = baseline - stepResponse(t) * amplitude;
    points.push(`${x === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  return points.join(" ");
}

/** A complete, self-contained SVG of the trace — ready for a data URI. */
export function stepResponseSvg(width: number, height: number, color: string): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<path d="${stepResponsePath(width, height)}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    `</svg>`,
  ].join("");
}
