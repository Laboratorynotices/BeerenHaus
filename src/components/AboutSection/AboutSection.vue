<script lang="ts" setup>
// Импортируем функцию для анимации при скролле
import { onMounted } from "vue";
import { useScrollAnimator } from "../../composables/useScrollAnimator";

import { type AboutBlock } from "../../types/content-schema";

// Определяем пропсы для компонента
defineProps({
  block: {
    type: Object as () => AboutBlock,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

// Используем анимацию при скролле
const { animate } = useScrollAnimator({
  origin: "top",
  distance: "60px",
  duration: 2000,
  delay: 300,
});

onMounted(() => {
  // Анимируем элементы
  animate(".about__data", { origin: "left" });
  animate(".about__images", { origin: "right" });
  animate(".about__img", { delay: 1000 });
  animate(".about__deco1", {
    pseudo: "before",
    delay: 1400,
    rotate: { z: 90 },
  });
  animate(".about__deco1", {
    pseudo: "after",
    delay: 1400,
    rotate: { z: -90 },
  });
});
</script>

<template>
  <section :id="id" class="about section" :aria-label="$t('About section')">
    <div class="wrap-container" role="none">
      <div class="about__data">
        <h2 class="section__title">{{ block.props.title }}</h2>
        <p class="about__description">{{ block.props.description }}</p>
        <a
          v-if="block.props.anchor && block.props.buttonTitle"
          :href="'#' + block.props.anchor"
          class="button"
          >{{ block.props.buttonTitle }}</a
        >
      </div>
      <div class="about__images shaped">
        <div class="about__deco1">
          <img
            src="/src/assets/imgs/about/rustic-basket.png"
            :alt="$t('A rustic basket full of berries')"
            role="none"
            class="about__img"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>
