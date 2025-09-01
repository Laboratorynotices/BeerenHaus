<script setup lang="ts">
import WhatsappIcon from "../IconsSVG/WhatsappIcon.vue";
import InstagramIcon from "../IconsSVG/InstagramIcon.vue";
import FacebookIcon from "../IconsSVG/FacebookIcon.vue";
import { type ContactSocialType } from "../../types/content-schema";

// Определяем пропсы
defineProps<{
  socialData: ContactSocialType;
}>();
</script>

<template>
  <h3 class="contact__title">{{ socialData.title }}</h3>

  <div class="contact__social">
    <a
      v-for="(data, index) in socialData.data"
      :key="index"
      href="#"
      class="contact__social-link"
    >
      <WhatsappIcon
        v-if="data.socialNetwork.toUpperCase() === 'whatsapp'.toUpperCase()"
      />
      <InstagramIcon
        v-else-if="
          data.socialNetwork.toUpperCase() === 'instagram'.toUpperCase()
        "
      />
      <FacebookIcon
        v-else-if="
          data.socialNetwork.toUpperCase() === 'facebook'.toUpperCase()
        "
      />
    </a>
  </div>
</template>
