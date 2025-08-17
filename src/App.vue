<script setup lang="ts">
import { watchEffect } from "vue";

// Работаем с локализацией
import { switchToNextLocale } from "./i18n";

// Импортируем функции для работы с контентом
import { useContent } from "./composables/useContent";
const { content, fetchContent } = useContent();

// watchEffect следит за изменением locale
// При смене локали автоматически перезагружает контент
watchEffect(async () => {
  await fetchContent();
});
</script>

<template>
  <div class="mock-up" id="header">Header</div>
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

  <!-- @TODO: Этот якорь удалить по окончании разработки -->
  <div id="tail">
    <p>{{ $t("hello") }}</p>
    <button @click="switchToNextLocale">Switch language</button>
  </div>
</template>
