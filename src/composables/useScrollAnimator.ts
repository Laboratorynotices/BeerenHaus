import { onUnmounted } from "vue";

type AnimationOptions = {
  origin?: "top" | "right" | "bottom" | "left"; // Направление появления
  distance?: string; // Смещение при появлении
  duration?: number; // Длительность анимации
  delay?: number; // Задержка старта
  reset?: boolean; // Нужно ли скрывать при уходе из видимости
  pseudo?: "before" | "after" | null; // Анимация псевдоэлемента (::before/::after)
  scale?: number; // Масштаб
  rotate?: { x?: number; y?: number; z?: number }; // Поворот по осям
};

// Настройки по умолчанию
const defaultOptions = {
  origin: "bottom" as const,
  distance: "60px",
  duration: 2000,
  delay: 300,
  reset: false,
  scale: 1,
  rotate: { x: 0, y: 0, z: 0 },
};

// Тип с финальными (разрешёнными) опциями
type ResolvedOptions = {
  origin: "top" | "right" | "bottom" | "left";
  distance: string;
  duration: number;
  delay: number;
  reset: boolean;
  pseudo: "before" | "after" | null;
  scale: number;
  rotate: { x: number; y: number; z: number };
};

// Ключ для карты настроек (разделяет элемент и его псевдоэлементы)
type ElementKey = string; // "element" | "element-before" | "element-after"

// Формирует transform для скрытого состояния элемента
function getHiddenTransform(
  origin: ResolvedOptions["origin"],
  distance: string,
  scale: number,
  rotate: ResolvedOptions["rotate"],
): string {
  let translate = "";
  switch (origin) {
    case "top":
      translate = `translateY(-${distance})`;
      break;
    case "bottom":
      translate = `translateY(${distance})`;
      break;
    case "left":
      translate = `translateX(-${distance})`;
      break;
    case "right":
      translate = `translateX(${distance})`;
      break;
    default:
      translate = `translateY(${distance})`;
  }

  // Добавляем повороты
  const rotateStr = `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg)`;
  return `${translate} scale(${scale}) ${rotateStr}`;
}

const STYLE_TAG_ID = "scroll-animator-pseudo-styles";
let stylesInjected = false;

