"use client";

import { type MouseEvent, useEffect, useState } from "react";
import { glossaryCards } from "../glossary-data";

const padNumber = (value: number) => String(value).padStart(2, "0");

export default function GlossaryFlipCard() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [speakingTerm, setSpeakingTerm] = useState<string | null>(null);
  const card = glossaryCards[index];

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const goTo = (nextIndex: number) => {
    window.speechSynthesis?.cancel();
    setSpeakingTerm(null);
    setFlipped(false);
    setIndex(nextIndex);
  };

  const toggleCard = () => setFlipped((current) => !current);

  const speakEnglish = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(card.termEn);
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    utterance.onend = () => setSpeakingTerm(null);
    utterance.onerror = () => setSpeakingTerm(null);
    setSpeakingTerm(card.termEn);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glossary-player">
      <div className="panel-bar">
        <span>AI GLOSSARY / 术语卡</span>
        <span>63 词知识库 · 精选 12 词</span>
      </div>

      <div className="flip-card-stage">
        <div className="flip-card" key={index}>
          <div className={`flip-inner${flipped ? " flipped" : ""}`}>
            <div className="flip-face flip-front" aria-hidden={flipped}>
              <div className="flip-card-meta">
                <span>TERM / 术语</span>
                <span>{padNumber(index + 1)}</span>
              </div>
              <div className="term-title">
                <strong>{card.termZh}</strong>
                <button
                  className={`term-audio-button${speakingTerm === card.termEn ? " is-speaking" : ""}`}
                  type="button"
                  tabIndex={flipped ? -1 : 0}
                  aria-label={`朗读 ${card.termEn} 的英文发音`}
                  aria-pressed={speakingTerm === card.termEn}
                  onClick={speakEnglish}
                >
                  <span>{card.termEn}</span>
                  <i aria-hidden="true">🔊</i>
                </button>
              </div>
              <button
                className="flip-toggle"
                type="button"
                tabIndex={flipped ? -1 : 0}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleCard();
                }}
              >
                <i aria-hidden="true">↻</i>
                翻面查看解释
              </button>
            </div>

            <div className="flip-face flip-back" aria-hidden={!flipped}>
              <div className="flip-back-head">
                <span>{card.termZh}</span>
                <button
                  className={`term-audio-button term-audio-button-compact${speakingTerm === card.termEn ? " is-speaking" : ""}`}
                  type="button"
                  tabIndex={flipped ? 0 : -1}
                  aria-label={`朗读 ${card.termEn} 的英文发音`}
                  aria-pressed={speakingTerm === card.termEn}
                  onClick={speakEnglish}
                >
                  <span>{card.termEn}</span>
                  <i aria-hidden="true">🔊</i>
                </button>
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
              <button
                className="flip-return"
                type="button"
                tabIndex={flipped ? 0 : -1}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleCard();
                }}
              >
                ↻ 返回术语正面
              </button>
            </div>
          </div>
        </div>

        <div className="flip-nav" aria-label="术语卡片导航">
          <button type="button" disabled={index === 0} onClick={() => goTo(index - 1)}>
            ← 上一个
          </button>
          <span aria-live="polite">
            {padNumber(index + 1)} / {padNumber(glossaryCards.length)}
          </span>
          <button type="button" disabled={index === glossaryCards.length - 1} onClick={() => goTo(index + 1)}>
            下一个 →
          </button>
        </div>
      </div>
    </div>
  );
}
