<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  ref,
  watchEffect,
} from "vue";

// Импортируем шапку приложения
import AppHeader from "./components/AppHeader/AppHeader.vue";

// Работаем с локализацией
import { switchToNextLocale, getSavedLocale } from "./i18n";

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

// Карта асинхронных компонентов
// Здесь можно добавить динамическую загрузку компонентов по типу блока
const componentsMap: Record<string, () => Promise<any>> = {
  hero: () => import("./components/HeroSection/HeroSection.vue"),
  popular: () => import("./components/PopularSection/PopularSection.vue"),
  about: () => import("./components/AboutSection/AboutSection.vue"),
  products: () => import("./components/ProductSection/ProductSection.vue"),
  // Добавьте другие компоненты по мере необходимости
};

// Добавляем компонент по умолчанию
const fallback = () => import("./components/Fallback.vue");

// Добавляем компоненты по типам блоков
const asyncComponents = computed(() => {
  if (!content.value?.blocks) return [];

  return content.value.blocks.map((block, index) => ({
    id: `${block.type}-${index}`, // уникальный ключ
    type: block.type,
    menuName: "menuName" in block ? block.menuName : undefined,
    props: "props" in block ? block.props : undefined,
    component: defineAsyncComponent(componentsMap[block.type] ?? fallback),
  }));
});

onMounted(() => {
  // Первый расчёт
  updateMainMarginTop();

  // Подписка на resize
  window.addEventListener("resize", updateMainMarginTop);
  // Подписка на scroll
  window.addEventListener("scroll", headerShadow);

  // Устанавливаем атрибут lang на элементе <html> для корректной семантики
  document.documentElement.lang = getSavedLocale();
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
    <component
      v-for="(block, id) in asyncComponents"
      :key="id"
      :block="block"
      :is="block.component"
      :id="block.type + id"
    />
  </main>

  <!-- @TODO: Этот якорь удалить по окончании разработки -->
  <div id="tail">
    <p>{{ $t("hello") }}</p>
    <button @click="switchToNextLocale">Switch language</button>
  </div>
</template>
