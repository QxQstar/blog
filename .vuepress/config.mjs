import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";

const __dirname = getDirname(import.meta.url);
const siteUrl = (process.env.SITE_URL || process.env.URL || "https://www.heyudesign.cn").replace(
  /\/+$/,
  "",
);
const siteName = "何遇的观察室";
const siteDescription =
  "面向想提升判断力的工薪阶层，持续输出关于职场、组织、关系与社会规则的现实分析，帮助读者减少误判，识别激励，扩大选择权。";

export default defineUserConfig({
  lang: "zh-CN",
  title: siteName,
  description: siteDescription,
  hostname: siteUrl,
  base: "/",
  dest: "dist",
  shouldPrefetch: false,
  head: [
    ["meta", { name: "viewport", content: "width=device-width, initial-scale=1" }],
    ["meta", { name: "author", content: "何遇" }],
    [
      "meta",
      {
        name: "keywords",
        content: "职场决策,组织观察,关系社会,案例拆解,现实分析,判断力,工薪阶层",
      },
    ],
    ["meta", { name: "robots", content: "index,follow,max-image-preview:large" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh_CN" }],
    ["meta", { property: "og:site_name", content: siteName }],
    ["meta", { property: "og:title", content: siteName }],
    ["meta", { property: "og:description", content: siteDescription }],
    ["meta", { property: "og:url", content: `${siteUrl}/` }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: siteName }],
    ["meta", { name: "twitter:description", content: siteDescription }],
    ["link", { rel: "canonical", href: `${siteUrl}/` }],
    [
      "script",
      { type: "text/javascript" },
      `
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?88e6dabe0a7f95b8cdd6d0eed9bb88b6";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
`,
    ],
  ],
  bundler: viteBundler(),
  theme: hopeTheme(
    {
      darkmode: "enable",
    },
    { custom: true },
  ),
  alias: {
    "@theme-hope/components/home/HomePage": path.resolve(
      __dirname,
      "./components/HomePage.vue",
    ),
  },
});
