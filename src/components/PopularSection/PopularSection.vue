<script lang="ts" setup>
import { watch, nextTick, onMounted } from "vue";
import { type PopularBlock } from "../../types/content-schema";
import PopularCard from "./PopularCard.vue";
// Импортируем "карусель"
import { useCarousel } from "../../composables/useCarousel";
// Импортируем функцию для анимации при скролле
import { useScrollAnimator } from "../../composables/useScrollAnimator";

// Определяем пропсы для компонента
const props = defineProps({
  block: {
    type: Object as () => PopularBlock,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

// Инициализируем нашу карусель
const { carouselRef, wrapperRef, isDragging, updateCarousel } = useCarousel();

// Обновляем карусель при изменении данных
watch(
  () => props.block.props.products,
  () => {
    nextTick(() => {
      updateCarousel();
    });
  },
  { deep: true },
);

// Используем анимацию при скролле
const { animate } = useScrollAnimator({
  origin: "top",
  distance: "60px",
  duration: 2000,
  delay: 300,
});

onMounted(() => {
  // Анимируем элемент
  animate(".popular__swiper");
});
</script>

<template>
  <section :id="id" class="popular section" :aria-label="$t('Popular section')">
    <div class="wrap-container" role="none">
      <h2 class="section__title">{{ block.props.title }}</h2>
      <div
        ref="carouselRef"
        class="popular__swiper swiper"
        :class="{ 'is-dragging': isDragging }"
      >
        <div class="swiper-wrapper" ref="wrapperRef">
          <PopularCard
            v-for="(product, index) in block.props.products"
            :key="index"
            :product="product"
            :anchor="block.props.anchor ? block.props.anchor : ''"
            class="popular__slide"
          />
        </div>
      </div>
    </div>
  </section>
</template>
