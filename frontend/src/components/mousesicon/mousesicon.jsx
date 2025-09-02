// CustomCursor.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Küçük bir daire fareyi takip eder.
 * Tıklanabilir bir öğe üzerindeyken (a, button, [role=button], input, select, textarea, [data-cursor="pointer"])
 * daire büyür ve içi şeffaf olur.
 */
export default function CustomCursor({
  normalSize = 12,
  hoverSize = 50,
  borderColor = "#dea50d",
  fillColor = "#dea60d9a",
} = {}) {
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);        // touch cihazlarda devre dışı
  const [isPointer, setIsPointer] = useState(false);    // tıklanabilir üstünde mi?

  useEffect(() => {
    // Touch (coarse) ise göstermeyelim
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dotRef.current) return;

    const el = dotRef.current;
    let ticking = false;
    let lastPointerState = false;

    const SELECTOR =
      "a, button, [role='button'], input, select, textarea, [data-cursor='pointer']";

    const update = (e) => {
      // Pozisyonu güncelle
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      // Altındaki eleman tıklanabilir mi?
      const target = e.target;
      let pointerLike = false;
      if (target && target.nodeType === 1) {
        const clickable = target.closest(SELECTOR);
        pointerLike =
          !!clickable || getComputedStyle(target).cursor === "pointer";
      }
      if (pointerLike !== lastPointerState) {
        lastPointerState = pointerLike;
        setIsPointer(pointerLike); // sadece değişince state güncelle
      }
      ticking = false;
    };

    const onMove = (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => update(e));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  const size = isPointer ? hoverSize : normalSize;
  const bg = isPointer ? "transparent" : fillColor;

  return (
    <div
      ref={dotRef}
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: size,
        height: size,
        marginLeft: -(size / 2),
        marginTop: -(size / 2),
        borderRadius: "50%",
        background: bg,
        border: `1px solid ${borderColor}`,
        pointerEvents: "none",              // tıklamayı engellemesin
        zIndex: 2147483647,                 // her şeyin üstünde
        transition:
          "width 120ms ease, height 120ms ease, margin 120ms ease, background-color 120ms ease, border-color 120ms ease",
        willChange: "transform, width, height",
      }}
    />
  );
}
