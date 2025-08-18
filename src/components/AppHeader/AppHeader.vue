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

      <div class="header__lang-switcher" :aria-label="$t('Switch language')">
        L
      </div>
    </div>
  </header>
</template>
