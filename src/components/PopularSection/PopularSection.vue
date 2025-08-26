<script lang="ts" setup>
import { type PopularBlock } from "../../types/content-schema";
import PopularCard from "./PopularCard.vue";

// Определяем пропсы для компонента
defineProps({
  block: {
    type: Object as () => PopularBlock,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <section :id="id" class="popular section" :aria-label="$t('Popular section')">
    <div class="wrap-container" role="none">
      <h2 class="section__title">{{ block.props.title }}</h2>
      <div class="popular__swiper swiper">
        <div class="swiper-wrapper">
          <PopularCard
            v-for="(product, index) in block.props.products"
            :key="index"
            :product="product"
            :anchor="block.props.anchor ? block.props.anchor : ''"
          />
        </div>
      </div>
    </div>
  </section>
</template>
