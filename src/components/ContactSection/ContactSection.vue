<script lang="ts" setup>
// Импортируем функцию для анимации при скролле
import { onMounted } from "vue";
import { useScrollAnimator } from "../../composables/useScrollAnimator";
import { computed } from "vue";
import {
  type ContactBlock,
  type ContactColumns,
} from "../../types/content-schema";

import ContactColumn from "./ContactColumn.vue";

// Определяем пропсы для компонента
const props = defineProps({
  block: {
    type: Object as () => ContactBlock,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

/**
 * Разделяем список данных для контактов пополам
 * для левой и правой колонки
 */
const contactColumns = computed((): ContactColumns => {
  const contactData = props.block.props.contactData;
  const mid = Math.ceil(contactData.length / 2);
  return [contactData.slice(0, mid), contactData.slice(mid)];
});

// Используем анимацию при скролле
const { animate } = useScrollAnimator({
  origin: "top",
  distance: "60px",
  duration: 2000,
  delay: 300,
});

onMounted(() => {
  // Анимируем элементы
  animate(".contact__images.shaped", {
    pseudo: "before",
    delay: 600,
    scale: 0,
  });
  animate(".contact__image", { delay: 1200 });
});
</script>

<template>
  <section :id="id" class="contact section" :aria-label="$t('Contact section')">
    <div class="wrap-container" role="none">
      <h2 class="section__title">{{ block.props.title }}</h2>

      <div class="contact__container">
        <ContactColumn
          v-for="(column, index) in contactColumns"
          :key="index"
          :class="`column-${index}`"
          :column="column"
        />

        <div class="contact__images shaped">
          <img
            src="/src/assets/imgs/contact/contact.png"
            :alt="$t('contact image')"
            role="none"
            class="contact__image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>
