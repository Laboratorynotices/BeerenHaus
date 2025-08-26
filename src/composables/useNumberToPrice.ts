export function useNumberToPrice() {
  // Немецкая локаль даёт разделитель тысяч "." и десятичную ",".
  // Жёстко фиксируем две цифры после запятой (с округлением).
  const formatter = new Intl.NumberFormat("de-DE", {
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  /**
   * Нормализует входящее значение к числу или null.
   * @param value - входящее значение (число, строка, null или undefined)
   * @returns нормализованное число или null, если значение некорректно
   */
  const normalizeToNumber = (
    value: number | string | null | undefined,
  ): number | null => {
    // Быстрые проверки на null/undefined и уже число
    if (value === null || value === undefined) return null;
    // Если это строка, пытаемся её преобразовать в число
    if (typeof value === "string") {
      // Разрешаем строки с запятой или точкой как десятичным разделителем
      // и игнорируем пробелы-разделители.
      const normalized = value.replace(/\s+/g, "").replace(",", ".");
      value = Number(normalized);
    }

    // Проверяем, что после всех преобразований у нас действительно число
    return Number.isFinite(value) ? value : null;
  };

  /**
   * Преобразует число в строку с форматированием цены.
   * @param value - входящее значение (число, строка, null или undefined)
   * @returns отформатированная строка цены или пустая строка для некорректных значений
   */
  const numberToPrice = (value: number | string | null | undefined): string => {
    // Сначала нормализуем входящее значение к числу
    const n = normalizeToNumber(value);
    if (n === null) return ""; // можно заменить на "—" если нужно явно показывать пустое
    // Форматируем число как цену
    return formatter.format(n);
  };

  return { numberToPrice };
}
