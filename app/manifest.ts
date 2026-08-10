import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "个人网站",
    short_name: "个人网站",
    description: "从土木工程研究走向 AI 数据训练与大模型数据构建。",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1e9",
    theme_color: "#3ac7b8",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
