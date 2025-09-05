<script setup lang="ts">
import CreditIcon from "../IconsSVG/CreditIcon.vue";
import DebitIcon from "../IconsSVG/DebitIcon.vue";
import PayIcon from "../IconsSVG/PayIcon.vue";
import BankIcon from "../IconsSVG/BankIcon.vue";
import { type PaymentDataType } from "../../types/content-schema";

// Определяем пропсы
defineProps<{
  paymentData: PaymentDataType;
}>();
</script>

<template>
  <div class="footer__payment">
    <a
      v-for="(data, index) in paymentData"
      :key="index"
      href="#"
      class="footer__payment-link"
      :title="$t(data.paymentMethod)"
    >
      <CreditIcon
        v-if="data.paymentMethod.toUpperCase() === 'Credit card'.toUpperCase()"
      />
      <DebitIcon
        v-else-if="
          data.paymentMethod.toUpperCase() === 'Debit card'.toUpperCase()
        "
      />
      <PayIcon
        v-else-if="
          data.paymentMethod.toUpperCase() === 'Digital wallet'.toUpperCase()
        "
      />
      <BankIcon
        v-else-if="
          data.paymentMethod.toUpperCase() === 'Bank transfer'.toUpperCase()
        "
      />
      <div v-else>
        {{ data.paymentMethod }}
      </div>
    </a>
  </div>
</template>
