import { ref, onMounted, onUnmounted } from "vue";

export function useScrollThreshold(threshold: number = 200) {
  const isScrolled = ref<boolean>(false);

  const handleScroll = () => {
    isScrolled.value = window.scrollY > threshold;
  };

  onMounted(() => {
    // Проверяем начальное состояние
    handleScroll();

    // Добавляем слушатель события прокрутки
    window.addEventListener("scroll", handleScroll, { passive: true });
  });

  onUnmounted(() => {
    // Удаляем слушатель при размонтировании компонента
    window.removeEventListener("scroll", handleScroll);
  });

  return {
    isScrolled,
  };
}
