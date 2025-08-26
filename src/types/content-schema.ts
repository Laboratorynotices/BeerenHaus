import { z } from "zod";

// ==========================
// HeroBlockProps - параметры блока "Hero"
// ==========================
export const HeroBlockPropsSchema = z.object({
  // Заголовок блока Hero
  title: z.string(),
  // Описание блока Hero
  description: z.string(),
  // Якорная ссылка для перехода к другому блоку
  anchor: z.string().optional(),
});

export type HeroBlockProps = z.infer<typeof HeroBlockPropsSchema>;

// ==========================
// HeroBlock - блок "Hero"
// ==========================
export const HeroBlockSchema = z.object({
  type: z.literal("hero"),
  props: HeroBlockPropsSchema,
});

export type HeroBlock = z.infer<typeof HeroBlockSchema>;

// ==========================
// PopularProduct - отдельный продукт из списка популярных
// ==========================
export const PopularProductSchema = z.object({
  // Название продукта
  name: z.string(),

  // Ссылка на изображение продукта
  image: z.string(),

  // Краткое описание продукта
  description: z.string(),

  // Цена продукта
  price: z.number(),
});

export type PopularProduct = z.infer<typeof PopularProductSchema>;

// ==========================
// PopularBlockProps - параметры блока "Популярное"
// ==========================
export const PopularBlockPropsSchema = z.object({
  // Заголовок блока (например: "Популярные товары")
  title: z.string(),

  // Якорная ссылка для перехода к другому блоку
  anchor: z.string().optional(),

  // Список популярных товаров
  products: z.array(PopularProductSchema),
});

export type PopularBlockProps = z.infer<typeof PopularBlockPropsSchema>;

// ==========================
// PopularBlock - блок "Популярное"
// ==========================
export const PopularBlockSchema = z.object({
  // Тип блока всегда фиксирован как "popular"
  type: z.literal("popular"),

  // Название меню, может быть опциональным
  menuName: z.string().optional(),

  // Основные параметры блока
  props: PopularBlockPropsSchema,
});

export type PopularBlock = z.infer<typeof PopularBlockSchema>;

// ==========================
// AboutBlock - Блок "О нас"
// ==========================
export const AboutBlockSchema = z.object({
  type: z.literal("about"),
  menuName: z.string().optional(),
  props: z.object({
    title: z.string(),
  }),
});

// ProductsBlock
export const ProductsBlockSchema = z.object({
  type: z.literal("products"),
  menuName: z.string().optional(),
  props: z.object({
    title: z.string(),
  }),
});

// ContactBlock
export const ContactBlockSchema = z.object({
  type: z.literal("contact"),
  menuName: z.string().optional(),
  props: z.object({
    title: z.string(),
  }),
});

// FooterBlock
export const FooterBlockSchema = z.object({
  type: z.literal("footer"),
  props: z.object({
    title: z.string(),
  }),
});

// ... другие блоки

// Объединение всех типов блоков
// PageBlockSchema
const BlockSchema = z.union([
  HeroBlockSchema,
  PopularBlockSchema,
  AboutBlockSchema,
  ProductsBlockSchema,
  ContactBlockSchema,
  FooterBlockSchema,
]);

// Автоматически выводим TS-тип из схемы
export type PageBlock = z.infer<typeof BlockSchema>;

// Файл контента
// PageContentFileSchema
export const ContentFileSchema = z.object({
  blocks: z.array(BlockSchema),
});

// Автоматически выводим TS-тип из схемы
// PageContentFile
export type ContentFile = z.infer<typeof ContentFileSchema>;
