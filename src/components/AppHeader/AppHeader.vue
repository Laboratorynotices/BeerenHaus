<script setup lang="ts">
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

      <button class="header__toggle" :aria-label="$t('Open menu')">
        <!-- иконка бургера -->B
      </button>

      <nav class="header__nav" :aria-label="$t('Main navigation')">M</nav>

      <!-- Переключатель локали -->
      <SwitchLocale />
    </div>
  </header>
</template>
