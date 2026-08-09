const projects = [
  {
    number: "01",
    status: "BUILDING",
    title: "商品评论意图分类",
    summary:
      "从需求说明、标注规则和试标开始，完成数据清洗、分类标注、质检报告与 bad case 复盘。",
    tags: ["规则设计", "试标", "质量控制"],
  },
  {
    number: "02",
    status: "PLANNED",
    title: "大模型回答质量评测",
    summary:
      "建立评分维度与测试集，对模型回答进行人工评测、错误分类和结果分析。",
    tags: ["评测集", "评分标准", "错误分析"],
  },
  {
    number: "03",
    status: "PLANNED",
    title: "企业资料 RAG 问答助手",
    summary:
      "完成资料解析、检索引用、测试问题设计和回答质量验收，形成可演示应用。",
    tags: ["RAG", "引用", "验收测试"],
  },
];

const learningNotes = [
  ["08.06", "让 AI 挑我学习里的错", "先用自己的话讲，再让 AI 找出模糊和混淆。"],
  ["08.07", "学了两百多个 AI 术语", "把陌生词汇放回真实的产品和工作场景。"],
  ["08.08", "模型看到的不是字，是数字", "从 Token、向量到 Transformer 的理解记录。"],
  ["08.08", "预训练与 SFT", "通才如何通过优质数据成为专才。"],
];

const process = [
  ["01", "理解需求", "确认业务目标、数据范围、质量与交付约束。"],
  ["02", "检查数据", "抽样观察原始数据，识别缺失、噪声与边界问题。"],
  ["03", "制定规则", "定义标签、正反例、冲突处理与验收标准。"],
  ["04", "小规模试标", "用真实分歧验证规则、人员、工具和产能。"],
  ["05", "质检验收", "抽检、归因、返修，并判断批次是否达到交付标准。"],
  ["06", "复盘迭代", "用 bad case 更新规则，让下一轮更准、更快。"],
];

