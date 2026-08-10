"use client";

import { type KeyboardEvent, useState } from "react";
import { glossaryCards } from "../glossary-data";

const padNumber = (value: number) => String(value).padStart(2, "0");

export default function GlossaryFlipCard() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = glossaryCards[index];

  const goTo = (nextIndex: number) => {
    setFlipped(false);
    setIndex(nextIndex);
  };

  const toggleCard = () => setFlipped((current) => !current);

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCard();
    }
  };

  return (
    <div className="glossary-player">
      <div className="panel-bar">
        <span>AI GLOSSARY / 术语卡</span>
        <span>63 词知识库 · 精选 12 词</span>
      </div>

      <div className="flip-card-stage">
        <div
          className="flip-card"
          key={index}
          role="button"
          tabIndex={0}
          aria-label={`${card.term}，${flipped ? "点击返回术语正面" : "点击翻面查看解释"}`}
          aria-pressed={flipped}
          onClick={toggleCard}
          onKeyDown={handleCardKeyDown}
        >
          <div className={`flip-inner${flipped ? " flipped" : ""}`}>
            <div className="flip-face flip-front" aria-hidden={flipped}>
              <div className="flip-card-meta">
                <span>TERM / 术语</span>
                <span>{padNumber(index + 1)}</span>
              </div>
              <strong>{card.term}</strong>
              <span className="flip-card-hint">
                <i aria-hidden="true">↻</i>
                点击或按 Enter 翻面查看解释
              </span>
            </div>

            <div className="flip-face flip-back" aria-hidden={!flipped}>
              <div className="flip-back-head">
                <span>{card.term}</span>
                <span>EXPLANATION / 解释</span>
              </div>
              <div className="flip-explanation">
                <strong><b>01</b> 专业术语解释</strong>
                <p>{card.pro}</p>
              </div>
              <div className="flip-explanation">
                <strong><b>02</b> 面试可简洁回答</strong>
                <p>{card.interview}</p>
              </div>
              <div className="flip-explanation">
                <strong><b>03</b> 生活化例子</strong>
                <p>{card.example}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flip-nav" aria-label="术语卡片导航">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            ← 上一个
          </button>
          <span aria-live="polite">
            {padNumber(index + 1)} / {padNumber(glossaryCards.length)}
          </span>
          <button
            type="button"
            disabled={index === glossaryCards.length - 1}
            onClick={() => goTo(index + 1)}
          >
            下一个 →
          </button>
        </div>
      </div>
    </div>
  );
}
