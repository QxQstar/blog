<template>
  <HomePage v-if="isHomePage" />

  <main
    v-else
    class="content-layout"
  >
    <header class="content-topbar">
      <nav
        aria-label="栏目导航"
      >
        <RouterLink
          v-for="section in contentSections"
          :key="section.id"
          :to="section.link"
          class="content-nav__item"
          :class="{ 'is-active': isSectionActive(section.id) }"
        >
          {{ section.title }}
        </RouterLink>
      </nav>
    </header>

    <section class="content-main">
      <aside class="content-list">
        <p class="content-list__label">
          {{ currentSection?.title ?? "当前阅读" }}
        </p>

        <ul class="content-list__items">
          <li
            v-for="article in currentArticles"
            :key="article.link"
          >
            <RouterLink
              :to="article.link"
              class="content-list__link"
              :class="{ 'is-active': isCurrentArticle(article.link) }"
            >
              {{ article.title }}
            </RouterLink>
          </li>
        </ul>
      </aside>

      <article class="content-article">
        <Content class="theme-hope-content content-markdown" />
      </article>
    </section>
    
    <section class="content-actions">
      <AuthorReward />
      <ContactAuthor />
    </section>

    <section class="content-footer">
      <p>何遇，写职场、组织、关系与社会规则，关注判断力与选择权。</p>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">蜀ICP备19040311号-1</a>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { Content, usePageData, useRoutes } from "vuepress/client";
import { RouterLink } from "vue-router";
import { contentSections } from "../content.config.mjs";
import ContactAuthor from "../components/ContactAuthor.vue";
import AuthorReward from "../components/AuthorReward.vue";
import HomePage from "../components/HomePage.vue";

const page = usePageData();
const routes = useRoutes();

const normalizePath = (path = "") => {
  if (!path || path === "/") return "/";

  return path.replace(/\/$/, "");
};

const currentPath = computed(() => normalizePath(page.value.path));
const isHomePage = computed(
  () => currentPath.value === "/" || page.value.frontmatter.home === true,
);

const currentSection = computed(() =>
  contentSections.find((section) => {
    const sectionPath = normalizePath(section.prefix);

    return (
      currentPath.value === sectionPath ||
      currentPath.value.startsWith(`${sectionPath}/`) ||
      currentPath.value === normalizePath(section.link)
    );
  }),
);

const currentArticles = computed(() => {
  if (!currentSection.value) {
    return [
      {
        title: page.value.title || "当前文章",
        link: page.value.path,
      },
    ];
  }

  const sectionPrefix = normalizePath(currentSection.value.prefix);
  const routeEntries = Object.entries(routes.value ?? {});
  const articles = routeEntries
    .filter(([path]) => {
      const normalized = normalizePath(path);

      return (
        normalized === sectionPrefix ||
        normalized.startsWith(`${sectionPrefix}/`)
      );
    })
    .map(([path, route]) => ({
      title:
        route.meta?.title ||
        (normalizePath(path) === sectionPrefix
          ? currentSection.value.title
          : path.split("/").filter(Boolean).at(-1) || "未命名文章"),
      link: path,
    }))
    .sort((a, b) => {
      const aIsIndex = normalizePath(a.link) === sectionPrefix;
      const bIsIndex = normalizePath(b.link) === sectionPrefix;

      if (aIsIndex && !bIsIndex) return -1;
      if (!aIsIndex && bIsIndex) return 1;

      return a.link.localeCompare(b.link, "zh-CN");
    });

  if (!articles.length) {
    articles.push({
      title: currentSection.value.title,
      link: currentSection.value.link,
    });
  } else if (
    !articles.some((article) => normalizePath(article.link) === currentPath.value)
  ) {
    articles.unshift({
      title: page.value.title || "当前文章",
      link: page.value.path,
    });
  }

  return articles;
});

const isSectionActive = (sectionId) => currentSection.value?.id === sectionId;

const isCurrentArticle = (link) => normalizePath(link) === currentPath.value;
</script>

<style lang="scss">
.content-layout {
  max-width: 1240px;
  margin: 0 auto;
  padding: 2rem 2rem 3rem;
}

.content-topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 0.75rem 0 1rem;
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  backdrop-filter: blur(12px);
}

.content-nav__item {
  margin: 0 0.5rem;
  color: var(--vp-c-text);
  text-align: center;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.content-nav__item.is-active {
  border-bottom: 1px solid var(--vp-c-border);
  border-color: var(--vp-c-text);
  background: var(--vp-c-bg-soft);
}

.content-main {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
  padding-top: 2rem;
}

.content-list {
  position: sticky;
  top: 6rem;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
}

.content-list__label {
  margin: 0 0 1rem;
  color: var(--vp-c-text-mute);
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.content-list__items {
  margin: 0;
  padding: 0;
  list-style: none;
}

.content-list__items li + li {
  margin-top: 0.75rem;
}

.content-list__link {
  display: block;
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  color: var(--vp-c-text-subtle);
  line-height: 1.6;
  text-decoration: none;
}

.content-list__link:hover,
.content-list__link.is-active {
  color: var(--vp-c-text);
}

.content-article {
  min-width: 0;
  padding: 2rem 2.4rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 24px;
  background: var(--vp-c-bg);
}

.content-markdown {
  max-width: none;
  margin: 0;
}

.content-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.content-footer {
  padding-top: 2rem;
  color: var(--vp-c-text-mute);
  text-align: center;
}

.content-footer a {
  display: block;
  color: var(--vp-c-text-mute);
  padding-top: 2rem;
  font-size: 0.8rem;
}

@media (max-width: 959px) {
  .content-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .content-main {
    grid-template-columns: 1fr;
  }

  .content-list {
    position: static;
  }
}

@media (max-width: 479px) {
  .content-layout {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }

  .content-nav {
    grid-template-columns: 1fr;
  }

  .content-article {
    padding: 1.25rem;
  }

  .content-list {
    padding: 1.0rem;
  }

  .content-list .content-list__link{
    padding: 0.25rem;
  }
}
</style>
