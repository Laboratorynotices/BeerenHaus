<script setup lang="ts"></script>

<template>
  <form @submit.prevent="" class="footer__form">
    <input
      type="email"
      :placeholder="$t('Email')"
      class="footer__input"
      name="footer__form-email"
    />
    <button type="submit" class="footer__button button">
      {{ $t("Subscribe") }}
    </button>
  </form>
</template>
