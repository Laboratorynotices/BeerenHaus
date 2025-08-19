import { computed, ref } from "vue";
import { ContentFileSchema, type ContentFile } from "../types/content-schema";

// Работаем с локализацией
import { DEFAULT_LOCALE, type AvailableLocale } from "../i18n";
import { useI18n } from "vue-i18n";

import type { MenuItem } from "../types/menu-item";

// Храним загруженный контент
const content = ref<ContentFile | null>(null);

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

  /**
   * Загружает контент для переданной локали
   */
  const fetchContent = async (): Promise<void> => {
    content.value = await loadContent(locale.value as AvailableLocale);
  };

  /**
   * Получает список блоков с их именами для меню
   * Фильтрует блоки, у которых есть menuName
   */
  const menuItems = computed<MenuItem[]>(() => {
    // Если контент ещё не загружен, возвращаем пустой массив
    if (!content.value) return [];
    return (
      content.value.blocks
        // Фильтруем блоки, у которых есть menuName
        .filter(
          (block): block is typeof block & { menuName: string } =>
            typeof (block as any).menuName === "string" &&
            (block as any).menuName.trim() !== "",
        )
        // Извлекаем тип и menuName
        .map((block) => ({
          type: block.type,
          menuName: (block as any).menuName,
        }))
    );
  });

  /**
   * @deprecated Use menuItems instead.
   */
  const getBlocsMenuItems = () => {
    console.warn('"getBlocsMenuItems" is deprecated, use "menuItems" instead.');
    return menuItems;
  };

  return {
    content,
    fetchContent,
    menuItems,
    getBlocsMenuItems,
  };
};
