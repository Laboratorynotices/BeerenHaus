<script setup lang="ts">
import {
  type ContactItemList,
  type ContactSocialType,
  ContactSocialSchema,
} from "../../types/content-schema";
import ContactSocial from "./ContactSocial.vue";
import ContactAddress from "./ContactAddress.vue";

// Определяем пропсы
defineProps<{
  column: ContactItemList;
}>();

// Type guards
const isContactSocial = (item: unknown): item is ContactSocialType => {
  return ContactSocialSchema.safeParse(item).success;
};
</script>

<template>
  <div class="contact__info">
    <div v-for="(item, index) in column" :key="index" class="contact__data">
      <ContactSocial v-if="isContactSocial(item)" :socialData="item" />
      <ContactAddress v-else :adressData="item" />
    </div>
  </div>
</template>
