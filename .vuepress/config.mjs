import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  lang: "zh-CN",
  title: "何遇的观察室",
  description: "面向想提升判断力的工薪阶层，持续输出关于职场、组织、关系与社会规则的现实分析，帮助读者减少误判，识别激励，扩大选择权。",
  base: "/",
  dest: "dist",
  bundler: viteBundler(),
  theme: hopeTheme(
    {
      logo: "/logo-small.jpg",
      // footer: '<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">蜀ICP备19040311号-1</a>',
      copyright: false,
      navbar: false,
      sidebar: "structure",
      headerDepth: 3,
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
