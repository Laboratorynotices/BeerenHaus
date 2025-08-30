<script lang="ts" setup>
import { onMounted } from "vue";
import { type ProductsBlock } from "../../types/content-schema";
import ProductCard from "./ProductCard.vue";
// Импортируем функцию для анимации при скролле
import { useScrollAnimator } from "../../composables/useScrollAnimator";

// Определяем пропсы для компонента
defineProps({
  block: {
    type: Object as () => ProductsBlock,
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
  // Анимируем элемент
  animate(".popular__swiper");
});
</script>

<template>
  <section :id="id" class="product section" :aria-label="$t('Product section')">
    <div class="wrap-container" role="none">
      <h2 class="section__title">{{ block.props.title }}</h2>
      <div class="product__container">
        <ProductCard
          v-for="(product, index) in block.props.products"
          :key="index"
          :product="product"
        />
      </div>
    </div>
  </section>
</template>
