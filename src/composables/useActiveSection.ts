import { ref, nextTick } from "vue";

/**
 * Компосабл для отслеживания активной секции на странице
 * Реализован как singleton с автоматическим отслеживанием изменений DOM
 */

// Глобальное состояние (singleton)
const activeSection = ref<string>("");
const observedSections = new Set<string>();
let intersectionObserver: IntersectionObserver | null = null;
let mutationObserver: MutationObserver | null = null;
const sectionVisibility = new Map<string, number>();
let intervalId: number | null = null;

export function useActiveSection() {
  /**
   * Создаем Intersection Observer
   */
  const createIntersectionObserver = () => {
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;

          if (entry.isIntersecting) {
            // Сохраняем процент видимости секции
            sectionVisibility.set(sectionId, entry.intersectionRatio);
          } else {
            // Удаляем секцию из видимых
            sectionVisibility.delete(sectionId);
          }
        });

        // Определяем наиболее видимую секцию
        updateActiveSection();
      },
      {
        // Корень наблюдения - viewport
        root: null,
        // Отступы от границ viewport
        rootMargin: "-20% 0px -20% 0px",
        // Пороги срабатывания (0% - 100% с шагом 10%)
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      },
    );
  };

  /**
   * Создаем MutationObserver для отслеживания изменений в DOM
   */
  const createMutationObserver = () => {
    if (mutationObserver) {
      mutationObserver.disconnect();
    }

    mutationObserver = new MutationObserver((mutations) => {
      let shouldReinitialize = false;

      mutations.forEach((mutation) => {
        // Проверяем добавленные узлы
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Если добавлен элемент с ID или содержит элементы с ID
            if (element.id || element.querySelectorAll("[id]").length > 0) {
              shouldReinitialize = true;
            }
          }
        });

        // Проверяем удаленные узлы
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.id || element.querySelectorAll("[id]").length > 0) {
              shouldReinitialize = true;
            }
          }
        });
      });

      if (shouldReinitialize) {
        // Небольшая задержка, чтобы DOM успел обновиться
        setTimeout(() => {
          reinitializeObserver();
        }, 100);
      }
    });

    // Начинаем наблюдение за main элементом
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mutationObserver.observe(mainElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["id"],
      });
    }
  };

  /**
   * Переинициализация observer'ов после изменений DOM
   */
  const reinitializeObserver = () => {
    // Очищаем текущие наблюдения
    if (intersectionObserver) {
      intersectionObserver.disconnect();
    }

    observedSections.clear();
    sectionVisibility.clear();

    // Создаем новый IntersectionObserver
    createIntersectionObserver();

    // Ищем и регистрируем все секции заново
    nextTick(() => {
      autoObserveSections();
    });
  };

  /**
   * Обновляем активную секцию на основе видимости
   */
  const updateActiveSection = () => {
    if (sectionVisibility.size === 0) return;

    // Находим секцию с наибольшим процентом видимости
    let maxVisibility = 0;
    let mostVisibleSection = "";

    sectionVisibility.forEach((visibility, sectionId) => {
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleSection = sectionId;
      }
    });

    // Если есть наиболее видимая секция, делаем её активной
    if (mostVisibleSection && mostVisibleSection !== activeSection.value) {
      activeSection.value = mostVisibleSection;
    }
  };

  /**
   * Добавляем секцию для наблюдения
   */
  const observeSection = (sectionId: string) => {
    if (!intersectionObserver) {
      createIntersectionObserver();
    }

    if (observedSections.has(sectionId)) {
      return;
    }

    // Ждем следующий тик, чтобы элемент точно был в DOM
    nextTick(() => {
      const element = document.getElementById(sectionId);

      if (element) {
        intersectionObserver!.observe(element);
        observedSections.add(sectionId);

        // Если это первая секция и нет активной, делаем её активной
        if (observedSections.size === 1 && !activeSection.value) {
          activeSection.value = sectionId;
        }
      }
    });
  };

  /**
   * Удаляем секцию из наблюдения
   */
  const unobserveSection = (sectionId: string) => {
    if (!intersectionObserver || !observedSections.has(sectionId)) return;

    const element = document.getElementById(sectionId);
    if (element) {
      intersectionObserver.unobserve(element);
      observedSections.delete(sectionId);
      sectionVisibility.delete(sectionId);
    }
  };

  /**
   * Автоматически находим и наблюдаем за всеми секциями
   */
  const autoObserveSections = () => {
    // Ждем, пока компоненты загрузятся
    nextTick(() => {
      // Находим все элементы main > * с id
      const mainElement = document.querySelector("main");

      if (!mainElement) return;

      const sections = mainElement.querySelectorAll("[id]");
      let newSectionsFound = 0;

      sections.forEach((section) => {
        if (section.id && !observedSections.has(section.id)) {
          observeSection(section.id);
          newSectionsFound++;
        }
      });
    });
  };

  /**
   * Ожидаем загрузки всех секций по их типам
   */
  const waitForSections = (expectedSections: string[]) => {
    return new Promise<void>((resolve) => {
      const checkSections = () => {
        const foundSections = expectedSections.filter((sectionType) => {
          const element = document.getElementById(sectionType);
          return element !== null;
        });

        if (foundSections.length === expectedSections.length) {
          // Все секции найдены, регистрируем их
          foundSections.forEach((sectionType) => {
            if (!observedSections.has(sectionType)) {
              observeSection(sectionType);
            }
          });
          resolve();
        } else {
          // Продолжаем ожидание
          setTimeout(checkSections, 200);
        }
      };

      checkSections();
    });
  };

  /**
   * Инициализация всей системы наблюдения
   */
  const startAutoObserving = (expectedSections?: string[]) => {
    // Создаем observer'ы, если их еще нет
    if (!intersectionObserver) {
      createIntersectionObserver();
    }

    if (!mutationObserver) {
      createMutationObserver();
    }

    // Если переданы ожидаемые секции, ждем их загрузки
    if (expectedSections && expectedSections.length > 0) {
      waitForSections(expectedSections).then(() => {
        // Устанавливаем первую секцию как активную, если нет активной
        if (!activeSection.value && expectedSections.length > 0) {
          activeSection.value = expectedSections[0];
        }
      });
    }

    // Сразу пытаемся найти секции
    autoObserveSections();

    // Останавливаем предыдущий интервал если есть
    if (intervalId !== null) {
      clearInterval(intervalId);
    }

    // Повторяем каждые 500ms в течение первых 10 секунд
    let attempts = 0;
    const maxAttempts = 20;

    intervalId = window.setInterval(() => {
      autoObserveSections();
      attempts++;

      if (attempts >= maxAttempts) {
        stopAutoObserving();
      }
    }, 500);
  };

  const stopAutoObserving = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  /**
   * Проверяем, является ли секция активной
   */
  const isActive = (sectionId: string): boolean => {
    return activeSection.value === sectionId;
  };

  /**
   * Скроллим к секции
   */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Получаем высоту header для правильного offset
      const header = document.getElementById("header");
      const headerHeight = header?.offsetHeight || 0;

      const elementTop = element.offsetTop - headerHeight - 20; // 20px дополнительный отступ

      window.scrollTo({
        top: elementTop,
        behavior: "smooth",
      });
    }
  };

  /**
   * Принудительное обновление отслеживания (для вызова после смены языка)
   */
  const forceUpdate = () => {
    reinitializeObserver();
  };

  /**
   * Очистка ресурсов
   */
  const cleanup = () => {
    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }

    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }

    stopAutoObserving();
    observedSections.clear();
    sectionVisibility.clear();
    // Сбрасываем активную секцию
    activeSection.value = "";
  };

  return {
    activeSection,
    observeSection,
    unobserveSection,
    isActive,
    scrollToSection,
    autoObserveSections,
    startAutoObserving,
    stopAutoObserving,
    forceUpdate,
    cleanup,
  };
}
