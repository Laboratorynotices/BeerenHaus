<script setup lang="ts">
import ArrowUp from "../IconsSVG/ArrowUp.vue";
import { useScrollThreshold } from "../../composables/useScrollThreshold";

const { isScrolled } = useScrollThreshold(150);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <a
    href="#app"
    class="scrollup"
    :class="{ show_scrollup: isScrolled }"
    id="scroll-up"
    :aria-label="$t('Scroll to top')"
    @click.prevent="scrollToTop"
  >
    <ArrowUp />
  </a>
</template>
