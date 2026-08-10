"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

const DESKTOP_VIDEO = "/motion/motion-scrub-desktop-light.mp4";
const MOBILE_VIDEO = "/motion/motion-scrub-mobile-light.mp4";
const DESKTOP_DARK_VIDEO = "/motion/motion-scrub-desktop-dark.mp4";
const MOBILE_DARK_VIDEO = "/motion/motion-scrub-mobile-dark.mp4";
const FPS = 24;

type Props = {
  theme: "light" | "dark";
  className?: string;
  width?: number;
  smoothTime?: number;
  frameCount?: number;
};

export default function GrowingSapling({
  theme,
  className = "",
  width = 320,
  smoothTime = 0.1,
  frameCount = 98,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [viewport, setViewport] = useState<"desktop" | "mobile" | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 720px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateViewport = () => setViewport(mobileQuery.matches ? "mobile" : "desktop");
    const updateMotion = () => setReducedMotion(motionQuery.matches);

    updateViewport();
    updateMotion();
    mobileQuery.addEventListener("change", updateViewport);
    motionQuery.addEventListener("change", updateMotion);
    return () => {
      mobileQuery.removeEventListener("change", updateViewport);
      motionQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const videoSrc = useMemo(() => {
    if (!shouldLoad || !viewport) return null;
    if (theme === "dark") {
      return viewport === "mobile" ? MOBILE_DARK_VIDEO : DESKTOP_DARK_VIDEO;
    }
    return viewport === "mobile" ? MOBILE_VIDEO : DESKTOP_VIDEO;
  }, [shouldLoad, theme, viewport]);
  const ready = Boolean(videoSrc && loadedSrc === videoSrc);
  const failed = Boolean(videoSrc && failedSrc === videoSrc);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video || !videoSrc || !ready) return;

    const finalTime = Math.max(0, (frameCount - 1) / FPS);
    if (reducedMotion) {
      video.currentTime = Math.min(finalTime, Math.max(0, video.duration - 0.04));
      return;
    }

    let currentFrame = 0;
    let targetFrame = 0;
    let velocity = 0;
    let animationFrame = 0;
    let inView = false;
    let lastTime = performance.now();

    const setTargetFrame = (frame: number) => {
      targetFrame = Math.max(0, Math.min(frameCount - 1, frame));
    };

    const updateTarget = () => {
      if (!inView) return;
      const viewportHeight = window.innerHeight;
      const scrollArea = wrap.closest<HTMLElement>(".growth-section") ?? wrap;
      const rect = scrollArea.getBoundingClientRect();
      const headerOffset = window.innerWidth <= 720 ? 72 : 84;
      const startTop = headerOffset;
      const endTop = viewportHeight - rect.height;
      const travel = Math.max(1, startTop - endTop);
      const progress = Math.max(0, Math.min(1, (startTop - rect.top) / travel));
      setTargetFrame(progress * (frameCount - 1));
    };

    const tick = (delta: number) => {
      const safeTime = Math.max(0.0001, smoothTime);
      const omega = 2 / safeTime;
      const x = omega * delta;
      const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
      const maxSpeed = frameCount * 3;
      const change = Math.max(
        -maxSpeed * safeTime,
        Math.min(maxSpeed * safeTime, targetFrame - currentFrame),
      );
      const temp = (velocity + omega * change) * delta;
      velocity = (velocity - omega * temp) * decay;
      currentFrame += (change + temp) * decay;

      const targetTime = Math.round(currentFrame) / FPS;
      if (video.readyState >= 2 && Math.abs(video.currentTime - targetTime) > 0.001) {
        video.currentTime = targetTime;
      }
    };

    const loop = (now: number) => {
      if (!inView) {
        animationFrame = 0;
        return;
      }
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      tick(delta);
      animationFrame = window.requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (animationFrame) return;
      lastTime = performance.now();
      animationFrame = window.requestAnimationFrame(loop);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          updateTarget();
          startLoop();
        } else if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      },
      { rootMargin: "20% 0px" },
    );

    visibilityObserver.observe(wrap);
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    return () => {
      visibilityObserver.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, [frameCount, ready, reducedMotion, smoothTime, videoSrc]);

  const style = { "--sapling-width": `${width}px` } as CSSProperties;

  return (
    <figure
      ref={wrapRef}
      className={`growing-sapling ${className}`.trim()}
      style={style}
      aria-label={
        reducedMotion
          ? "数据树苗成长动画的静态完成画面"
          : "随页面滚动从种子成长为大树的数据动画"
      }
    >
      {videoSrc ? (
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          className={ready ? "is-ready" : ""}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedData={() => setLoadedSrc(videoSrc)}
          onError={() => setFailedSrc(videoSrc)}
        />
      ) : null}

      {!ready && !failed ? (
        <div className="sapling-fallback" role="status">
          <i aria-hidden="true" />
          <span>数据树加载中…</span>
        </div>
      ) : null}

      {failed ? (
        <div className="sapling-fallback sapling-error" role="status">
          <i aria-hidden="true" />
          <span>数据树暂时未能加载</span>
        </div>
      ) : null}
    </figure>
  );
}