export default function Home() {
  return (
    <main>
      <header className="site-header shell">
        <a className="wordmark" href="#top" aria-label="回到首页">
          <span className="wordmark-dot" />
          CZANDQIAN
        </a>
        <nav aria-label="主导航">
          <a href="#work">项目</a>
          <a href="#method">方法</a>
          <a href="#notes">记录</a>
          <a href="#contact">联系</a>
        </nav>
        <a
          className="github-link"
          href="https://github.com/czandqian-wq"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
      </header>

      <section className="hero shell" id="top">
        <div className="rail-index" aria-hidden="true">
          <span>00</span>
          <i />
          <span>AI DATA TRAINER</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">PERSONAL INDEX · 2026</p>
          <h1>
            把模糊需求
            <span>变成可用数据。</span>
          </h1>
          <div className="hero-meta">
            <p>
              正在成长的 AI 数据训练师，关注数据标注、质量控制、SFT、
              模型评测、RAG 与 Agent 自动化。
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#work">
                查看项目 <span>↓</span>
              </a>
              <a className="text-action" href="#about">
                关于我 ↘
              </a>
            </div>
          </div>
        </div>

        <div className="data-orbit" aria-label="从原始数据到可用数据的流程示意">
          <div className="orbit-ring orbit-ring-one" />
          <div className="orbit-ring orbit-ring-two" />
          <div className="orbit-core">
            <strong>DATA</strong>
            <span>QUALITY LOOP</span>
          </div>
          <span className="orbit-node node-raw">RAW</span>
          <span className="orbit-node node-rule">RULES</span>
          <span className="orbit-node node-qa">QA</span>
          <span className="orbit-node node-ready">READY</span>
        </div>

        <p className="scroll-cue">↓ 往下看</p>
      </section>

      <section className="section shell about" id="about">
        <div className="section-heading">
          <span>01</span>
          <p>ABOUT / 关于我</p>
        </div>
        <div className="about-grid">
          <h2>我不只想“会用 AI”。</h2>
          <div className="about-copy">
            <p>
              我更关心模型为什么会出错，什么样的数据才算优质，以及怎样把模糊业务需求变成清晰、可执行、可验收的规则。
            </p>
            <p>
              我正在把每次学习沉淀成知识，把每项能力转化为项目证据。这个网站也会随着我的学习与实践持续更新。
            </p>
          </div>
        </div>
        <div className="capability-strip" aria-label="正在训练的能力">
          <article>
            <span>A</span>
            <h3>从需求到规则</h3>
            <p>业务目标 · 标签边界 · 正反例 · 验收标准</p>
          </article>
          <article>
            <span>B</span>
            <h3>从标注到质量闭环</h3>
            <p>试标 · 分歧分析 · 抽检 · bad case 复盘</p>
          </article>
          <article>
            <span>C</span>
            <h3>从重复工作到自动化</h3>
            <p>Prompt · API · Python · RAG · Agent</p>
          </article>
        </div>
      </section>

      <section className="section shell knowledge" id="work">
        <div className="section-heading light-heading">
          <span>02</span>
          <p>FEATURED WORK / 核心作品</p>
        </div>
        <div className="knowledge-layout">
          <div>
            <p className="eyebrow teal">LIVING KNOWLEDGE SYSTEM</p>
            <h2>AI 数据训练师<br />学习知识库</h2>
            <p className="knowledge-intro">
              从原始课程资料，到知识 Wiki、学习复盘、项目实战和求职输出。它不是资料收藏夹，而是一套持续发现知识缺口并推动实践的个人系统。
            </p>
          </div>
          <div className="metric-grid">
            <div><strong>09</strong><span>核心能力主题</span></div>
            <div><strong>63</strong><span>AI 名词解释</span></div>
            <div><strong>250</strong><span>Vibe Coding 术语</span></div>
            <div><strong>∞</strong><span>持续更新</span></div>
          </div>
        </div>
        <div className="knowledge-flow">
          <span>原始资料</span><i>→</i><span>课程笔记</span><i>→</i><span>知识 Wiki</span><i>→</i><span>项目证据</span>
        </div>
      </section>

      <section className="section shell projects">
        <div className="section-heading">
          <span>03</span>
          <p>NEXT BUILDS / 在建项目</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project-row" key={project.number}>
              <span className="project-number">{project.number}</span>
              <div className="project-title">
                <span className="status">{project.status}</span>
                <h3>{project.title}</h3>
              </div>
              <p>{project.summary}</p>
              <div className="tag-list">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <span className="project-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell method" id="method">
        <div className="section-heading">
          <span>04</span>
          <p>METHOD / 我的工作方法</p>
        </div>
        <div className="method-lead">
          <h2>质量不是最后检查出来的，<br />而是从规则开始设计的。</h2>
          <p>一条从业务需求到数据交付，再回到规则更新的完整质量闭环。</p>
        </div>
        <ol className="process-list">
          {process.map(([number, title, text]) => (
            <li key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section shell notes" id="notes">
        <div className="section-heading">
          <span>05</span>
          <p>LEARNING LOG / 学习现场</p>
        </div>
        <div className="notes-head">
          <h2>把“我懂了”，<br />变成“我能讲清楚”。</h2>
          <p>先用自己的话解释，再让 AI 挑错；保留困惑、修正和真正学会的证据。</p>
        </div>
        <div className="note-grid">
          {learningNotes.map(([date, title, text]) => (
            <article key={title}>
              <time dateTime={`2026-${date.replace(".", "-")}`}>{date}</time>
              <h3>{title}</h3>
              <p>{text}</p>
              <span aria-hidden="true">↘</span>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="shell contact-inner">
          <p className="eyebrow">CONTACT / ELSEWHERE</p>
          <h2>一起聊聊数据、<br />模型和成长。</h2>
          <div className="contact-links">
            <a href="https://github.com/czandqian-wq" target="_blank" rel="noreferrer">
              <span>01</span><strong>GitHub</strong><small>@czandqian-wq</small><i>↗</i>
            </a>
            <a href="mailto:czandqian@gmail.com">
              <span>02</span><strong>Email</strong><small>czandqian@gmail.com</small><i>↗</i>
            </a>
            <div className="contact-static">
              <span>03</span><strong>小红书</strong><small>6106468337</small><i>↗</i>
            </div>
          </div>
          <footer>
            <span>© 2026 CZANDQIAN</span>
            <span>LEARNING IN PUBLIC · BUILT WITH CURIOSITY</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
