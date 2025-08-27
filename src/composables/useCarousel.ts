import { ref, onMounted, onUnmounted, nextTick, computed, type Ref } from "vue";

// Хук для создания бесконечного каруселя/слайдера
export function useCarousel(cloneSets = 3) {
  // Ссылки на DOM-элементы
  const carouselRef: Ref<HTMLElement | null> = ref(null); // Контейнер карусели
  const wrapperRef: Ref<HTMLElement | null> = ref(null); // Обёртка слайдов

  // Состояния для управления перетаскиванием
  const isDragging = ref(false); // Флаг активного перетаскивания
  const startX = ref(0); // Начальная позиция курсора при перетаскивании
  const currentTranslate = ref(0); // Текущее смещение слайдера
  const prevTranslate = ref(0); // Предыдущее смещение слайдера
  const currentIndex = ref(0); // Текущий индекс слайда (с учётом клонов)

  // Переменные для размеров слайдов
  let slideWidth = 0; // Ширина одного слайда (включая gap)
  let totalSlides = 0; // Общее количество оригинальных слайдов

  // Вычисляемое свойство для получения реального индекса (без клонов)
  const realIndex = computed(() => {
    if (totalSlides === 0) return 0;
    // Модульная арифметика для корректного вычисления индекса
    return ((currentIndex.value % totalSlides) + totalSlides) % totalSlides;
  });

  // Установка позиции слайдера через CSS transform
  const setSliderPosition = () => {
    if (!wrapperRef.value) return;
    currentTranslate.value = currentIndex.value * -slideWidth;
    wrapperRef.value.style.transform = `translateX(${currentTranslate.value}px)`;
  };

  // Установка позиции с анимацией перехода
  const setPositionByIndex = () => {
    if (!wrapperRef.value) return;
    wrapperRef.value.style.transition = "transform 0.3s ease-out";
    setSliderPosition();
  };

  // Вычисление размеров слайдов и промежутков
  const calculateDimensions = () => {
    if (!carouselRef.value || !wrapperRef.value) return;

    // Получаем только оригинальные слайды (исключая клоны)
    const slides = Array.from(wrapperRef.value.children).filter(
      (el) => !el.classList.contains("clone"),
    ) as HTMLElement[];

    totalSlides = slides.length;
    if (totalSlides === 0) return;

    const firstSlide = slides[0];
    // Получаем значение gap из CSS
    const gap = parseInt(getComputedStyle(wrapperRef.value).gap) || 20;
    // Вычисляем полную ширину слайда (ширина + gap)
    slideWidth = firstSlide.offsetWidth + gap;
  };

  // Создание бесконечного цикла через клонирование слайдов
  const createInfiniteLoop = () => {
    if (!wrapperRef.value || totalSlides === 0) return;

    // Удаляем старые клоны
    wrapperRef.value.querySelectorAll(".clone").forEach((el) => el.remove());

    // Получаем оригинальные слайды
    const slides = Array.from(wrapperRef.value.children).filter(
      (el) => !el.classList.contains("clone"),
    ) as HTMLElement[];

    // Создаём клоны несколько раз (cloneSets)
    for (let i = 0; i < cloneSets; i++) {
      // В конец
      slides.forEach((slide) => {
        const cloneEnd = slide.cloneNode(true) as HTMLElement;
        cloneEnd.classList.add("clone");
        wrapperRef.value!.appendChild(cloneEnd);
      });

      // В начало (обратный порядок)
      slides
        .slice()
        .reverse()
        .forEach((slide) => {
          const cloneStart = slide.cloneNode(true) as HTMLElement;
          cloneStart.classList.add("clone");
          wrapperRef.value!.insertBefore(
            cloneStart,
            wrapperRef.value!.firstChild,
          );
        });
    }

    // Стартуем из середины (область с клонами)
    currentIndex.value = totalSlides * cloneSets;
    setSliderPosition();
  };

  // Нормализация индекса для создания эффекта бесконечности
  const normalizeIndex = () => {
    if (!wrapperRef.value) return;

    // Если ушли слишком далеко в начало - перепрыгиваем в конец
    if (currentIndex.value < totalSlides) {
      currentIndex.value += totalSlides * cloneSets;
      wrapperRef.value.style.transition = "none"; // Без анимации
      setSliderPosition();
    }
    // Если ушли слишком далеко в конец - перепрыгиваем в начало
    else if (currentIndex.value >= totalSlides * (cloneSets + 1)) {
      currentIndex.value -= totalSlides * cloneSets;
      wrapperRef.value.style.transition = "none"; // Без анимации
      setSliderPosition();
    }
  };

  // Начало перетаскивания
  const startDrag = (e: MouseEvent | TouchEvent) => {
    if (!wrapperRef.value) return;

    isDragging.value = true;
    startX.value = "touches" in e ? e.touches[0].clientX : e.clientX;
    prevTranslate.value = currentTranslate.value;

    // Отключаем анимацию во время перетаскивания
    wrapperRef.value.style.transition = "none";
    if (carouselRef.value) carouselRef.value.style.cursor = "grabbing";

    e.preventDefault(); // Предотвращаем выделение текста
  };

  // Процесс перетаскивания
  const drag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !wrapperRef.value) return;

    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - startX.value; // Смещение от начальной точки

    // Обновляем позицию слайдера
    currentTranslate.value = prevTranslate.value + deltaX;
    wrapperRef.value.style.transform = `translateX(${currentTranslate.value}px)`;

    e.preventDefault();
  };

  // Завершение перетаскивания
  const endDrag = () => {
    if (!isDragging.value || !wrapperRef.value) return;

    isDragging.value = false;
    if (carouselRef.value) carouselRef.value.style.cursor = "grab";

    // Вычисляем на сколько слайдов сдвинулись
    const movedBy = currentTranslate.value - prevTranslate.value;
    const movedSlides = Math.round(movedBy / slideWidth);

    // Обновляем индекс с учётом сдвига
    if (movedSlides !== 0) {
      currentIndex.value -= movedSlides;
    }

    // Устанавливаем позицию с анимацией
    setPositionByIndex();
  };

  // Переход к следующему слайду
  const slideNext = () => {
    if (isDragging.value) return; // Не реагируем во время перетаскивания
    currentIndex.value += 1;
    setPositionByIndex();
  };

  // Переход к предыдущему слайду
  const slidePrev = () => {
    if (isDragging.value) return; // Не реагируем во время перетаскивания
    currentIndex.value -= 1;
    setPositionByIndex();
  };

  // Обработка скролла колесом мыши
  const handleWheel = (e: WheelEvent) => {
    if (isDragging.value) return;
    e.preventDefault();
    // Определяем направление скролла
    if (e.deltaX > 0 || e.deltaY > 0) slideNext();
    else slidePrev();
  };

  // Обновление карусели (при изменении размеров или содержимого)
  const updateCarousel = () => {
    calculateDimensions();
    if (totalSlides > 0) {
      createInfiniteLoop();
    }
  };

  // Хуки жизненного цикла Vue
  onMounted(() => {
    nextTick(() => {
      if (!carouselRef.value || !wrapperRef.value) return;

      updateCarousel(); // Инициализация карусели

      // Обработчики для мыши
      carouselRef.value.addEventListener("mousedown", startDrag);
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", endDrag);

      // Обработчики для touch-устройств
      carouselRef.value.addEventListener("touchstart", startDrag, {
        passive: false, // Для preventDefault()
      });
      document.addEventListener("touchmove", drag, { passive: false });
      document.addEventListener("touchend", endDrag);

      // Обработчик скролла колесом
      carouselRef.value.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      // Обработчик изменения размера окна
      window.addEventListener("resize", updateCarousel);

      // Обработчик завершения CSS-анимации
      wrapperRef.value.addEventListener("transitionend", normalizeIndex);

      // Предотвращение контекстного меню и выделения при перетаскивании
      carouselRef.value.addEventListener("contextmenu", (e) => {
        if (isDragging.value) e.preventDefault();
      });
      carouselRef.value.addEventListener("selectstart", (e) =>
        e.preventDefault(),
      );
    });
  });

  // Очистка обработчиков при уничтожении компонента
  onUnmounted(() => {
    if (!carouselRef.value) return;

    carouselRef.value.removeEventListener("mousedown", startDrag);
    carouselRef.value.removeEventListener("touchstart", startDrag);
    carouselRef.value.removeEventListener("wheel", handleWheel);

    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("touchend", endDrag);
    window.removeEventListener("resize", updateCarousel);

    if (wrapperRef.value)
      wrapperRef.value.removeEventListener("transitionend", normalizeIndex);
  });

  // Возвращаемые значения для использования в компоненте
  return {
    carouselRef, // Ref для контейнера карусели
    wrapperRef, // Ref для обёртки слайдов
    isDragging, // Состояние перетаскивания
    slideNext, // Функция следующего слайда
    slidePrev, // Функция предыдущего слайда
    updateCarousel, // Функция обновления карусели
    currentIndex, // Текущий индекс (с клонами)
    realIndex, // Индекс оригинального активного слайда
  };
}
