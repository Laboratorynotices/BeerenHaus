<script lang="ts" setup>
import { type PageBlock } from "../types/content-schema";

// Определяем пропсы для компонента
defineProps({
  block: {
    type: Object as () => PageBlock,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <section
    :id="`desc-${id}`"
    role="region"
    :aria-label="`Block of type ${block.type}`"
    :aria-describedby="`desc-${id}`"
  >
    <p>{{ block.type }}</p>
  </section>
</template>
