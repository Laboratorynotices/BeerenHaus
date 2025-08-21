import { z } from "zod";

// HeroBlock
export const HeroBlockSchema = z.object({
  type: z.literal("hero"),
});

// PopularBlock
export const PopularBlockSchema = z.object({
  type: z.literal("popular"),
  menuName: z.string().optional(),
  props: z.object({
    title: z.string(),
  }),
});

// AboutBlock
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
