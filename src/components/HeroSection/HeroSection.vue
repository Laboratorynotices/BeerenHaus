<script lang="ts" setup>
import { type HeroBlock } from "../../types/content-schema";

// Определяем пропсы для компонента
defineProps({
  block: {
    type: Object as () => HeroBlock,
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
    :id="id"
    class="hero section"
    :aria-label="$t('Hero section: Fresh berries')"
  >
    <div class="wrap-container" role="none">
      <h1 class="hero__title">{{ block.props.title }}</h1>
      <div class="hero__images shaped">
        <div class="deco1">
          <div class="deco2">
            <div class="deco3">
              <img
                src="../../assets/imgs/hero/hero-image.png"
                :alt="$t('Cup with berries')"
                class="hero__image"
                loading="lazy"
                role="none"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="hero__data">
        <p class="hero__description">{{ block.props.description }}</p>
        <a :href="'#' + block.props.anchor" class="button">{{
          $t("Learn More")
        }}</a>
      </div>
    </div>
  </section>
</template>
