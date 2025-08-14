import { z } from "zod";

// HeroBlock
export const HeroBlockSchema = z.object({
  type: z.literal("hero"),
  props: z.object({
    title: z.string(),
  }),
});

// ... другие блоки, например PopularBlock

// Объединение всех типов блоков
const BlockSchema = z.union([
  HeroBlockSchema,
  /*
  Позже добавим сюда другие блоки, как:
  Popular
  About
  Products
  Contact
  Footer
  */
]);

// Файл контента
export const ContentFileSchema = z.object({
  blocks: z.array(BlockSchema),
});

// Автоматически выводим TS-тип из схемы
export type ContentFile = z.infer<typeof ContentFileSchema>;
