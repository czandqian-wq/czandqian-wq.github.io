import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "czandqian｜AI 数据训练师成长作品集";
const description =
  "记录 czandqian 从 AI 学习者走向 AI 数据训练师的过程，展示数据标注、质量控制、SFT、模型评测、RAG 与 Agent 自动化实践。";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "zh_CN",
      images: [{ url: imageUrl, width: 1736, height: 907, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
