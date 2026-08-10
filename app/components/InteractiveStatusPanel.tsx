"use client";

import { useRef, useState } from "react";

const stages = [
  { code: "01", title: "DISCOVER", subtitle: "寻找方向" },
  { code: "02", title: "BUILD", subtitle: "搭建框架" },
  { code: "03", title: "SHARE", subtitle: "持续表达" },
] as const;

const stars = [
  [8, 16, 2, 0], [17, 31, 1, .8], [28, 12, 2, 1.4], [39, 24, 1, .3],
  [52, 10, 1, 1.8], [66, 18, 2, .5], [79, 8, 1, 2.1], [91, 26, 2, 1.1],
  [11, 52, 1, 1.7], [23, 64, 2, .4], [35, 45, 1, 2.4], [48, 58, 2, 1.2],
  [62, 43, 1, .1], [73, 56, 2, 2], [87, 48, 1, .7], [94, 69, 1, 1.5],
  [6, 82, 2, 2.2], [20, 91, 1, .2], [33, 78, 1, 1.3], [45, 88, 2, .9],
  [59, 73, 1, 2.5], [70, 86, 1, .6], [82, 77, 2, 1.6], [92, 92, 1, .35],
] as const;

export default function InteractiveStatusPanel({ theme }: { theme: "light" | "dark" }) {
  const [activeStage, setActiveStage] = useState(1);
  const panelRef = useRef<HTMLElement>(null);
  const stage = stages[activeStage];

  const moveScene = (event: React.PointerEvent<HTMLElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const panel = event.currentTarget;
    const bounds = panel.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const offsetX = (x - .5) * 16;
    const offsetY = (y - .5) * 16;
    panel.style.setProperty("--panel-x", `${offsetX}px`);
    panel.style.setProperty("--panel-y", `${offsetY}px`);
    panel.style.setProperty("--panel-x-rev", `${offsetX * -.55}px`);
    panel.style.setProperty("--panel-y-rev", `${offsetY * -.55}px`);
    panel.style.setProperty("--spot-x", `${x * 100}%`);
    panel.style.setProperty("--spot-y", `${y * 100}%`);
  };

  const resetScene = () => {
    panelRef.current?.style.setProperty("--panel-x", "0px");
    panelRef.current?.style.setProperty("--panel-y", "0px");
    panelRef.current?.style.setProperty("--panel-x-rev", "0px");
    panelRef.current?.style.setProperty("--panel-y-rev", "0px");
    panelRef.current?.style.setProperty("--spot-x", "50%");
    panelRef.current?.style.setProperty("--spot-y", "50%");
  };

  const nextStage = () => setActiveStage((current) => (current + 1) % stages.length);

  return (
    <aside
      className="console interactive-console"
      aria-label={`个人网站状态面板，当前为${theme === "dark" ? "星空" : "纸面"}主题，状态${stage.subtitle}`}
      ref={panelRef}
      onPointerMove={moveScene}
      onPointerLeave={resetScene}
    >
      <div className="console-head">
        <span>QI&apos;AN / {theme === "dark" ? "NIGHT SKY" : "DAY LAB"}</span>
        <span>{stage.code} / 03</span>
      </div>

      <div className="panel-world">
        <div className="day-scene" aria-hidden="true">
          <div className="day-grid" />
          <div className="day-sun" />
          <div className="paper-ring ring-large" />
          <div className="paper-ring ring-small" />
          <div className="paper-note note-one">IDEA</div>
          <div className="paper-note note-two">MAKE</div>
          <div className="paper-note note-three">LEARN</div>
        </div>

        <div className="night-scene" aria-hidden="true">
          <div className="nebula nebula-one" />
          <div className="nebula nebula-two" />
          <div className="star-field">
            {stars.map(([left, top, size, delay], index) => (
              <i
                className="star"
                key={`${left}-${top}-${index}`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size + 1}px`,
                  height: `${size + 1}px`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
          </div>
          <div className="constellation">
            <i className="constellation-dot dot-a" />
            <i className="constellation-dot dot-b" />
            <i className="constellation-dot dot-c" />
            <i className="constellation-dot dot-d" />
            <i className="constellation-line line-a" />
            <i className="constellation-line line-b" />
            <i className="constellation-line line-c" />
          </div>
        </div>

        <button className="panel-core" type="button" onClick={nextStage} aria-label="切换下一个状态">
          <small>{stage.code}</small>
          <strong>{stage.title}</strong>
          <span>{stage.subtitle}</span>
          <i aria-hidden="true">点击切换</i>
        </button>

        <div className="panel-stage-nav" aria-label="选择状态">
          {stages.map((item, index) => (
            <button
              className={index === activeStage ? "active" : ""}
              type="button"
              key={item.code}
              onClick={() => setActiveStage(index)}
              aria-pressed={index === activeStage}
            >
              <span>{item.code}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="console-foot">
        <span>STATUS: {stage.title}</span>
        <span>{theme === "dark" ? "MOVE THROUGH THE STARS" : "MOVE ACROSS THE PAPER"}</span>
      </div>
    </aside>
  );
}
