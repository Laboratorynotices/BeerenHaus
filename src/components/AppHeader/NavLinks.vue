<script setup lang="ts">
// Импортируем функции для работы с контентом
import { useContent } from "../../composables/useContent";
const { menuItems } = useContent();

// Определяем пропсы для компонента
defineProps({
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
      isMenuOpen
        ? // Если меню открыто, показываем его с анимацией
          'top-0'
        : // Если меню закрыто, скрываем его с анимацией
          'top-[-120%]',
    ]"
  >
    <!-- Навигационные ссылки (один компонент для обоих режимов) -->
    <ul id="nav-list" class="nav__list" role="none">
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
