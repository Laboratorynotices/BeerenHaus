import { z } from "zod";

// HeroBlock
export const HeroBlockSchema = z.object({
  type: z.literal("hero"),
  props: z.object({
    title: z.string(),
  }),
});

// PopularBlock
export const PopularBlockSchema = z.object({
  type: z.literal("popular"),
  props: z.object({
    title: z.string(),
  }),
});

// AboutBlock
export const AboutBlockSchema = z.object({
  type: z.literal("about"),
  props: z.object({
    title: z.string(),
  }),
});

// ProductsBlock
export const ProductsBlockSchema = z.object({
  type: z.literal("products"),
  props: z.object({
    title: z.string(),
  }),
});

// ContactBlock
export const ContactBlockSchema = z.object({
  type: z.literal("contact"),
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
const BlockSchema = z.union([
  HeroBlockSchema,
  PopularBlockSchema,
  AboutBlockSchema,
  ProductsBlockSchema,
  ContactBlockSchema,
  FooterBlockSchema,
]);

// Файл контента
export const ContentFileSchema = z.object({
  blocks: z.array(BlockSchema),
});

// Автоматически выводим TS-тип из схемы
export type ContentFile = z.infer<typeof ContentFileSchema>;
