"use client";

import { useEffect, useState } from "react";

const navItems = [
  { id: "about", label: "关于", index: "01" },
  { id: "experience", label: "经历", index: "02" },
  { id: "projects", label: "项目", index: "03" },
  { id: "growth", label: "成长", index: "04" },
  { id: "lab", label: "实验", index: "05" },
  { id: "roadmap", label: "路线图", index: "06" },
  { id: "contact", label: "联系", index: "07" },
] as const;

type Props = {
  name: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export default function SiteHeader({ name, theme, onToggleTheme }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["top", ...navItems.map((item) => item.id)];
    let animationFrame = 0;

    const updateActiveSection = () => {
      const threshold = Math.min(window.innerHeight * 0.34, 260);
      let current = "top";
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= threshold) current = id;
      });
      setActiveSection(current);
      animationFrame = 0;
    };

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`header shell${scrolled ? " scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="回到首页" onClick={closeMenu}>
          {name}
        </a>
        <nav className="nav" aria-label="主导航">
          {navItems.map((item) => (
            <a
              href={`#${item.id}`}
              className={activeSection === item.id ? "active" : ""}
              aria-current={activeSection === item.id ? "location" : undefined}
              key={item.id}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <button
            className="icon-button menu-button"
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="site-index"
            aria-label={menuOpen ? "关闭页面目录" : "打开页面目录"}
            title="页面目录"
          >
            {menuOpen ? "×" : "☰"}
          </button>
          <button
            className="icon-button theme-button"
            type="button"
            onClick={onToggleTheme}
            aria-pressed={theme === "dark"}
            aria-label="切换深浅色"
            title="切换主题"
          >
            ◐
          </button>
        </div>
      </header>

      <div className={`site-index${menuOpen ? " open" : ""}`} id="site-index" aria-hidden={!menuOpen}>
        <button className="site-index-dismiss" type="button" onClick={closeMenu} aria-label="关闭页面目录" />
        <nav className="site-index-panel" aria-label="页面目录">
          <div className="site-index-head">
            <span>QI&apos;AN / SITE INDEX</span>
            <span>07 SECTIONS</span>
          </div>
          <p>从个人背景、AI 数据学习到正在形成的项目与路线。</p>
          <div className="site-index-links">
            {navItems.map((item) => (
              <a
                href={`#${item.id}`}
                className={activeSection === item.id ? "active" : ""}
                onClick={closeMenu}
                key={item.id}
              >
                <span>{item.index}</span>
                <strong>{item.label}</strong>
                <i>↘</i>
              </a>
            ))}
          </div>
          <small>ESC TO CLOSE · 点击目录项前往对应内容</small>
        </nav>
      </div>
    </>
  );
}
