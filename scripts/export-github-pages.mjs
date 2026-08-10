import { copyFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://czandqian-wq.github.io";
const outputRoot = resolve("dist/client");
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages-export", Date.now().toString());

const { default: worker } = await import(workerUrl.href);
const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};
const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

async function exportRoute(pathname, filename, accept) {
  const response = await worker.fetch(
    new Request(new URL(pathname, siteUrl), { headers: { accept } }),
    env,
    ctx,
  );

  if (!response.ok) {
    throw new Error(`Failed to export ${pathname}: ${response.status}`);
  }

  await writeFile(resolve(outputRoot, filename), await response.text(), "utf8");
}

await exportRoute("/", "index.html", "text/html");
await copyFile(resolve(outputRoot, "index.html"), resolve(outputRoot, "404.html"));
await exportRoute("/manifest.webmanifest", "manifest.webmanifest", "application/manifest+json");
await exportRoute("/robots.txt", "robots.txt", "text/plain");
await exportRoute("/sitemap.xml", "sitemap.xml", "application/xml");
await writeFile(resolve(outputRoot, ".nojekyll"), "", "utf8");

console.log(`GitHub Pages export ready in ${outputRoot}`);
