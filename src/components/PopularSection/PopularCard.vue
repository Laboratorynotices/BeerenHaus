<script setup lang="ts">
import { type PopularProduct } from "../../types/content-schema";
import { useNumberToPrice } from "../../composables/useNumberToPrice";
const { numberToPrice } = useNumberToPrice();

// Определяем пропсы
defineProps<{
  product: PopularProduct;
  anchor: string;
}>();

// Загружаем все картинки из папки (как блобы/модули)
const images = import.meta.glob("../../assets/imgs/popular/*.png", {
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
  <article class="popular__card swiper-slide" :aria-label="product.name">
    <div class="popular__images shaped">
      <div class="deco1">
        <img
          :src="getImage(product.image)"
          :alt="$t('cap with') + ' ' + product.name"
          role="none"
          class="popular__img"
          loading="lazy"
        />
      </div>
    </div>
    <div class="popular__data">
      <h2 class="popular__name">{{ product.name }}</h2>
      <p class="popular__description">
        {{ product.description }}
      </p>
      <a :href="'#' + anchor" class="button"
        >{{ $t("Order now") }}: €{{ numberToPrice(product.price) }}</a
      >
    </div>
  </article>
</template>
