export type ProjectStatus = "doing" | "completed" | "planned";
export type TaskStatus = "todo" | "doing" | "done";

export type ProjectDetail = {
  label: string;
  value: string;
};

export type Project = {
  id: number;
  slot: string;
  status: ProjectStatus;
  statusLabel: string;
  title: string;
  summary: string;
  description: string;
  details: ProjectDetail[];
  link?: string;
  linkLabel?: string;
};

export type RoadmapTask = {
  id: number;
  title: string;
  status: TaskStatus;
};

export const siteContent = {
  name: "七安",
  heroName: "QI'AN",
  eyebrow: "CIVIL ENGINEERING × AI DATA",
  headline: "BUILDING WITH DATA.",
  introduction:
    "土木工程专业研三学生，正在从工程研究走向 AI 数据训练与大模型数据构建。这里记录我的研究、学习和正在形成的作品。",
  aboutTitle: "From civil engineering to AI data.",
  aboutParagraphs: [
    "我目前就读于成都大学土木工程专业研三，正在完成硕士毕业论文。工程研究训练让我习惯从复杂问题中梳理变量、处理数据，并用可验证的方式推进结论。",
    "研究生期间，我主要负责并完整推进了一篇机器学习相关论文的研究与发表，包括数据处理、模型实验、论文撰写、投稿、审稿意见回复和多轮修改。",
    "现在，我正在系统学习 AI 数据训练师相关知识，希望进入大模型数据构建、数据质量控制或模型评测方向，并逐步拓展 RAG、Prompt 与 Agent 自动化能力。",
  ],
} as const;

export const quickFacts = [
  { label: "EDUCATION / 教育背景", value: "成都大学 · 土木工程硕士" },
  { label: "STATUS / 当前状态", value: "研三 · 毕业论文进行中" },
  { label: "TARGET / 目标方向", value: "AI 数据训练师" },
  { label: "LOCATION / 所在城市", value: "成都" },
] as const;

export const careerTracks = [
  {
    index: "01",
    title: "数据构建",
    description: "围绕大模型业务需求，完成数据采集、清洗、标注规则、训练数据生产与质量验收。",
    skills: ["需求拆解", "数据清洗", "标注与质检"],
  },
  {
    index: "02",
    title: "模型评测",
    description: "设计评测维度与评测集，执行模型测试，分析结果和 Bad Case，并形成迭代建议。",
    skills: ["评测集构建", "结果分析", "Bad Case"],
  },
  {
    index: "03",
    title: "自动化（Prompt 工程）",
    description: "使用 Prompt、RAG 与 Agent，将重复的数据处理和模型评测流程逐步转化为自动化工作流。",
    skills: ["Prompt", "RAG", "Agent"],
  },
] as const;

export const experienceItems = [
  {
    period: "2026",
    label: "RESEARCH / 研究成果",
    title: "机器学习方法与钢筋混凝土黏结强度预测",
    description:
      "在导师提供研究思路的基础上，主要负责数据处理、SVM 与 XGB 模型实验、论文写作、投稿及审稿修改，完整推进论文发表流程。",
    link: "https://www.mdpi.com/1996-1944/19/10/1928",
    linkLabel: "查看发表于 Materials 的论文",
  },
  {
    period: "NOW",
    label: "TRANSITION / 转型学习",
    title: "AI 数据训练师能力体系",
    description:
      "围绕数据采集与清洗、标注规则、质量控制、SFT 数据、模型评测、RAG 与 Agent 建立个人知识库，并通过项目逐步形成岗位证据。",
  },
  {
    period: "CAMPUS",
    label: "EXPERIENCE / 校园经历",
    title: "学院学生工作办公室助管",
    description:
      "参与日常事务协调、材料整理和师生沟通，在多任务环境中锻炼执行、沟通与信息整理能力。",
  },
] as const;

