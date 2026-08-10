"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const ASSETS = {
  idle: "/bot/bot-idle-animated.webp",
  nod: "/bot/bot-nod-animated.webp",
  work: "/bot/bot-work-animated.webp",
} as const;

const POSTER = "/bot/bot-poster.webp";
const ACTION_HOLD_MS = 2700;
const CLICK_DELAY_MS = 340;
const LONG_PRESS_MS = 560;

type Action = keyof typeof ASSETS;

type Props = {
  className?: string;
  width?: number;
  followMouse?: boolean;
  scrollAction?: boolean;
};

const actionLabels: Record<Action, string> = {
  idle: "待机观察",
  nod: "收到数据",
  work: "正在处理",
};

const interactionMessages: Record<"nod" | "work", string[]> = {
  nod: [
    "收到，我会继续整理这条数据。",
    "规则越清楚，数据就越可靠。",
    "今天也在认真学习 AI。",
  ],
  work: [
    "正在处理：检查、分类、再复核。",
    "工作模式启动，开始整理数据。",
  ],
};

export default function DataBuddy({
  className = "",
  width = 164,
  followMouse = true,
  scrollAction = true,
}: Props) {
  const orbitRef = useRef<HTMLButtonElement>(null);
  const actionRef = useRef<Action>("idle");
  const returnTimerRef = useRef(0);
  const clickTimerRef = useRef(0);
  const longPressTimerRef = useRef(0);
  const bubbleTimerRef = useRef(0);
  const longPressTriggeredRef = useRef(false);
  const messageIndexRef = useRef(0);
  const [action, setAction] = useState<Action>("idle");
  const [cycle, setCycle] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [assetFailed, setAssetFailed] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState("单击、双击或长按我，看看会发生什么。");

  const changeAction = useCallback((nextAction: Action, holdMs: number) => {
    if (actionRef.current !== nextAction) {
      actionRef.current = nextAction;
      setAction(nextAction);
      setCycle((current) => current + 1);
      setAssetFailed(false);
    }

    window.clearTimeout(returnTimerRef.current);
    if (nextAction !== "idle") {
      returnTimerRef.current = window.setTimeout(() => {
        actionRef.current = "idle";
        setAction("idle");
        setCycle((current) => current + 1);
        setAssetFailed(false);
      }, holdMs);
    }
  }, []);

  const showBubble = useCallback((message: string, duration = 3200) => {
    setBubbleMessage(message);
    setBubbleOpen(true);
    window.clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = window.setTimeout(() => setBubbleOpen(false), duration);
  }, []);

  const runInteractiveAction = useCallback((nextAction: "nod" | "work") => {
    if (!reducedMotion) changeAction(nextAction, ACTION_HOLD_MS);
    const messages = interactionMessages[nextAction];
    const message = messages[messageIndexRef.current % messages.length];
    messageIndexRef.current += 1;
    showBubble(message);
  }, [changeAction, reducedMotion, showBubble]);

  const handleBuddyClick = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    window.clearTimeout(clickTimerRef.current);
    clickTimerRef.current = window.setTimeout(() => runInteractiveAction("nod"), CLICK_DELAY_MS);
  };

  const handleBuddyDoubleClick = () => {
    window.clearTimeout(clickTimerRef.current);
    runInteractiveAction("work");
  };

  const handlePointerDown = () => {
    longPressTriggeredRef.current = false;
    window.clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      window.clearTimeout(clickTimerRef.current);
      runInteractiveAction("work");
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => window.clearTimeout(longPressTimerRef.current);

  const toggleHelpBubble = () => {
    window.clearTimeout(bubbleTimerRef.current);
    if (bubbleOpen) {
      setBubbleOpen(false);
      return;
    }
    showBubble("单击点头 · 双击或长按进入工作模式", 4400);
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(media.matches);
    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    let raf = 0;
    const updateVisibility = () => {
      const contact = document.getElementById("contact");
      const hasPassedHero = window.scrollY > window.innerHeight * 0.55;
      const isBeforeContact = !contact || contact.getBoundingClientRect().top > window.innerHeight * 0.74;
      const nextVisible = hasPassedHero && isBeforeContact;
      setVisible(nextVisible);
      if (!nextVisible) {
        setBubbleOpen(false);
        window.clearTimeout(bubbleTimerRef.current);
      }
      raf = 0;
    };
    const requestUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setTimeout(() => {
      [ASSETS.nod, ASSETS.work].forEach((src) => {
        const image = new window.Image();
        image.src = src;
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [visible, reducedMotion]);

  useEffect(() => {
    if (visible && !reducedMotion) return;
    window.clearTimeout(returnTimerRef.current);
    if (actionRef.current !== "idle") {
      actionRef.current = "idle";
      setAction("idle");
      setCycle((current) => current + 1);
      setAssetFailed(false);
    }
  }, [reducedMotion, visible]);

  useEffect(() => {
    if (!scrollAction || !visible || reducedMotion) return;

    let lastY = window.scrollY;
    let lastSample = performance.now();
    let distance = 0;
    let raf = 0;

    const evaluateScroll = (now: number) => {
      const elapsed = Math.max(16, now - lastSample);
      const velocity = distance / elapsed;

      if (distance > 90 || velocity > 1.05) {
        changeAction("work", ACTION_HOLD_MS);
      } else if (distance > 7) {
        changeAction("nod", ACTION_HOLD_MS);
      }

      distance = 0;
      lastSample = now;
      raf = 0;
    };

    const onScroll = () => {
      const nextY = window.scrollY;
      distance += Math.abs(nextY - lastY);
      lastY = nextY;
      if (!raf) raf = window.requestAnimationFrame(evaluateScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(returnTimerRef.current);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [changeAction, reducedMotion, scrollAction, visible]);

  useEffect(() => {
    if (!followMouse || !visible || reducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const orbit = orbitRef.current;
    if (!orbit) return;

    let pointerX = 0;
    let pointerY = 0;
    let raf = 0;

    const updateTilt = () => {
      const bounds = orbit.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const horizontal = Math.max(-1, Math.min(1, (pointerX - centerX) / window.innerWidth));
      const vertical = Math.max(-1, Math.min(1, (pointerY - centerY) / window.innerHeight));
      orbit.style.setProperty("--buddy-tilt-x", `${vertical * -6}deg`);
      orbit.style.setProperty("--buddy-tilt-y", `${horizontal * 10}deg`);
      raf = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!raf) raf = window.requestAnimationFrame(updateTilt);
    };
    const resetTilt = () => {
      orbit.style.setProperty("--buddy-tilt-x", "0deg");
      orbit.style.setProperty("--buddy-tilt-y", "0deg");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", resetTilt);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", resetTilt);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [followMouse, reducedMotion, visible]);

  useEffect(() => () => {
    window.clearTimeout(returnTimerRef.current);
    window.clearTimeout(clickTimerRef.current);
    window.clearTimeout(longPressTimerRef.current);
    window.clearTimeout(bubbleTimerRef.current);
  }, []);

  const source = reducedMotion || assetFailed ? POSTER : ASSETS[action];
  const style = { "--buddy-width": `${width}px` } as CSSProperties;

  return (
    <aside
      className={`data-buddy-dock${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      data-action={action}
      style={style}
      aria-hidden={!visible}
      aria-label="小数据精灵互动区"
    >
      <div
        className={`data-buddy-bubble${bubbleOpen ? " is-open" : ""}`}
        role="status"
        aria-live="polite"
        aria-hidden={!bubbleOpen}
      >
        <small>DATA BUDDY / 小数据精灵</small>
        <strong>{bubbleMessage}</strong>
        <span>单击点头 · 双击或长按工作</span>
      </div>
      <button
        className="data-buddy-orbit"
        ref={orbitRef}
        type="button"
        aria-label="小数据精灵：单击点头，双击或长按进入工作模式"
        onClick={handleBuddyClick}
        onDoubleClick={handleBuddyDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={cancelLongPress}
        onPointerCancel={cancelLongPress}
        onPointerLeave={cancelLongPress}
        onContextMenu={(event) => event.preventDefault()}
      >
        {visible ? (
          <Image
            className="data-buddy-sprite"
            src={source}
            alt=""
            width={256}
            height={411}
            unoptimized
            decoding="async"
            draggable={false}
            key={`${action}-${cycle}-${reducedMotion ? "still" : "motion"}`}
            onError={() => setAssetFailed(true)}
          />
        ) : null}
        <span className="data-buddy-ground" aria-hidden="true" />
      </button>
      <button
        className="data-buddy-status"
        type="button"
        aria-expanded={bubbleOpen}
        aria-label="查看小数据精灵的互动说明"
        onClick={toggleHelpBubble}
      >
        <i aria-hidden="true" /> DATA BUDDY · {reducedMotion ? "静态展示" : actionLabels[action]}
      </button>
    </aside>
  );
}
