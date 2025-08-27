# useCarousel (Vue 3 Composable)

`useCarousel` — это Vue 3 composable‑хук для создания бесконечной карусели/слайдера с поддержкой:

- Перетаскивания мышью и пальцем (drag / swipe)
- Бесконечной прокрутки слайдов (loop)
- Управления колесом мыши
- Адаптивного пересчета размеров
- Управления слайдами программно (next/prev)

---

## Использование

### Пример в компоненте

```vue
<template>
  <div ref="carouselRef" class="carousel">
    <div ref="wrapperRef" class="carousel-wrapper">
      <div class="slide" v-for="(item, i) in items" :key="i">
        {{ item }}
      </div>
    </div>
  </div>

  <button @click="slidePrev">Назад</button>
  <button @click="slideNext">Вперёд</button>
</template>

<script setup lang="ts">
import { useCarousel } from "@/composables/useCarousel";

const items = ["Слайд 1", "Слайд 2", "Слайд 3"];

const { carouselRef, wrapperRef, slideNext, slidePrev, realIndex } =
  useCarousel();
</script>

<style>
.carousel {
  overflow: hidden;
  cursor: grab;
  width: 400px;
}

.carousel-wrapper {
  display: flex;
  gap: 20px;
  will-change: transform;
}

.slide {
  min-width: 400px;
  height: 200px;
  background: lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

---

## API

### Возвращаемые значения

| Переменная       | Тип                   | Описание                                                                        |
| ---------------- | --------------------- | ------------------------------------------------------------------------------- |
| `carouselRef`    | `Ref<HTMLElement>`    | Ref для контейнера карусели                                                     |
| `wrapperRef`     | `Ref<HTMLElement>`    | Ref для обёртки слайдов                                                         |
| `isDragging`     | `Ref<boolean>`        | Флаг активного перетаскивания                                                   |
| `slideNext`      | `() => void`          | Перейти к следующему слайду                                                     |
| `slidePrev`      | `() => void`          | Перейти к предыдущему слайду                                                    |
| `updateCarousel` | `() => void`          | Пересчитать размеры и обновить клоны (например, при ресайзе или смене контента) |
| `currentIndex`   | `Ref<number>`         | Текущий индекс слайда (включая клоны)                                           |
| `realIndex`      | `ComputedRef<number>` | Реальный индекс оригинального слайда (без клонов)                               |

---

### Аргументы

```ts
useCarousel(cloneSets?: number)
```

- `cloneSets` (по умолчанию `3`) — количество "сетов" клонов слайдов, добавляемых в начало и конец для имитации бесконечной прокрутки.

---

## Особенности реализации

- **Бесконечность** реализуется клонированием оригинальных слайдов в начало и конец.
- **Перетаскивание** работает через `mousedown` / `mousemove` / `mouseup` и `touchstart` / `touchmove` / `touchend`.
- **Колесо мыши** двигает карусель вперед/назад.
- **Ресайз** вызывает перерасчет ширины слайдов.
- **normalizeIndex** автоматически "прыгает" в середину, если пользователь ушел за границы клонов.

---

## Советы по использованию

- Убедитесь, что `.carousel-wrapper` имеет `display: flex` и зазор `gap` (иначе расчеты ширины могут быть некорректными).
- Все слайды должны иметь одинаковую ширину.
- Можно стилизовать `.clone` для отладки (обычно они идентичны оригиналам).

---

## Лицензия

MIT
