<script setup lang="ts">
// Импортируем функции для работы с контентом
import { useContent } from "../../composables/useContent";
const { menuItems } = useContent();

// Определяем пропсы для компонента
defineProps({
  hideMenu: {
    type: Boolean,
    required: true,
  },
  isMobile: {
    type: Boolean,
    required: true,
  },
  isMenuOpen: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <nav class="header__nav w-auto">
    <!-- Навигационные ссылки (один компонент для обоих режимов) -->
    <ul
      id="nav-list"
      :aria-label="$t('Main navigation')"
      class="nav__list"
      :class="[
        // На пару секунд скрываем меню при переходе с десктопа на мобильный
        hideMenu ? 'hidden' : '',
        // Условные стили для мобильной версии
        isMobile ? 'fixed left-0 right-0 top-0' : 'relative flex gap-2',
        // Анимация появления/скрытия только для мобильной версии
        isMobile
          ? // Актуально только для мобильной версии
            isMenuOpen
            ? // Если меню открыто, показываем его с анимацией
              'transform translate-y-0 shadow-lg'
            : // Если меню закрыто, скрываем его с анимацией
              'transform -translate-y-full'
          : // Для десктопной версии просто показываем меню
            '',
      ]"
    >
      <li class="nav__item" v-for="(item, id) in menuItems" :key="id">
        <a :href="'#' + item.type" class="nav__link">
          {{ item.menuName }}
        </a>
      </li>
    </ul>
  </nav>
</template>