// Добавляет стили для ::before и ::after, если их ещё нет
function injectPseudoStylesSafely(): void {
  if (typeof document === "undefined") return;
  if (stylesInjected) return;
  if (document.getElementById(STYLE_TAG_ID)) {
    stylesInjected = true;
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = `
    [data-animate-before]::before {
      content: "";
      opacity: var(--before-opacity, 0);
      transform: var(--before-transform, translateY(60px) scale(1));
      transition:
        opacity var(--before-duration, 2000ms) ease var(--before-delay, 300ms),
        transform var(--before-duration, 2000ms) ease var(--before-delay, 300ms);
      will-change: opacity, transform;
    }

    [data-animate-after]::after {
      content: "";
      opacity: var(--after-opacity, 0);
      transform: var(--after-transform, translateY(60px) scale(1));
      transition:
        opacity var(--after-duration, 2000ms) ease var(--after-delay, 300ms),
        transform var(--after-duration, 2000ms) ease var(--after-delay, 300ms);
      will-change: opacity, transform;
    }
  `;
  document.head.appendChild(style);
  stylesInjected = true;
}

// Готовит элемент к скрытому состоянию (начало анимации)
function prepareHiddenState(el: HTMLElement, opts: ResolvedOptions): void {
  if (opts.pseudo) {
    // Для псевдоэлементов
    if (opts.pseudo === "before")
      el.setAttribute("data-animate-before", "true");
    if (opts.pseudo === "after") el.setAttribute("data-animate-after", "true");

    el.style.setProperty(`--${opts.pseudo}-opacity`, "0");
    el.style.setProperty(
      `--${opts.pseudo}-transform`,
      getHiddenTransform(opts.origin, opts.distance, opts.scale, opts.rotate),
    );
    el.style.setProperty(`--${opts.pseudo}-duration`, `${opts.duration}ms`);
    el.style.setProperty(`--${opts.pseudo}-delay`, `${opts.delay}ms`);
  } else {
    // Для самого элемента
    el.style.opacity = "0";
    el.style.transform = getHiddenTransform(
      opts.origin,
      opts.distance,
      opts.scale,
      opts.rotate,
    );
    el.style.willChange = "opacity, transform";
  }
}

// Запускает анимацию появления
function reveal(el: HTMLElement, opts: ResolvedOptions): void {
  if (opts.pseudo) {
    el.style.setProperty(`--${opts.pseudo}-opacity`, "1");
    el.style.setProperty(
      `--${opts.pseudo}-transform`,
      "translate(0,0) scale(1) rotateX(0) rotateY(0) rotateZ(0)",
    );
    el.style.setProperty(`--${opts.pseudo}-duration`, `${opts.duration}ms`);
    el.style.setProperty(`--${opts.pseudo}-delay`, `${opts.delay}ms`);
  } else {
    el.style.transition = `opacity ${opts.duration}ms ease ${opts.delay}ms, transform ${opts.duration}ms ease ${opts.delay}ms`;
    el.style.opacity = "1";
    el.style.transform =
      "translate(0,0) scale(1) rotateX(0) rotateY(0) rotateZ(0)";
  }
}

// Сбрасывает элемент обратно в скрытое состояние
function reset(el: HTMLElement, opts: ResolvedOptions): void {
  if (opts.pseudo) {
    el.style.setProperty(`--${opts.pseudo}-opacity`, "0");
    el.style.setProperty(
      `--${opts.pseudo}-transform`,
      getHiddenTransform(opts.origin, opts.distance, opts.scale, opts.rotate),
    );
  } else {
    el.style.opacity = "0";
    el.style.transform = getHiddenTransform(
      opts.origin,
      opts.distance,
      opts.scale,
      opts.rotate,
    );
  }
}

// Основной хук для Vue
export function useScrollAnimator(globalOptions: AnimationOptions = {}) {
  // Базовые настройки (с учётом глобальных и дефолтных)
  const base: ResolvedOptions = {
    origin: globalOptions.origin ?? defaultOptions.origin,
    distance: globalOptions.distance ?? defaultOptions.distance,
    duration: globalOptions.duration ?? defaultOptions.duration,
    delay: globalOptions.delay ?? defaultOptions.delay,
    reset: globalOptions.reset ?? defaultOptions.reset,
    pseudo: globalOptions.pseudo ?? null,
    scale: globalOptions.scale ?? defaultOptions.scale,
    rotate: {
      x:
        globalOptions.rotate?.x !== undefined
          ? globalOptions.rotate.x
          : defaultOptions.rotate.x,
      y:
        globalOptions.rotate?.y !== undefined
          ? globalOptions.rotate.y
          : defaultOptions.rotate.y,
      z:
        globalOptions.rotate?.z !== undefined
          ? globalOptions.rotate.z
          : defaultOptions.rotate.z,
    },
  };

  let observer: IntersectionObserver | null = null;

  // Храним настройки для элементов и их псевдоэлементов
  const elementOptions = new Map<
    HTMLElement,
    Map<ElementKey, ResolvedOptions>
  >();

  // Определяет ключ карты для конкретного случая
  function getElementKey(pseudo: ResolvedOptions["pseudo"]): ElementKey {
    if (pseudo === "before") return "element-before";
    if (pseudo === "after") return "element-after";
    return "element";
  }

  // Запускает анимацию для элементов по селектору
  function animate(
    selector: string,
    customOptions: AnimationOptions = {},
  ): void {
    if (typeof document === "undefined") return;

    const nodeList = document.querySelectorAll<HTMLElement>(selector);
    if (!nodeList.length) return;

    injectPseudoStylesSafely();

    // Создаём IntersectionObserver, если ещё не создан
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            const optionsMap = elementOptions.get(el);
            if (!optionsMap) return;

            // Обрабатываем все настройки для данного элемента
            optionsMap.forEach((opts, key) => {
              if (entry.isIntersecting) {
                // Появился в зоне видимости → показать
                requestAnimationFrame(() => reveal(el, opts));

                if (!opts.reset) {
                  // Если анимация одноразовая → удаляем её
                  optionsMap.delete(key);
                  if (optionsMap.size === 0) {
                    observer?.unobserve(el);
                    elementOptions.delete(el);
                  }
                }
              } else if (opts.reset) {
                // Если включён reset → скрываем обратно
                reset(el, opts);
              }
            });
          });
        },
        {
          threshold: 0.1, // Считаем "видимым", если 10% элемента в зоне
        },
      );
    }

    nodeList.forEach((el) => {
      // Финальные опции (учёт глобальных, локальных и дефолтных)
      const resolved: ResolvedOptions = {
        origin: customOptions.origin ?? base.origin,
        distance: customOptions.distance ?? base.distance,
        duration: customOptions.duration ?? base.duration,
        delay: customOptions.delay ?? base.delay,
        reset: customOptions.reset ?? base.reset,
        pseudo: customOptions.pseudo ?? base.pseudo,
        scale: customOptions.scale ?? base.scale,
        rotate: {
          x:
            customOptions.rotate?.x !== undefined
              ? customOptions.rotate.x
              : base.rotate.x,
          y:
            customOptions.rotate?.y !== undefined
              ? customOptions.rotate.y
              : base.rotate.y,
          z:
            customOptions.rotate?.z !== undefined
              ? customOptions.rotate.z
              : base.rotate.z,
        },
      };

      const elementKey = getElementKey(resolved.pseudo);

      // Получаем карту настроек для элемента или создаём новую
      let optionsMap = elementOptions.get(el);
      if (!optionsMap) {
        optionsMap = new Map();
        elementOptions.set(el, optionsMap);
      }

      // Сохраняем конкретную анимацию (element/before/after)
      optionsMap.set(elementKey, resolved);

      // Устанавливаем стартовое состояние
      prepareHiddenState(el, resolved);

      // Подключаем элемент к наблюдателю
      if (
        observer &&
        !observer.root &&
        !Array.from((observer as any)._targetElements || []).includes(el)
      ) {
        observer.observe(el);
      }
    });
  }

  // При размонтировании Vue-компонента → чистим всё
  onUnmounted(() => {
    observer?.disconnect();
    observer = null;
    elementOptions.clear();
  });

  return { animate };
}
