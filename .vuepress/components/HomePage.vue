<template>
  <main class="home-page">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">何遇的观察室</p>
        <h1 id="main-title">看清规则，保住选择权</h1>
        <p class="subtitle">
          面向想提升判断力的工薪阶层，持续输出关于职场、组织、关系与社会规则的现实分析，帮助读者减少误判，识别激励，扩大选择权。
        </p>
      </div>
    </section>

    <section class="sections">
      <header class="section-header">
        <p class="section-label">栏目</p>
      </header>

      <div class="cards">
        <RouterLink
          v-for="item in sections"
          :key="item.title"
          class="card"
          :to="item.link"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </RouterLink>
      </div>
    </section>

    <section class="footer-note">
      <p>何遇，写职场、组织、关系与社会规则，关注判断力与选择权。</p>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">蜀ICP备19040311号-1</a>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";

const sections = [
  {
    title: "职场决策",
    link: "/documents/workplace/",
    description:
      "写求职、面试、薪酬、晋升、离职与管理，关注个体如何在工作中做更划算的选择。",
  },
  {
    title: "组织观察",
    link: "/documents/organization/",
    description:
      "写权力、协作、资源分配、话语权与办公室政治。关注组织表面流程背后的真实激励。",
  },
  {
    title: "关系社会",
    link: "/documents/relationship/",
    description:
      "写亲密关系、性别、家庭与社会结构。关注私人困惑背后的制度压力与现实约束。",
  },
  {
    title: "案例拆解",
    link: "/documents/cases/",
    description:
      "拆平台、公司、职业路径与具体事件。通过现实样本训练判断力，而不是停留在观点表态。",
  },
];
</script>

<style lang="scss">
.home-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: calc(var(--vp-navbar-height, 3.6rem) + 2rem) 2rem 4rem;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(240px, 0.7fr);
  gap: 2rem;
  align-items: center;
  padding: 2.5rem 0 3rem;
}

.eyebrow,
.section-label {
  margin: 0 0 1rem;
  color: var(--vp-c-text-mute);
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0;
  color: var(--vp-c-text);
  font-size: clamp(1.2rem, 6vw, 2.0rem);
  line-height: 1.06;
}

.subtitle {
  max-width: 46rem;
  margin: 1.5rem 0 0;
  color: var(--vp-c-text-mute);
  font-size: 1.15rem;
  line-height: 1.9;
}

.hero-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  border: 1px solid var(--vp-c-border);
  border-radius: 24px;
  background:
    radial-gradient(circle at top, rgba(80, 80, 80, 0.08), transparent 58%),
    var(--vp-c-bg-soft);
}

.hero-mark img {
  width: min(180px, 60%);
  opacity: 0.92;
}

.sections {
  padding: 3rem 0;
}

.section-header h2 {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.4rem);
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  margin-top: 2rem;
}

.card {
  display: block;
  min-height: 220px;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  border-color: var(--vp-c-text);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-index {
  margin: 0 0 1rem;
  color: var(--vp-c-text-mute);
  font-size: 0.9rem;
  letter-spacing: 0.14em;
}

.card h3 {
  margin: 0 0 1rem;
  font-size: 1.4rem;
}

.card p:last-child {
  margin: 0;
  color: var(--vp-c-text-mute);
  line-height: 1.85;
}

.footer-note {
  padding-top: 2rem;
  text-align: center;
}

.footer-note p {
  margin: 0;
  color: var(--vp-c-text-mute);
  font-size: 1rem;
}

.footer-note a {
  display: block;
  color: var(--vp-c-text-mute);
  padding-top: 2rem;
  font-size: 0.8rem;
}

@media (max-width: 959px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero-mark {
    min-height: 200px;
  }

  .cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 479px) {
  .home-page {
    padding-right: 1.25rem;
    padding-left: 1.25rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .card {
    padding: 1.25rem;
  }
}
</style>
