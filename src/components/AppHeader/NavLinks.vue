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
  <nav
    :aria-label="$t('Main navigation')"
    class="header__nav"
    :class="[
      // На пару секунд скрываем меню при переходе с десктопа на мобильный
      hideMenu ? '' : '',
      // Условные стили для мобильной версии
      isMobile ? 'mobile-version' : '',
      // Анимация появления/скрытия только для мобильной версии
      isMobile
        ? // Актуально только для мобильной версии
          isMenuOpen
          ? // Если меню открыто, показываем его с анимацией
            'top-0'
          : // Если меню закрыто, скрываем его с анимацией
            'top-[-120%]'
        : // Для десктопной версии просто показываем меню
          '',
    ]"
  >
    <!-- Навигационные ссылки (один компонент для обоих режимов) -->
    <ul
      id="nav-list"
      class="nav__list"
      :class="[
        // На пару секунд скрываем меню при переходе с десктопа на мобильный
        hideMenu ? '' : '',
        // Условные стили для мобильной версии
        isMobile ? '' : '',
        // Анимация появления/скрытия только для мобильной версии
        isMobile
          ? // Актуально только для мобильной версии
            isMenuOpen
            ? // Если меню открыто, показываем его с анимацией
              ''
            : // Если меню закрыто, скрываем его с анимацией
              ''
          : // Для десктопной версии просто показываем меню
            '',
      ]"
      role="none"
    >
      <li class="nav__item" v-for="(item, id) in menuItems" :key="id">
        <a
          :href="'#' + item.type"
          class="nav__link"
          :class="id === 0 ? 'active-link' : ''"
        >
          {{ item.menuName }}
        </a>
      </li>
    </ul>
  </nav>
</template>
