<script lang="ts" setup>
import { type HeroBlock } from "../../types/content-schema";

// Импортируем функцию для анимации при скролле
import { useScrollAnimator } from "../../composables/useScrollAnimator";
import { onMounted } from "vue";

// Определяем пропсы для компонента
defineProps({
  block: {
    type: Object as () => HeroBlock,
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
  animate(".hero__images", { pseudo: "before", origin: "bottom" });
  animate(".hero__image", { delay: 1000, distance: "200px", duration: 1500 });
  animate(".deco1", {
    pseudo: "before",
    delay: 1600,
    duration: 1500,
  });
  animate(".deco2", {
    pseudo: "before",
    delay: 2200,
    duration: 1500,
    rotate: { z: 180 },
  });
  animate(".deco2", {
    pseudo: "after",
    delay: 2200,
    duration: 1500,
    rotate: { z: 180 },
  });
  animate(".deco3", {
    pseudo: "before",
    delay: 2600,
    duration: 1500,
    rotate: { z: 180 },
  });
  animate(".deco3", {
    pseudo: "after",
    delay: 2600,
    duration: 1500,
    rotate: { z: 180 },
  });
  animate(".deco1", {
    pseudo: "after",
    delay: 2800,
    duration: 1500,
    rotate: { z: 90 },
  });
  animate(".hero__title", { delay: 3500 });
  animate(".hero__data", { delay: 4000 });
  animate(".hero__images", { pseudo: "after", delay: 4000 });
});
</script>

<template>
  <section
    :id="id"
    class="hero section"
    :aria-label="$t('Hero section: Fresh berries')"
  >
    <div class="wrap-container" role="none">
      <h1 class="hero__title">{{ block.props.title }}</h1>
      <div class="hero__images shaped">
        <div class="deco1">
          <div class="deco2">
            <div class="deco3">
              <img
                src="../../assets/imgs/hero/hero-image.png"
                :alt="$t('Cup with berries')"
                class="hero__image"
                loading="lazy"
                role="none"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="hero__data">
        <p class="hero__description">{{ block.props.description }}</p>
        <a :href="'#' + block.props.anchor" class="button">{{
          $t("Learn More")
        }}</a>
      </div>
    </div>
  </section>
</template>
