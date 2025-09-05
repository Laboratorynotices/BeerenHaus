<script setup lang="ts">
import WhatsappIcon from "../IconsSVG/WhatsappIcon.vue";
import InstagramIcon from "../IconsSVG/InstagramIcon.vue";
import FacebookIcon from "../IconsSVG/FacebookIcon.vue";
import XIcon from "../IconsSVG/XIcon.vue";
import { type SocialDataType } from "../../types/content-schema";

// Определяем пропсы
defineProps<{
  socialData: SocialDataType;
}>();
</script>

<template>
  <div class="footer__social">
    <a
      v-for="(data, index) in socialData"
      :key="index"
      href="#"
      class="footer__social-link"
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
      <XIcon
        v-else-if="data.socialNetwork.toUpperCase() === 'x'.toUpperCase()"
      />
    </a>
  </div>
</template>
