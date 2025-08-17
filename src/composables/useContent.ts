import { ref } from "vue";
import { ContentFileSchema, type ContentFile } from "../types/content-schema";

// Работаем с локализацией
import { DEFAULT_LOCALE, type AvailableLocale } from "../i18n";
import { useI18n } from "vue-i18n";

/**
 * Асинхронная функция для загрузки контента по локали.
 * Если загрузка или проверка схемы не удалась, пытается загрузить DEFAULT_LOCALE.
 *
 * @param loc - код локали (AvailableLocale)
 * @returns ContentFile | null
 */
const loadContent = async (
  loc: AvailableLocale,
): Promise<ContentFile | null> => {
  try {
    // Динамически импортируем JSON-файл с контентом
    const module = await import(`../content/${loc}.json`);

    // Проверяем структуру данных через Zod
    const parsed = ContentFileSchema.safeParse(module.default);

    if (!parsed.success) {
      console.error(`Invalid content for ${loc}:`, parsed.error);

      // Если мы ещё не пробовали DEFAULT_LOCALE — пробуем его
      if (loc !== DEFAULT_LOCALE) {
        return loadContent(DEFAULT_LOCALE);
      }

      return null;
    }

    return parsed.data;
  } catch (err) {
    console.error(`Failed to load content for ${loc}:`, err);

    if (loc !== DEFAULT_LOCALE) {
      return loadContent(DEFAULT_LOCALE);
    }

    return null;
  }
};

export const useContent = () => {
  const { locale } = useI18n();
  const content = ref<ContentFile | null>(null);

  /**
   * Загружает контент для переданной локали
   */
  const fetchContent = async (): Promise<void> => {
    content.value = await loadContent(locale.value as AvailableLocale);
  };

  return {
    content,
    fetchContent,
  };
};
