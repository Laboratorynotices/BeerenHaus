import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useWindowInnerWidthRem } from "./useWindowInnerWidthRem";

/**
 * Композабл для управления меню с учетом типа устройства (мобильное/десктопное)
 * В будущем будет расширен функционалом отслеживания переходов между версиями
 * и обработчиком кликов вне мобильного меню
 * @returns объект с функциями и состоянием для управления меню
 */
export const useMenuController = () => {
  // Получаем ширину окна в rem
  const windowInnerWidthRem = useWindowInnerWidthRem();

  // Получаем доступ к константе через import.meta.env
  const MD_BREAKPOINT: number = import.meta.env.MD_BREAKPOINT;

  // Флаг для отслеживания состояния монтирования компонента
  const isMounted = ref(false);

  // Состояние для отслеживания открытия/закрытия мобильного меню
  const isMenuOpen = ref(false);
  // Состояние для отслеживания видимости меню (для перехода из десктопа в мобильный)
  const hideMenu = ref(false);

  // Проверяем ширину окна и определяем, является ли оно мобильным
  const isMobile = computed((): boolean => {
    // При инициализации компонента, когда он еще не смонтирован, возвращаем true
    if (!isMounted.value) {
      return true;
    }

    // Если ширина окна меньше MD_BREAKPOINT, это мобильное устройство
    return windowInnerWidthRem.windowWidthRem.value < MD_BREAKPOINT;
  });

  // Добавляем отслеживание изменений типа устройства
  const previousDeviceType = ref(isMobile.value);

  // Функция для переключения состояния мобильного меню
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  // Функция для закрытия меню
  const closeMenu = () => {
    if (isMenuOpen.value) {
      isMenuOpen.value = false;
    }
  };

  // Функция для регистрации монтирования компонента
  function setMounted() {
    isMounted.value = true;
  }

  // Обработчик клика вне меню для его закрытия
  const handleClickOutside = (event: MouseEvent) => {
    const navContainer = ref<HTMLElement | null>(null);
    // На ref поменять нельзя, поскольку мы не в компоненте с тегом с этим ref
    const burgerButton = document.getElementById("burger-button");

    // Проверяем, что клик был вне меню и кнопки-гамбургера
    // и что меню открыто и мы на мобильном устройстве
    if (isMenuOpen.value && isMobile.value && navContainer && burgerButton) {
      // Если клик был вне меню и кнопки-гамбургера, закрываем меню
      if (
        !navContainer.value?.contains(event.target as Node) &&
        !burgerButton.contains(event.target as Node)
      ) {
        closeMenu();
      }
    }
  };

  // Функции для обработки переходов между типами устройств
  // Переход с мобильного на десктоп
  const handleMobileToDesktop = (): void => {
    // Убеждаемся, что мобильное меню закрыто при переходе на десктоп
    isMenuOpen.value = false;
  };

  // Переход с десктопа на мобильный
  const handleDesktopToMobile = (): void => {
    // Скрываем меню на пару секунд
    // чтобы избежать дёргания при переходе
    hideMenu.value = true;
    setTimeout(() => {
      hideMenu.value = false;
    }, 300); // Время задержки перед показом меню
  };

  // Отслеживаем изменения типа устройства
  watch(isMobile, (newValue, oldValue) => {
    // Обновляем предыдущее значение
    previousDeviceType.value = oldValue;

    // Если переход с мобильного на десктоп
    if (oldValue === true && newValue === false) {
      handleMobileToDesktop();
    }
    // Если переход с десктопа на мобильный
    else if (oldValue === false && newValue === true) {
      handleDesktopToMobile();
    }
  });

  // Установка слушателей событий при монтировании компонента
  onMounted(() => {
    setMounted();
    document.addEventListener("click", handleClickOutside);
  });

  // Удаление слушателей событий при уничтожении компонента
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  return {
    isMobile,
    isMounted,
    hideMenu,
    isMenuOpen,
    closeMenu,
    toggleMenu,
  };
};
