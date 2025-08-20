<script setup lang="ts">
/*
  В родительском компоненте используется ref для указания на сам <header>,
  чтобы можно было получить его высоту и установить отступы для main.
  Здесь мы создаём ссылку на этот элемент ref="root"
  и делаем её доступной для родителя.
*/
import { ref } from "vue";

import BurgerButton from "./BurgerButton.vue";
import NavLinks from "./NavLinks.vue";
import SwitchLocale from "./SwitchLocale.vue";

// Используем композабл для управления меню
import { useMenuController } from "../../composables/useMenuController.ts";
const menuController = useMenuController();

// указываем ссылку на сам <header>
const root = ref<HTMLElement | null>(null);

// делаем её доступной для родителя
defineExpose({
  root,
});
</script>

<template>
  <header ref="root" class="header" id="header">
    <div class="wrap-container">
      <!-- Логотип -->
      <a
        href="#"
        class="header__logo"
        :aria-label="'BeerenHaus ' + $t('Go to main page')"
        >BeerenHaus</a
      >

      <!-- Кнопка-бургер для мобильного меню -->
      <BurgerButton
        ref="burgerButton"
        :is-open="menuController.isMenuOpen.value"
        @click="menuController.toggleMenu"
      />

      <!-- Навигационные ссылки -->
      <NavLinks
        :isMenuOpen="menuController.isMenuOpen.value"
        @link-clicked="menuController.closeMenu"
      />
      <!-- Пустой div для анимации -->
      <!-- Он нужен, чтобы содержание шапки сайта не прыгало -->
      <!-- Это позволяет сохранить место для кнопки и избежать сдвига контента -->
      <div
        v-if="menuController.isMenuOpen.value"
        class="order-1 w-[var(--width-burger-button)] h-[var(--height-burger-button)]"
      ></div>

      <!-- Переключатель локали -->
      <SwitchLocale />
    </div>
  </header>
</template>