export const projects: Project[] = [
  {
    id: 1,
    slot: "研究项目 01",
    status: "completed",
    statusLabel: "已发表",
    title: "腐蚀钢筋混凝土黏结强度预测",
    summary: "使用 SVM 与 XGB 方法开展预测研究，并完成论文写作、投稿与审稿修改。",
    description:
      "一个将土木工程问题、数据处理和机器学习方法结合起来的研究项目，也是我转向 AI 数据方向的重要起点。",
    details: [
      { label: "研究主题", value: "腐蚀钢筋混凝土黏结强度预测" },
      { label: "主要工作", value: "数据处理、模型实验、论文写作、投稿与审稿修改" },
      { label: "使用方法", value: "Support Vector Machine（SVM）、XGBoost（XGB）" },
      { label: "成果", value: "论文发表于 MDPI 期刊 Materials" },
    ],
    link: "https://www.mdpi.com/1996-1944/19/10/1928",
    linkLabel: "查看论文",
  },
  {
    id: 2,
    slot: "学习项目 02",
    status: "doing",
    statusLabel: "持续建设",
    title: "AI 数据训练师知识库",
    summary: "把课程、实践与复盘整理为可检索、可复习、可转化为作品的知识体系。",
    description:
      "知识库围绕数据采集、清洗、标注、质量控制、模型评测、RAG 与 Agent 展开，用结构化记录连接学习与求职作品。",
    details: [
      { label: "当前主题", value: "数据构建、质量控制、模型评测、RAG、Agent" },
      { label: "组织方式", value: "原始资料 → 知识 Wiki → 学习记录与项目产出" },
      { label: "我的角色", value: "学习者、资料整理者与项目实践者" },
      { label: "下一步", value: "补充可复现案例与岗位能力证据" },
    ],
  },
  {
    id: 3,
    slot: "项目案例 03",
    status: "planned",
    statusLabel: "计划中",
    title: "AI 数据训练项目案例",
    summary: "计划围绕数据构建、模型评测或自动化，完成一个可复现、可说明方法与结果的项目案例。",
    description:
      "该位置用于后续展示完整的 AI 数据训练项目案例。项目将从真实需求或明确标注的模拟需求出发，记录目标、数据、规则、执行过程、质量检查、结果与复盘。",
    details: [
      { label: "计划方向", value: "数据构建、模型评测或自动化（Prompt 工程）" },
      { label: "展示结构", value: "背景与目标、数据与规则、执行过程、结果与复盘" },
      { label: "预期产出", value: "可复现数据样例、项目文档、质量或评测报告" },
      { label: "当前状态", value: "待确定具体选题，完成后补充真实过程与结果" },
    ],
  },
];

export const defaultRoadmapTasks: RoadmapTask[] = [
  { id: 1, title: "完成硕士毕业论文", status: "doing" },
  { id: 2, title: "学习数据构建与质量控制", status: "doing" },
  { id: 3, title: "制作文本标注与质检案例", status: "todo" },
  { id: 4, title: "制作大模型评测案例", status: "todo" },
  { id: 5, title: "完善个人网站项目证据", status: "todo" },
  { id: 6, title: "发表机器学习相关论文", status: "done" },
];

export const contentChecklist = [
  "补充毕业论文完成后的研究摘要",
  "完成文本标注与质量控制模拟项目",
  "完成一个可复现的大模型评测案例",
  "整理 AI 数据训练师阶段学习成果",
  "补充项目截图、数据样例和过程证据",
  "准备个人简历与求职版项目说明",
];

export const contactItems = [
  {
    id: "01",
    label: "GitHub",
    display: "czandqian-wq",
    href: "https://github.com/czandqian-wq",
    action: "访问 ↗",
  },
  {
    id: "02",
    label: "Email",
    display: "czandqian@gmail.com",
    href: "mailto:czandqian@gmail.com",
    action: "写邮件 ↗",
  },
  {
    id: "03",
    label: "小红书",
    display: "6106468337",
    href: "https://www.xiaohongshu.com/user/profile/63e8f56200000000260102b3",
    action: "打开 ↗",
  },
] as const;
