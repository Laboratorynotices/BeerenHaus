# useScrollThreshold

Композабл для отслеживания прокрутки страницы.

## Использование

```typescript
import { useScrollThreshold } from "@/composables/useScrollThreshold";

const { isScrolled } = useScrollThreshold(150);
```

## Параметры

- `threshold` (число, по умолчанию 200) - порог прокрутки в пикселях

## Возвращает

- `isScrolled` - `true` когда страница прокручена больше чем на `threshold` пикселей

## Пример

```vue
<script setup lang="ts">
import { useScrollThreshold } from "@/composables/useScrollThreshold";

const { isScrolled } = useScrollThreshold(150);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <button v-show="isScrolled" @click="scrollToTop">Наверх</button>
</template>
```
