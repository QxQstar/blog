<template>
  <section class="contact-author">
    <button
      type="button"
      class="contact-author__button"
      @click="openDialog"
    >
      {{ buttonText }}
    </button>

    <div
      v-if="isOpen"
      class="contact-author__overlay"
      @click.self="closeDialog"
    >
      <div
        class="contact-author__dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <button
          type="button"
          class="contact-author__close"
          aria-label="关闭联系作者弹窗"
          @click="closeDialog"
        >
          ×
        </button>

        <p class="contact-author__eyebrow">GET IN TOUCH</p>
        <h3 class="contact-author__title">{{ title }}</h3>
        <p class="contact-author__description">{{ description }}</p>

        <img
          class="contact-author__image"
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
    default: "联系作者",
  },
  title: {
    type: String,
    default: "联系作者",
  },
  description: {
    type: String,
    default: "欢迎扫码联系，备注来意。",
  },
  imageSrc: {
    type: String,
    default: "/images/contact-qr.jpg",
  },
  imageAlt: {
    type: String,
    default: "联系作者二维码",
  },
});

const isOpen = ref(false);
const hasImageError = ref(false);
const fallbackContactImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
  <rect width="320" height="320" rx="24" fill="#f4f4f5" />
  <rect x="44" y="44" width="232" height="232" rx="20" fill="#ffffff" stroke="#d4d4d8" stroke-width="6" stroke-dasharray="12 10" />
  <text x="160" y="146" text-anchor="middle" font-size="24" font-family="Arial, sans-serif" fill="#18181b">Contact QR</text>
  <text x="160" y="182" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="#71717a">Replace /images/contact-qr.jpg</text>
</svg>
`)}`;

const currentImageSrc = computed(() =>
  hasImageError.value ? fallbackContactImage : props.imageSrc,
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
.contact-author {
  display: flex;
}

.contact-author__button {
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

.contact-author__button:hover {
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.contact-author__overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.45);
}

.contact-author__dialog {
  position: relative;
  width: min(100%, 360px);
  padding: 2rem;
  border-radius: 24px;
  background: var(--vp-c-bg);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.2);
  text-align: center;
}

.contact-author__close {
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

.contact-author__eyebrow {
  margin: 0;
  color: var(--vp-c-text-mute);
  font-size: 0.75rem;
  letter-spacing: 0.18em;
}

.contact-author__title {
  margin: 0.75rem 0 0;
  font-size: 1.3rem;
}

.contact-author__description {
  margin: 0.75rem 0 1.25rem;
  color: var(--vp-c-text-mute);
  line-height: 1.7;
}

.contact-author__image {
  display: block;
  width: min(100%, 240px);
  margin: 0 auto;
  border-radius: 18px;
}
</style>
