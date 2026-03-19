<template>
  <section class="author-reward">
    <button
      type="button"
      class="author-reward__button"
      @click="openDialog"
    >
      {{ buttonText }}
    </button>

    <div
      v-if="isOpen"
      class="author-reward__overlay"
      @click.self="closeDialog"
    >
      <div
        class="author-reward__dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <button
          type="button"
          class="author-reward__close"
          aria-label="关闭打赏弹窗"
          @click="closeDialog"
        >
          ×
        </button>

        <p class="author-reward__eyebrow">THANKS FOR READING</p>
        <h3 class="author-reward__title">{{ title }}</h3>
        <p class="author-reward__description">{{ description }}</p>

        <img
          class="author-reward__image"
          :src="currentImageSrc"
          :alt="imageAlt"
          @error="handleImageError"
        >
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  buttonText: {
    type: String,
    default: "赞赏作者",
  },
  title: {
    type: String,
    default: "请作者喝杯咖啡",
  },
  description: {
    type: String,
    default: "如果这篇文章对你有帮助，欢迎扫码支持。",
  },
  imageSrc: {
    type: String,
    default: "/images/reward-qr.jpg",
  },
  imageAlt: {
    type: String,
    default: "赞赏二维码",
  },
});

const isOpen = ref(false);
const hasImageError = ref(false);
const fallbackRewardImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
  <rect width="320" height="320" rx="24" fill="#f4f4f5" />
  <rect x="44" y="44" width="232" height="232" rx="20" fill="#ffffff" stroke="#d4d4d8" stroke-width="6" stroke-dasharray="12 10" />
  <text x="160" y="146" text-anchor="middle" font-size="24" font-family="Arial, sans-serif" fill="#18181b">Reward QR</text>
  <text x="160" y="182" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="#71717a">Replace /images/reward-qr.png</text>
</svg>
`)}`;

const currentImageSrc = computed(() =>
  hasImageError.value ? fallbackRewardImage : props.imageSrc,
);

const openDialog = () => {
  isOpen.value = true;
};

const closeDialog = () => {
  isOpen.value = false;
};

const handleImageError = () => {
  hasImageError.value = true;
};

watch(
  () => props.imageSrc,
  () => {
    hasImageError.value = false;
  },
);
</script>

<style scoped lang="scss">
.author-reward {
  display: flex;
}

.author-reward__button {
  padding: 0.8rem 1.6rem;
  border: 1px solid var(--vp-c-accent-hover);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-accent-hover);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.author-reward__button:hover {
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.author-reward__overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.45);
}

.author-reward__dialog {
  position: relative;
  width: min(100%, 360px);
  padding: 2rem;
  border-radius: 24px;
  background: var(--vp-c-bg);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.2);
  text-align: center;
}

.author-reward__close {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text);
  font-size: 1.2rem;
  cursor: pointer;
}

.author-reward__eyebrow {
  margin: 0;
  color: var(--vp-c-text-mute);
  font-size: 0.75rem;
  letter-spacing: 0.18em;
}

.author-reward__title {
  margin: 0.75rem 0 0;
  font-size: 1.3rem;
}

.author-reward__description {
  margin: 0.75rem 0 1.25rem;
  color: var(--vp-c-text-mute);
  line-height: 1.7;
}

.author-reward__image {
  display: block;
  width: min(100%, 240px);
  margin: 0 auto;
  border-radius: 18px;
}

.author-reward__hint {
  margin: 1rem 0 0;
  color: var(--vp-c-text-mute);
  font-size: 0.85rem;
  line-height: 1.7;
}
</style>
