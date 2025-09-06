import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./preloader.css";
import Logo from "../logo/logo";

/**
 * Preloader overlay recreated as a React component (Tailwind + GSAP)
 *
 * Props:
 * - show?: boolean (default true) — control visibility from parent
 * - onComplete?: () => void — called after exit animation ends
 * - lockScroll?: boolean (default true) — locks body scroll while visible
 *
 * Usage:
 *   <Preloader show={isLoading} onComplete={() => setIsLoading(false)} />
 */
export default function Preloader({
  show = true,
  onComplete,
  lockScroll = true,
}) {
  const [mounted, setMounted] = useState(show);
  const wrapperRef = useRef(null);
  const headingRef = useRef(null);
  const pathRef = useRef(null);
  const tlRef = useRef(null);

  // Sync internal mount/unmount with external `show`
  useEffect(() => {
    if (show) setMounted(true);
  }, [show]);

  // Lock/unlock scroll while mounted
  useEffect(() => {
    if (!lockScroll) return;
    if (mounted) {
      const prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prevOverflow;
      };
    }
  }, [mounted, lockScroll]);

  useLayoutEffect(() => {
    if (!mounted) return;

    const wrapper = wrapperRef.current;
    const heading = headingRef.current;
    const svgPath = pathRef.current;

    // Reset to initial visual state each time we mount
    gsap.set([heading], { y: 0, opacity: 1 });
    gsap.set(svgPath, {
      attr: { d: "M0,1005S175,995,500,995s500,5,500,5V0H0Z" },
    });
    gsap.set(wrapper, { y: 0, clearProps: "zIndex,display" });

    const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
    const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

    const tl = gsap.timeline({
      onComplete: () => {
        // Unmount after animation finishes
        setMounted(false);
        onComplete && onComplete();
      },
    });

    tl.to(heading, {
      delay: 1.5,
      y: -100,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
    })
      .to(svgPath, {
        duration: 0.3,
        attr: { d: curve },
        ease: "power2.in",
      })
      .to(svgPath, {
        duration: 0.3,
        attr: { d: flat },
        ease: "power2.out",
      })
      .to(wrapper, { y: -1500, duration: 0.8, ease: "power2.in" })
      .set(wrapper, { zIndex: -1, display: "none" });

    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [mounted, onComplete]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapperRef}
      className="loader-wrap fixed inset-0 text-black flex items-center justify-center z-[999999] overflow-hidden bg-transparent"
      aria-hidden
    >
      <svg
        className="relative w-screen h-screen"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M0,1005S175,995,500,995s500,5,500,5V0H0Z"
          fill="#f5f4f4"
        />
      </svg>

      <div
        ref={headingRef}
        className="loader-wrap-heading relative z-20 text-xl font-thin tracking-wider "
      >
        <div className="relative flex items-center justify-center">
          <img
            src="/assets/peoplegroupicon.svg"
            alt=""
            class="loaderanimatedimage"
          />
          <img src="/assets/logoimage.svg" alt="" class="center-logo" />
        </div>
      </div>
    </div>
  );
}
