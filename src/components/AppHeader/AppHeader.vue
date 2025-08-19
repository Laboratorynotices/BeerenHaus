<script setup lang="ts">
import BurgerButton from "./BurgerButton.vue";
import NavLinks from "./NavLinks.vue";
import SwitchLocale from "./SwitchLocale.vue";
</script>

<template>
  <header class="header" id="header">
    <div class="wrap-container">
      <!-- Логотип -->
      <a
        href="#"
        class="header__logo"
        :aria-label="'BeerenHaus ' + $t('Go to main page')"
        >BeerenHaus</a
      >

      <!-- Кнопка-бургер для мобильного меню -->
      <BurgerButton ref="burgerButton" :isOpen="false" />

      <!-- Навигационные ссылки -->
      <NavLinks :hideMenu="false" :isMobile="false" :isMenuOpen="false" />

      <!-- Переключатель локали -->
      <SwitchLocale />
    </div>
  </header>
</template>
