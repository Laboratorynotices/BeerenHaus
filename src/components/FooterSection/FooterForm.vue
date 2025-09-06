<script setup lang="ts">
import { ref } from "vue";

const email = ref("");

// ошибки: полевая + общая
const errors = ref<{ email?: string; form?: string }>({});

const validateEmail = (value: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
};

// Вызывается вместо отправки формы
const handleSubmit = (): boolean => {
  errors.value = {}; // очищаем ошибки перед проверкой

  // Валидация поля email
  if (!validateEmail(email.value)) {
    errors.value.email = "Enter a valid email";
  }

  // Если какая-то проверка провалилась, тогда останавливаемя тут
  if (Object.keys(errors.value).length !== 0) {
    errors.value.form = "Check form correctness";
    return false;
  }

  // всё в порядке

  try {
    // тут "отправляем" email (например, запрос на API)
    // для примера сделаем искусственную ошибку
    throw new Error("Server temporarily unavailable");
  } catch (e: any) {
    errors.value.form = e.message || "An error occurred, try again later";
    return false;
  }

  return true;
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="footer__form">
    <input
      v-model="email"
      type="email"
      :placeholder="errors.email ? $t(errors.email) : $t('Email')"
      :title="errors.email ? $t(errors.email) : $t('Email')"
      class="footer__input"
      :class="{ field__error: errors.email }"
      name="footer__form-email"
    />
    <button type="submit" class="footer__button button">
      {{ $t("Subscribe") }}
    </button>
  </form>
</template>
