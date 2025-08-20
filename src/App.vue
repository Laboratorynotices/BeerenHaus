<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from "vue";

import AppHeader from "./components/AppHeader/AppHeader.vue";

// Работаем с локализацией
import { switchToNextLocale } from "./i18n";

// Импортируем функции для работы с контентом
import { useContent } from "./composables/useContent";
const { content, fetchContent } = useContent();

/*  Чтобы элементы не прятались в самом начале за меню,
    у следующего элемента добавляем расстояние.  */

/*
  Указатели на элементы
*/
const header = ref<{ root: HTMLElement | null } | null>(null);
const main = ref<HTMLElement | null>(null);

// Храним высоту header
const headerHeight = ref<number>(0);

/**
 * Получаем высоту header
 */
const getHeaderHeight = (): number => {
  if (!header.value) return 0;
  return (header.value.root?.offsetHeight as number) || 0;
};

/**
 * Обновляем отступы для main в зависимости от высоты header
 */
const updateMainMarginTop = (): void => {
  // Если нет ссылки на main или header, выходим
  if (!main.value || !header.value) return;

  // Получаем высоту header
  headerHeight.value = getHeaderHeight();

  // Устанавливаем отступ для main
  main.value.style.marginTop = `${headerHeight.value}px`;
};

/**
 * Добавляем тень к header при прокрутке
 */
const headerShadow = (): void => {
  // Если нет ссылки на header, выходим
  if (!header.value) return;

  // если прокрутка больше высоты header,
  if (window.scrollY > headerHeight.value) {
    // добавляем тень к header
    header.value.root?.classList.add("shadow");
  } else {
    // иначе убираем тень
    header.value.root?.classList.remove("shadow");
  }
};

onMounted(() => {
  // Первый расчёт
  updateMainMarginTop();

  // Подписка на resize
  window.addEventListener("resize", updateMainMarginTop);
  // Подписка на scroll
  window.addEventListener("scroll", headerShadow);
});

// Удаляем обработчики событий при размонтировании
onUnmounted(() => {
  window.removeEventListener("resize", updateMainMarginTop);
  window.removeEventListener("scroll", headerShadow);
});

// Следим за локалью и перезагружаем контент
watchEffect(async () => {
  await fetchContent();
});
</script>

<template>
  <AppHeader ref="header" id="header" />
  <main ref="main">
    <div
      v-for="(oneBlock, id) in content?.blocks"
      :key="id"
      class="mock-up"
      :id="oneBlock.type"
      role="region"
      :aria-label="`Block of type ${oneBlock.type}`"
      :aria-describedby="`desc-${id}`"
    >
      <p :id="`desc-${id}`">{{ oneBlock.type || JSON.stringify(oneBlock) }}</p>
      {{ oneBlock }}
    </div>
  </main>

  <!-- @TODO: Этот якорь удалить по окончании разработки -->
  <div id="tail">
    <p>{{ $t("hello") }}</p>
    <button @click="switchToNextLocale">Switch language</button>
  </div>
</template>
