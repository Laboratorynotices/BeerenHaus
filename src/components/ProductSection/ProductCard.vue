<script setup lang="ts">
import ShoppingIcon from "./ShoppingIcon.vue";

import { type RequestedProduct } from "../../types/content-schema";
import { useNumberToPrice } from "../../composables/useNumberToPrice";
const { numberToPrice } = useNumberToPrice();

// Определяем пропсы
defineProps<{
  product: RequestedProduct;
}>();

// Загружаем все картинки из папки (как блобы/модули)
const images = import.meta.glob("../../assets/imgs/products/*.png", {
  eager: true,
  import: "default",
});

// Функция для получения ссылки по имени файла
const getImage = (filename: string) => {
  // в images ключи будут с полным путем, поэтому ищем совпадение по basename
  const entry = Object.entries(images).find(([path]) =>
    path.endsWith(filename),
  );
  return entry ? (entry[1] as string) : "";
};
</script>

<template>
  <article class="product__card" :aria-label="product.name">
    <div class="product__images shaped">
      <div class="product__deco1">
        <img
          :src="getImage(product.imageName)"
          :alt="$t('cap with') + ' ' + product.name"
          role="none"
          class="product__img"
          loading="lazy"
        />
      </div>
    </div>
    <div class="product__data">
      <h2 class="product__name">{{ product.name }}</h2>
      <span class="products__price">€{{ numberToPrice(product.price) }}</span>
      <a @click.self.prevent class="products__button" role="none">
        <ShoppingIcon role="none" />
      </a>
    </div>
  </article>
</template>
