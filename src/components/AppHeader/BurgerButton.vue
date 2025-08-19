<script setup lang="ts">
// Определяем пропсы для компонента
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <button
    id="burger-button"
    class="header__toggle"
    :class="isOpen ? 'fixed right-[24px]' : 'relative'"
    :aria-label="$t('Open menu')"
  >
    <!-- Три полоски, которые превращаются в крестик -->
    <!-- Верхняя полоска -->
    <span
      class="transition-transform origin-[right_center]"
      :class="isOpen ? '-rotate-45 w-[130%]' : 'w-full'"
    ></span>

    <!-- Средняя полоска -->
    <span
      class="w-full transition-opacity"
      :class="isOpen ? 'opacity-0' : 'opacity-100'"
    ></span>

    <!-- Нижняя полоска -->
    <span
      class="transition-transform origin-[right_center]"
      :class="isOpen ? 'rotate-45 w-[130%]' : 'w-full'"
    ></span>
  </button>
</template>
