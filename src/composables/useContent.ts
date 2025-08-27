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
   * Фильтрует блоки, у которых есть menuName,
   * извлекает тип и menuName,
   * и добавляет "Home" в начало списка.
   */
  const menuItems = computed<MenuItem[]>(() => {
    // Самый первый элемент меню — это "Home"
    // Это нужно для того, чтобы всегда был доступ к главной странице
    const HOME_ITEM: MenuItem = { type: "app", menuName: "Home" };

    // Если контент ещё не загружен, возвращаем пустой массив
    if (!content.value) return [];

    // Поскольку на сайт можно будет помещать несколько отнотипных модулей,
    // то их как-то надо будет различать.
    // Вот и добавим счётчик в виде суффикса к типу блока.
    let counter: number = 0;

    const items = content.value.blocks.reduce(
      (acc, block) => {
        const hasValidMenuName =
          typeof (block as any).menuName === "string" &&
          (block as any).menuName.trim() !== "";

        if (hasValidMenuName) {
          acc.push({
            type: block.type + counter,
            menuName: (block as any).menuName,
          });
        }

        // Увеличиваем счетчик для КАЖДОГО элемента
        counter++;

        return acc;
      },
      [] as { type: string; menuName: string }[],
    );

    return [HOME_ITEM, ...items];
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
