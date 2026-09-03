"use client";

import { useEffect, useRef } from "react";

import { STEP_AT, stepResponse } from "@/lib/step-response";

/**
 * The signature element: a second-order system's step response.
 *
 * In ECE this is *the* way you characterise a system — hit it with a sharp
 * input and watch how it settles. It's also the exact shape of the positioning:
 * messy input arrives, the system rings, then holds steady. It plays once and
 * stops. Nothing here loops, so it costs no battery after the first 1.5s.
 *
 * Fallbacks are structural, not bolted on:
 *   - no JS      → the canvas never paints; the CSS axis line still renders
 *   - reduced motion → the settled curve is drawn instantly, no animation
 *   - no canvas  → nothing happens and the hero is unaffected
 */

/** One sweep, then it stops. */
const SWEEP_MS = 1500;

export function StepResponse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let start = 0;

    /** @param progress 0→1, how far the sweep has travelled across the width. */
    function draw(progress: number) {
      if (!canvas || !context) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      // Both colours are read from the cascade, so the trace follows the theme
      // without this component knowing anything about theming.
      const styles = getComputedStyle(canvas);
      const traceColor = styles.color;
      const gridColor = styles.borderTopColor;

      const baseline = height * 0.8; // pre-step steady state
      const settled = height * 0.34; // post-step steady state
      const amplitude = baseline - settled;

      // Steady-state reference — the value the system is converging on.
      context.strokeStyle = gridColor;
      context.lineWidth = 1;
      context.setLineDash([2, 4]);
      context.beginPath();
      context.moveTo(width * STEP_AT, settled);
      context.lineTo(width, settled);
      context.stroke();
      context.setLineDash([]);

      // Time ticks along the baseline — this is a measurement, not a squiggle.
      for (let x = width * STEP_AT; x < width; x += width * 0.1) {
        context.beginPath();
        context.moveTo(x, baseline - 3);
        context.lineTo(x, baseline + 3);
        context.stroke();
      }

      // The trace.
      const sweepTo = width * progress;
      context.strokeStyle = traceColor;
      context.lineWidth = 1.75;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.beginPath();
      for (let x = 0; x <= sweepTo; x += 1) {
        const t = (x / width - STEP_AT) * 1.15;
        const y = baseline - stepResponse(t) * amplitude;
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }

    function sweep(now: number) {
      if (!start) start = now;
      const progress = Math.min((now - start) / SWEEP_MS, 1);
      draw(progress);
      if (progress < 1) frame = requestAnimationFrame(sweep);
    }

    if (reduced) draw(1);
    else frame = requestAnimationFrame(sweep);

    // Redraw on resize, and when the theme flips (the colours above are read
    // from computed styles, so a repaint is all that's needed).
    const redraw = () => draw(1);
    const observer = new ResizeObserver(redraw);
    observer.observe(canvas);
    const themeObserver = new MutationObserver(redraw);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <div className="trace-axis border-line relative mt-12 h-28 w-full sm:h-36">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="text-signal border-line absolute inset-0 h-full w-full"
      />
    </div>
  );
}
