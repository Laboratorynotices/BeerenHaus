<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";

import AppHeader from "./components/AppHeader/AppHeader.vue";

// Работаем с локализацией
import { switchToNextLocale } from "./i18n";

// Импортируем функции для работы с контентом
import { useContent } from "./composables/useContent";
const { content, fetchContent } = useContent();

/*  Чтобы элементы не прятались в самом начале за меню,
    у следующего элемента добавляем расстояние.  */
// Храним высоту header
const headerHeight = ref<number>(0);

onMounted(() => {
  // Находим элемент с id="header"
  const header = document.getElementById("header");

  if (header) {
    // Получаем высоту header
    headerHeight.value = header.offsetHeight;

    // Находим следующий сестринский элемент
    const nextSibling = header.nextElementSibling as HTMLElement;

    if (nextSibling) {
      // Устанавливаем margin-top равный высоте header
      nextSibling.style.marginTop = `${headerHeight.value}px`;
    }
  }
});

// watchEffect следит за изменением locale
// При смене локали автоматически перезагружает контент
watchEffect(async () => {
  await fetchContent();
});
</script>

<template>
  <AppHeader id="header" />
  <main>
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
