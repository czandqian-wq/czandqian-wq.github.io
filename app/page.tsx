"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataBuddy from "./components/DataBuddy";
import GlossaryFlipCard from "./components/GlossaryFlipCard";
import GrowingSapling from "./components/GrowingSapling";
import InteractiveStatusPanel from "./components/InteractiveStatusPanel";
import ProjectVisual from "./components/ProjectVisual";
import SiteHeader from "./components/SiteHeader";
import {
  careerTracks,
  contactItems,
  defaultRoadmapTasks,
  experienceItems,
  projects,
  quickFacts,
  siteContent,
  type Project,
  type ProjectStatus,
  type RoadmapTask,
  type TaskStatus,
} from "./content";

type ProjectFilter = "all" | ProjectStatus;
type ModalName = "project" | null;

const filters: Array<{ value: ProjectFilter; label: string }> = [
  { value: "all", label: "全部" },
  { value: "doing", label: "进行中" },
  { value: "completed", label: "已完成" },
  { value: "planned", label: "计划中" },
];

const roadmapColumns: Array<{ id: TaskStatus; label: string }> = [
  { id: "todo", label: "TODO / 待办" },
  { id: "doing", label: "DOING / 进行中" },
  { id: "done", label: "DONE / 已完成" },
];

function Modal({
  open,
  label,
  onClose,
  children,
}: {
  open: boolean;
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = Array.from(
      modal.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      ),
    );
    focusable[0]?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    modal.addEventListener("keydown", trapFocus);
    return () => modal.removeEventListener("keydown", trapFocus);
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop open" role="dialog" aria-modal="true" aria-label={label}>
      <button className="modal-dismiss" type="button" onClick={onClose} aria-label="关闭弹窗" />
      <div className="modal" ref={modalRef}>
        <div className="modal-head">
          <p>{label}</p>
          <button className="close" type="button" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [tasks, setTasks] = useState<RoadmapTask[]>(defaultRoadmapTasks);
  const [tasksReady, setTasksReady] = useState(false);
  const [toast, setToast] = useState("");
  const progressRef = useRef<HTMLDivElement>(null);
  const toTopRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

      try {
        const savedTasks = localStorage.getItem("qian-roadmap-v2");
        if (savedTasks) setTasks(JSON.parse(savedTasks) as RoadmapTask[]);
      } catch {
        setTasks(defaultRoadmapTasks);
      } finally {
        setTasksReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (tasksReady) localStorage.setItem("qian-roadmap-v2", JSON.stringify(tasks));
  }, [tasks, tasksReady]);

  useEffect(() => {
    let animationFrame = 0;
    const updateScrollUi = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width = `${total > 0 ? (window.scrollY / total) * 100 : 0}%`;
      }
      toTopRef.current?.classList.toggle("show", window.scrollY > 600);
      animationFrame = 0;
    };
    const requestScrollUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateScrollUi);
    };
    updateScrollUi();
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", requestScrollUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const closeActiveModal = useCallback(() => {
    setActiveModal(null);
    setSelectedProject(null);
    window.setTimeout(() => lastTriggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!activeModal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeActiveModal();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeModal, closeActiveModal]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleProjects = useMemo(
    () =>
      projectFilter === "all"
        ? projects
        : projects.filter((project) => project.status === projectFilter),
    [projectFilter],
  );

  const openProject = (project: Project, trigger: HTMLElement) => {
    lastTriggerRef.current = trigger;
    setSelectedProject(project);
    setActiveModal("project");
  };

  const toggleTheme = () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("qian-theme", nextTheme);
    setTheme(nextTheme);
  };

  const moveTask = (taskId: number, direction: -1 | 1) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) return task;
        const currentIndex = roadmapColumns.findIndex((column) => column.id === task.status);
        const nextColumn = roadmapColumns[currentIndex + direction];
        return nextColumn ? { ...task, status: nextColumn.id } : task;
      }),
    );
  };

  const resetRoadmap = () => {
    setTasks(defaultRoadmapTasks);
    setToast("路线图已恢复为当前公开进度");
  };

  const updateCardSpotlight = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  };

  return (
    <main>
      <div className="progress" ref={progressRef} />

      <SiteHeader name={siteContent.name} theme={theme} onToggleTheme={toggleTheme} />
      <DataBuddy width={164} />

      <section className="hero shell" id="top">
        <div>
          <div className="mode">
            <i aria-hidden="true" />
            <span>OPEN TO AI DATA ROLES · 持续成长中</span>
          </div>
          <p className="kicker">{siteContent.eyebrow}</p>
          <h1 className="hero-title">
            {siteContent.heroName}
            <span>{siteContent.headline}</span>
          </h1>
          <p className="placeholder-line">{siteContent.introduction}</p>
          <div className="hero-actions">
            <a className="button primary" href="#about">
              认识陈壮 <span>↓</span>
            </a>
            <a className="button" href="#projects">查看项目 <span>↗</span></a>
          </div>
        </div>

        <InteractiveStatusPanel theme={theme} />
        <span className="scroll-hint">↓ 向下探索</span>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...Array(2)].flatMap((_, group) =>
            ["ABOUT", "EXPERIENCE", "PROJECTS", "GROWTH", "PLAYGROUND", "ROADMAP", "CONTACT"].map(
              (item) => <span key={`${group}-${item}`}>{item}</span>,
            ),
          )}
        </div>
      </div>

      <section className="section shell reveal" id="about">
        <div className="section-head">
          <strong>01</strong>
          <p>ABOUT / 关于陈壮</p>
        </div>
        <div className="about-layout">
          <h2 className="display">{siteContent.aboutTitle}</h2>
          <div className="blank-copy">
            {siteContent.aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <div className="quick-facts">
          {quickFacts.map((fact) => (
            <article className="fact" key={fact.label}>
              <small>{fact.label}</small>
              <strong>{fact.value}</strong>
            </article>
          ))}
        </div>

        <div className="career-intro">
          <p className="kicker">CAREER FOCUS / 转型方向</p>
          <h3>从数据构建出发，走向模型评测与自动化。</h3>
        </div>
        <div className="career-grid">
          {careerTracks.map((track) => (
            <article className="career-card" key={track.index}>
              <span>{track.index}</span>
              <h4>{track.title}</h4>
              <p>{track.description}</p>
              <div>
                {track.skills.map((skill) => <small key={skill}>{skill}</small>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell reveal" id="experience">
        <div className="section-head">
          <strong>02</strong>
          <p>EXPERIENCE / 研究与经历</p>
        </div>
        <div className="experience-layout">
          <div className="experience-lead">
            <p className="kicker">RESEARCH · LEARNING · COLLABORATION</p>
            <h2 className="display">把经历变成可以继续生长的能力。</h2>
          </div>
          <div className="timeline">
            {experienceItems.map((item) => (
              <article className="timeline-item" key={`${item.period}-${item.title}`}>
                <div className="timeline-meta">
                  <strong>{item.period}</strong>
                  <small>{item.label}</small>
                </div>
                <div className="timeline-copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer">
                      {item.linkLabel} <span>↗</span>
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell projects-section reveal" id="projects">
        <div className="section-head">
          <strong>03</strong>
          <p>PROJECTS / 正在形成的作品</p>
        </div>
        <div className="projects-intro">
          <div>
            <p className="kicker">WORK IN PROGRESS · 持续更新</p>
            <h2 className="display">把学习过程，逐步变成看得见的作品。</h2>
          </div>
          <p>这里同时保留已完成、进行中和计划中的内容。重点不是包装成熟，而是清楚记录每一步如何发生。</p>
        </div>
        <div className="filter-bar" role="group" aria-label="项目筛选">
          {filters.map((filter) => (
            <button
              className={`filter${projectFilter === filter.value ? " active" : ""}`}
              type="button"
              key={filter.value}
              onClick={() => setProjectFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="project-grid">
          {visibleProjects.map((project) => (
            <button
              className={`project-card project-${project.id}`}
              type="button"
              key={project.id}
              onClick={(event) => openProject(project, event.currentTarget)}
              onPointerMove={updateCardSpotlight}
            >
              <span className="card-top">
                <span>{String(project.id).padStart(2, "0")}</span>
                <span>{project.statusLabel}</span>
              </span>
              <ProjectVisual projectId={project.id} />
              <div className="project-card-copy">
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </div>
              <span className="card-footer">
                <span>查看详情</span>
                <span>↗</span>
              </span>
            </button>
          ))}
        </div>
        <p className="project-swipe-hint">横向滑动查看项目 →</p>
      </section>

      <section className="growth-section" id="growth">
        <div className="growth-shell shell reveal">
          <div className="section-head">
            <strong>04</strong>
            <p>GROWTH / 数据与成长</p>
          </div>
          <div className="growth-layout">
            <div className="growth-copy">
              <p className="kicker">SCROLL TO GROW · 向下滚动</p>
              <h2>能力不是突然出现的，它从每一份数据里慢慢生长。</h2>
              <p>
                从土木工程研究到 AI 数据训练，我正在把文献、实验、规则和复盘连接起来。每一次整理与验证，都是下一片叶子。
              </p>
              <div className="growth-steps" aria-label="成长路径">
                <span><b>01</b> 发现问题</span>
                <span><b>02</b> 整理数据</span>
                <span><b>03</b> 建立规则</span>
                <span><b>04</b> 验证迭代</span>
              </div>
            </div>
            <div className="sapling-stage">
              <GrowingSapling theme={theme} width={420} smoothTime={0.08} />
              <div className="sapling-caption" aria-hidden="true">
                <span>DATA SAPLING / 98 FRAMES</span>
                <span>SCROLL TO GROW ↕</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section workbench reveal" id="lab">
        <div className="section-head">
          <strong>05</strong>
          <p>PLAYGROUND / AI 术语翻卡</p>
        </div>
        <div className="lab-grid">
          <div className="lab-intro">
            <p className="kicker">LEARN · FLIP · REMEMBER</p>
            <h2 className="display">一个术语，两种说法。</h2>
            <p>
              点击卡片翻面，看看每个 AI 术语的专业解释、面试回答和生活化例子。内容来自我的知识库《AI 名词解释大全》（63 词）。
            </p>
          </div>
          <GlossaryFlipCard />
        </div>
      </section>

      <section className="section shell reveal" id="roadmap">
        <div className="section-head">
          <strong>06</strong>
          <p>ROADMAP / 公开路线图</p>
        </div>
        <div className="roadmap-wrap">
          <div className="roadmap-copy">
            <h2 className="display">把转型拆成一件件可以完成的事。</h2>
            <p>这里公开记录毕业、学习与作品进度。任务移动只保存在当前浏览器，用来演示路线变化，不会修改我的真实进度。</p>
            <div className="roadmap-summary">
              <span><b>{tasks.filter((task) => task.status === "done").length}</b> 已完成</span>
              <span><b>{tasks.filter((task) => task.status === "doing").length}</b> 进行中</span>
              <button type="button" onClick={resetRoadmap}>恢复公开进度</button>
            </div>
          </div>
          <div className="board-scroll">
            <div className="board">
              {roadmapColumns.map((column, columnIndex) => {
                const columnTasks = tasks.filter((task) => task.status === column.id);
                return (
                  <section className={`column column-${column.id}`} key={column.id}>
                    <div className="column-head">
                      <span>{column.label}</span>
                      <span>{columnTasks.length}</span>
                    </div>
                    {columnTasks.map((task) => (
                      <article className="task" key={task.id}>
                        <strong>{task.title}</strong>
                        <div className="task-controls">
                          <button type="button" disabled={columnIndex === 0} onClick={() => moveTask(task.id, -1)}>←</button>
                          <button type="button" disabled={columnIndex === roadmapColumns.length - 1} onClick={() => moveTask(task.id, 1)}>→</button>
                        </div>
                      </article>
                    ))}
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="shell reveal">
          <p className="kicker">CONTACT / ELSEWHERE</p>
          <h2>
            一起交流，
            <br />
            关于数据与 AI。
          </h2>
          <div className="contact-list">
            {contactItems.map((item) => (
              <a
                className="contact-row"
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                key={item.id}
              >
                <span>{item.id}</span>
                <strong>{item.label}</strong>
                <small>{item.display}</small>
                <i>{item.action}</i>
              </a>
            ))}
          </div>
          <footer className="site-footer">
            <span>© 2026 陈壮</span>
            <span>RESEARCH · AI DATA · BUILDING IN PUBLIC</span>
          </footer>
        </div>
      </section>

      <Modal
        open={activeModal === "project"}
        label="PROJECT DETAIL / 项目详情"
        onClose={closeActiveModal}
      >
        <p className="modal-slot">{selectedProject?.slot}</p>
        <h3>{selectedProject?.title ?? "项目详情"}</h3>
        <p>{selectedProject?.description}</p>
        <div className="detail-list">
          {selectedProject?.details.map((detail) => (
            <div className="detail-row" key={detail.label}>
              <span>{detail.label}</span>
              <strong>{detail.value}</strong>
            </div>
          ))}
        </div>
        {selectedProject?.link ? (
          <a className="button primary modal-link" href={selectedProject.link} target="_blank" rel="noreferrer">
            {selectedProject.linkLabel ?? "查看项目"} <span>↗</span>
          </a>
        ) : null}
      </Modal>

      <div className={`toast${toast ? " show" : ""}`} role="status">
        {toast}
      </div>

      <button
        className="to-top"
        type="button"
        ref={toTopRef}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="回到顶部"
        title="回到顶部"
      >
        ↑
      </button>
    </main>
  );
}
