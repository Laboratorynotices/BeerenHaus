<script lang="ts" setup>
import { onMounted } from "vue";
// Импортируем функцию для анимации при скролле
import { useScrollAnimator } from "../../composables/useScrollAnimator";

import { type FooterBlockPropsType } from "../../types/content-schema";
import FooterBlock from "./FooterBlock.vue";
import FooterSocial from "./FooterSocial.vue";
import FooterPayment from "./FooterPayment.vue";
import FooterForm from "./FooterForm.vue";

// Определяем пропсы для компонента
defineProps({
  content: {
    type: Object as () => FooterBlockPropsType,
    required: true,
  },
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
  animate(".footer-animated");
  animate(".footer__copyrights");
});
</script>

<template>
  <footer class="footer" :aria-label="$t('Footer section')">
    <div class="wrap-container footer-animated" role="none">
      <FooterBlock>
        <template #title>{{ content.social.title }}</template>
        <FooterSocial :socialData="content.social.data" />
      </FooterBlock>
      <FooterBlock>
        <template #title>{{ content.payment.title }}</template>
        <FooterPayment :paymentData="content.payment.data" />
      </FooterBlock>
      <FooterBlock class="form-block">
        <template #title>{{ $t("Subscribe For Discounts") }}</template>
        <FooterForm />
      </FooterBlock>
    </div>
    <span class="footer__copyrights">
      {{ $t("© All Rights Reserved") }}
    </span>
  </footer>
</template>
