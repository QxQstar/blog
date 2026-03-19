import { promises as fs } from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "dist");
const siteUrl = (process.env.SITE_URL || process.env.URL || "https://www.heyudesign.cn").replace(
  /\/+$/,
  "",
);
const now = new Date().toISOString();

async function walkHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walkHtmlFiles(fullPath);
      }
      return entry.isFile() && entry.name === "index.html" ? [fullPath] : [];
    }),
  );

  return files.flat();
}

function toUrl(filePath) {
  const relative = path.relative(distDir, filePath).replace(/\\/g, "/");
  const route = relative === "index.html" ? "/" : `/${relative.replace(/index\.html$/, "")}`;
  return `${siteUrl}${route}`;
}

function toXml(urls) {
  const body = urls
    .map(
      (url) => [
        "  <url>",
        `    <loc>${url}</loc>`,
        `    <lastmod>${now}</lastmod>`,
        "  </url>",
      ].join("\n"),
    )
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    "</urlset>",
    "",
  ].join("\n");
}

function shouldInclude(url) {
  return (
    !url.includes("/404") &&
    !url.includes("/documents/draft/") &&
    !url.endsWith("/documents/draft/")
  );
}

async function main() {
  const htmlFiles = await walkHtmlFiles(distDir);
  const urls = [...new Set(htmlFiles.map(toUrl))].filter(shouldInclude).sort();
  const xml = toXml(urls);

  await fs.writeFile(path.join(distDir, "sitemap.xml"), xml, "utf8");
  process.stdout.write(`Generated sitemap with ${urls.length} URLs.\n`);
}

main().catch((error) => {
  process.stderr.write(`Failed to generate sitemap: ${String(error)}\n`);
  process.exit(1);
});
