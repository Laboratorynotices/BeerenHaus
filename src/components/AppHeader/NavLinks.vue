<script setup lang="ts">
// Импортируем функции для работы с контентом
import { useContent } from "../../composables/useContent";
// Импортируем компосабл для отслеживания активной секции
import { useActiveSection } from "../../composables/useActiveSection";

const { menuItems } = useContent();

// Используем единственный экземпляр компосабла (singleton)
const { scrollToSection, isActive } = useActiveSection();

// Определяем пропсы для компонента
defineProps({
  isMenuOpen: {
    type: Boolean,
    required: true,
  },
});

/**
 * Обработчик клика по ссылке навигации
 */
const handleNavClick = (event: Event, itemType: string) => {
  event.preventDefault();
  scrollToSection(itemType);
};
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
          :class="{
            'active-link': isActive(item.type === 'app' ? 'hero0' : item.type),
          }"
          @click="handleNavClick($event, item.type)"
        >
          <!-- Если это "Home", используем перевод, иначе просто имя меню -->
          {{ item.menuName == "Home" ? $t("Home") : item.menuName }}
        </a>
      </li>
    </ul>
  </nav>
</template>
