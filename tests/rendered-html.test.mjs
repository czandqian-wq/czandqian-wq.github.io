import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Qian's personal portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>个人网站<\/title>/i);
  assert.match(html, /成都大学 · 土木工程硕士/);
  assert.match(html, /LOCATION \/ 所在城市/);
  assert.doesNotMatch(html, /中共预备党员|政治面貌/);
  assert.match(html, /AI 数据训练师/);
  assert.match(html, /腐蚀钢筋混凝土黏结强度预测/);
  assert.match(html, /https:\/\/www\.mdpi\.com\/1996-1944\/19\/10\/1928/);
  assert.match(html, /PLAYGROUND \/ AI 术语翻卡/);
  assert.match(html, /词元/);
  assert.match(html, /Token/);
  assert.match(html, /专业术语解释/);
  assert.match(html, /GROWTH \/ 数据与成长/);
  assert.match(html, /数据树加载中/);
  assert.match(html, /DATA BUDDY/);
  assert.match(html, /czandqian@gmail\.com/);
  assert.match(html, /https:\/\/www\.xiaohongshu\.com\/user\/profile\/63e8f56200000000260102b3/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps editable content separate and preserves key interactions", async () => {
  const [content, page, layout, sapling, buddy, glossary, flipCard] = await Promise.all([
    readFile(new URL("../app/content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/GrowingSapling.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/DataBuddy.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/glossary-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/GlossaryFlipCard.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(content, /export const siteContent/);
  assert.match(content, /export const experienceItems/);
  assert.match(content, /export const careerTracks/);
  assert.match(content, /title: "数据构建"/);
  assert.match(content, /title: "模型评测"/);
  assert.match(content, /title: "自动化（Prompt 工程）"/);
  assert.doesNotMatch(content, /title: "数据质量控制"/);
  assert.doesNotMatch(content, /annotationDemo/);
  assert.doesNotMatch(content, /七安的个人网站/);
  assert.match(content, /id: 3,[\s\S]*title: "AI 数据训练项目案例"/);
  assert.doesNotMatch(content, /title: "文本标注与质量控制案例"/);
  assert.match(page, /InteractiveStatusPanel/);
  assert.match(page, /qian-roadmap-v2/);
  assert.match(page, /toggleTheme/);
  assert.doesNotMatch(page, /selectedLabel|annotationDemo/);
  assert.match(page, /<GlossaryFlipCard \/>/);
  assert.match(page, /<GrowingSapling theme=\{theme\} width=\{420\} smoothTime=\{0\.08\} \/>/);
  assert.match(page, /<DataBuddy width=\{164\} \/>/);
  assert.match(layout, /title:\s*"个人网站"/);
  assert.match(sapling, /aspect-ratio|--sapling-width/);
  assert.match(sapling, /prefers-reduced-motion: reduce/);
  assert.match(sapling, /IntersectionObserver/);
  assert.match(sapling, /wrap\.closest<HTMLElement>\("\.growth-section"\)/);
  assert.match(sapling, /viewportHeight - rect\.height/);
  assert.match(sapling, /<figure/);
  assert.match(sapling, /aria-label=/);
  assert.match(buddy, /bot-idle-animated\.webp/);
  assert.match(buddy, /bot-nod-animated\.webp/);
  assert.match(buddy, /bot-work-animated\.webp/);
  assert.match(buddy, /prefers-reduced-motion: reduce/);
  assert.match(buddy, /new window\.Image\(\)/);
  assert.doesNotMatch(buddy, /new Image\(\)/);
  assert.match(buddy, /ACTION_HOLD_MS = 2700/);
  assert.match(buddy, /onDoubleClick=\{handleBuddyDoubleClick\}/);
  assert.match(buddy, /onPointerDown=\{handlePointerDown\}/);
  assert.match(buddy, /data-buddy-bubble/);
  assert.doesNotMatch(buddy, /\.mp4/);
  assert.match(glossary, /export const glossaryCards/);
  assert.match(glossary, /termZh: "词元"/);
  assert.match(glossary, /termEn: "Token"/);
  assert.match(glossary, /termZh: "奖励模型"/);
  assert.match(glossary, /termEn: "Reward Model \(RM\)"/);
  assert.match(glossary, /termZh: "上下文窗口"/);
  assert.match(glossary, /termEn: "Context Window"/);
  assert.match(glossary, /termZh: "思维链"/);
  assert.match(glossary, /termEn: "Chain of Thought \(CoT\)"/);
  assert.doesNotMatch(glossary, /termZh: "AI 训练师"|termZh: "质检 QA"|termZh: "Bad case"/);
  assert.match(flipCard, /SpeechSynthesisUtterance/);
  assert.match(flipCard, /utterance\.lang = "en-US"/);
  assert.match(flipCard, /朗读 \$\{card\.termEn\} 的英文发音/);
  assert.match(flipCard, /disabled=\{index === 0\}/);
  assert.match(flipCard, /aria-live="polite"/);
  assert.doesNotMatch(page, /SkeletonPreview|react-loading-skeleton/);
});
