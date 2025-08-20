import { ref, onMounted, onUnmounted, readonly } from "vue";

/**
 * Композабл, который возвращает текущую ширину окна браузера в rem
 * @returns объект с шириной окна в rem и базовым размером шрифта в виде реактивных ссылок
 */
export function useWindowInnerWidthRem() {
  // Значение по умолчанию для базового размера шрифта.
  // Задаём значение по умолчанию, чтобы избежать ошибок,
  // если браузер не поддерживает getComputedStyle (деление на 0)
  const DEFAULT_ROOT_FONT_SIZE: number = 16 as const;

  // Реактивные значения
  // windowWidthRem - ширина окна в rem
  const windowWidthRem = ref(0);
  // rootFontSize - базовый размер шрифта в пикселях
  const rootFontSize = ref(DEFAULT_ROOT_FONT_SIZE);

  // Функция для получения актуального базового размера шрифта из браузера
  const getRootFontSize = (): number => {
    return (
      parseFloat(getComputedStyle(document.documentElement).fontSize) ||
      DEFAULT_ROOT_FONT_SIZE
    );
  };

  // Функция для конвертации пикселей в rem
  const pxToRem = (px: number): number => px / rootFontSize.value;

  // Функция для обновления значений
  const updateValues = () => {
    rootFontSize.value = getRootFontSize();
    windowWidthRem.value = pxToRem(window.innerWidth);
  };

  // Инициализируем значения даже до монтирования с проверкой на SSR
  if (typeof window !== "undefined") {
    updateValues();
  }

  // Устанавливаем начальные значения при монтировании компонента
  onMounted(() => {
    updateValues();
    window.addEventListener("resize", updateValues);
  });

  // Удаляем слушатель событий при размонтировании компонента
  onUnmounted(() => {
    window.removeEventListener("resize", updateValues);
  });

  // Возвращаем объект с реактивными свойствами (не деструктурированные)
  return {
    windowWidthRem: readonly(windowWidthRem),
    rootFontSize: readonly(rootFontSize),
  };
}
