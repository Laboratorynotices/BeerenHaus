<script setup lang="ts">
import { ref, watchEffect } from "vue";

// Работаем с локализацией
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
import { switchLocale, DEFAULT_LOCALE } from "./i18n";

// Импортируем схему контента
import { ContentFileSchema, type ContentFile } from "./types/content-schema";

// Ref для хранения контента. Будет null, пока данные не загружены или при ошибке
const content = ref<ContentFile | null>(null);

/**
 * Асинхронная функция для загрузки контента по локали.
 * Если загрузка или проверка схемы не удалась, пытается загрузить DEFAULT_LOCALE.
 *
 * @param loc - код локали (например, 'en', 'ru', 'de')
 * @returns ContentFile | null
 */
async function loadContent(loc: string): Promise<ContentFile | null> {
  try {
    // Динамически импортируем JSON-файл с контентом
    const module = await import(`./content/${loc}.json`);

    // Проверяем структуру данных через Zod
    const parsed = ContentFileSchema.safeParse(module.default);

    if (!parsed.success) {
      console.error(`Invalid content for ${loc}:`, parsed.error.format());

      // Если мы еще не пробовали DEFAULT_LOCALE — пробуем его
      if (loc !== DEFAULT_LOCALE) {
        return loadContent(DEFAULT_LOCALE);
      }

      // Если DEFAULT_LOCALE уже проверен — возвращаем null
      return null;
    }

    // Контент валиден — возвращаем его
    return parsed.data;
  } catch (err) {
    console.error(`Failed to load content for ${loc}:`, err);

    // Если локаль не DEFAULT_LOCALE — пробуем DEFAULT_LOCALE
    if (loc !== DEFAULT_LOCALE) {
      return loadContent(DEFAULT_LOCALE);
    }

    // Если DEFAULT_LOCALE тоже недоступен — возвращаем null
    return null;
  }
}

// watchEffect следит за изменением locale
// При смене локали автоматически перезагружает контент
watchEffect(async () => {
  content.value = await loadContent(locale.value);
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

  <div id="tail">
    <p>{{ $t("hello") }}</p>
    <button @click="switchLocale">Switch language</button>
  </div>
</template>
