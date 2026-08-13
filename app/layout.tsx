import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "个人网站",
  description: "陈壮的个人网站：土木工程研究、AI 数据训练学习、项目实践与成长路线。",
  keywords: ["陈壮", "AI 数据训练师", "大模型数据", "数据质量", "模型评测", "个人网站"],
  authors: [{ name: "陈壮" }],
  category: "portfolio",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "个人网站",
    title: "个人网站",
    description: "记录研究、AI 数据学习、项目实践与持续成长。",
    url: "/",
    images: [{ url: "/og.png", width: 1754, height: 900, alt: "陈壮的 AI 数据个人网站" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "个人网站",
    description: "记录研究、AI 数据学习、项目实践与持续成长。",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

const themeInitializer = `
  try {
    const savedTheme = localStorage.getItem("qian-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      document.documentElement.dataset.theme = savedTheme;
    }
  } catch {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
