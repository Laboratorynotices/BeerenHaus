<script setup lang="ts">
import SwitchLocale from "./SwitchLocale.vue";
import BurgerButton from "./BurgerButton.vue";
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

      <nav class="header__nav" :aria-label="$t('Main navigation')">M</nav>

      <!-- Переключатель локали -->
      <SwitchLocale />
    </div>
  </header>
</template>
