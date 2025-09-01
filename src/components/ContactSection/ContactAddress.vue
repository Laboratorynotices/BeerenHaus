<script setup lang="ts">
import { type ContactAddressType } from "../../types/content-schema";

// Определяем пропсы
defineProps<{
  adressData: ContactAddressType;
}>();
</script>

<template>
  <h3 class="contact__title">{{ adressData.title }}</h3>

  <address class="contact__address">
    <span v-for="(line, index) in adressData.data" :key="index">
      {{ line }}
    </span>
  </address>
</template>
