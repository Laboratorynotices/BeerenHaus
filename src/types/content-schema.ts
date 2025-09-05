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
// AboutBlockProps - параметры блока "О нас"
// ==========================
export const AboutBlockPropsSchema = z.object({
  // Заголовок блока (например: "О нас")
  title: z.string(),

  // Текст в блоке "О нас"
  description: z.string(),

  // Якорная ссылка для перехода к другому блоку
  anchor: z.string().optional(),

  // Надпись для кнопки с якорной ссылкой
  buttonTitle: z.string().optional(),
});

export type AboutBlockProps = z.infer<typeof AboutBlockPropsSchema>;

// ==========================
// AboutBlock - Блок "О нас"
// ==========================
export const AboutBlockSchema = z.object({
  type: z.literal("about"),
  menuName: z.string().optional(),
  props: AboutBlockPropsSchema,
});

export type AboutBlock = z.infer<typeof AboutBlockSchema>;

// ==========================
//  RequestedProduct - отдельный продукт из списка спрашиваемых
// ==========================
export const RequestedProductSchema = z.object({
  // Название продукта
  name: z.string(),
  // Имя файла с изображением продукта
  imageName: z.string(),
  // Цена продукта
  price: z.number(),
});

export type RequestedProduct = z.infer<typeof RequestedProductSchema>;

// ==========================
// ProductBlockProps - параметры блока (спрашиваемые) "Продукты"
// ==========================
export const ProductBlockPropsSchema = z.object({
  // Заголовок блока (например: "Наши продукты")
  title: z.string(),

  // Список популярных товаров
  products: z.array(RequestedProductSchema),
});

export type ProductBlockProps = z.infer<typeof ProductBlockPropsSchema>;

// ==========================
// ProductsBlock - Блок (спрашиваемые) "Продукты"
// ==========================
export const ProductsBlockSchema = z.object({
  // Тип блока всегда фиксирован как "products"
  type: z.literal("products"),

  // Название меню, может быть опциональным
  menuName: z.string().optional(),

  // Основные параметры блока
  props: ProductBlockPropsSchema,
});

export type ProductsBlock = z.infer<typeof ProductsBlockSchema>;

// ==========================
// SocialItem - общий элемент социальной сети (для контактов и футера)
// ==========================
export const SocialItemSchema = z.object({
  // Название социальной сети
  socialNetwork: z.string(),
  // Адрес
  url: z.string(),
});

export type SocialItem = z.infer<typeof SocialItemSchema>;

// ==========================
// SocialData - общие данные социальных сетей
// ==========================
export const SocialDataSchema = z.array(SocialItemSchema);
export type SocialDataType = z.infer<typeof SocialDataSchema>;

// ==========================
// ContactSocial: Список социальных сетей
// ==========================
export const ContactSocialSchema = z.object({
  // Тип "социальные сети"
  type: z.literal("sociales"),
  // Заголовок
  title: z.string(),
  // Список социальных сетей
  data: SocialDataSchema,
});

export type ContactSocialType = z.infer<typeof ContactSocialSchema>;

// ==========================
// ContactAddress: Адрес, Телефон, время работы
// ==========================
export const ContactAddressSchema = z.object({
  // Тип "адрес"
  type: z.literal("address"),
  // Заголовок
  title: z.string(),
  data: z.array(
    // Просто одна строчка
    z.string(),
  ),
});

export type ContactAddressType = z.infer<typeof ContactAddressSchema>;

// ==========================
// Contact item (union)
// ==========================
export const ContactItemSchema = z.union([
  ContactSocialSchema,
  ContactAddressSchema,
]);

export type ContactItem = z.infer<typeof ContactItemSchema>;

// ==========================
// ContactItemList - список контактных элементов
// ==========================
export const ContactItemListSchema = z.array(ContactItemSchema);
export type ContactItemList = z.infer<typeof ContactItemListSchema>;

// ==========================
// ContactBlockProps - параметры блока "Контакты"
// ==========================
export const ContactBlockPropsSchema = z.object({
  // Заголовок блока (например: "Свяжитесь с нами")
  title: z.string(),

  // Список контактных секций (соцсети, адрес, телефоны, часы работы)
  contactData: ContactItemListSchema,
});

export type ContactBlockProps = z.infer<typeof ContactBlockPropsSchema>;

// ==========================
// ContactColumns - Столбик блока "Контакты"
// ==========================
export const ContactColumnsSchema = z.tuple([
  // Левая колонка (массив элементов контактов)
  ContactItemListSchema,
  // Правая колонка (массив элементов контактов)
  ContactItemListSchema,
]);

export type ContactColumns = z.infer<typeof ContactColumnsSchema>;

// ==========================
// ContactBlock - Блок "Контакты"
// ==========================
export const ContactBlockSchema = z.object({
  // Тип блока всегда фиксирован как "contact"
  type: z.literal("contact"),

  // Название меню, может быть опциональным
  menuName: z.string().optional(),

  // Основные параметры блока
  props: ContactBlockPropsSchema,
});

export type ContactBlock = z.infer<typeof ContactBlockSchema>;

// ==========================
// FooterSocialSection - секция социальных сетей
// ==========================
export const FooterSocialSectionSchema = z.object({
  title: z.string(),
  data: SocialDataSchema, // ← Используем общую схему
});

export type FooterSocialSection = z.infer<typeof FooterSocialSectionSchema>;

// ==========================
// FooterPaymentItem - элемент способа оплаты в футере
// ==========================
export const FooterPaymentItemSchema = z.object({
  paymentMethod: z.string(),
});

// ==========================
// PaymentData - общие данные способов оплаты
// ==========================
export const PaymentDataSchema = z.array(FooterPaymentItemSchema);
export type PaymentDataType = z.infer<typeof PaymentDataSchema>;

// ==========================
// FooterPaymentSection - секция способов оплаты
// ==========================
export const FooterPaymentSectionSchema = z.object({
  title: z.string(),
  data: PaymentDataSchema, // ← Используем общую схему
});

export type FooterPaymentSection = z.infer<typeof FooterPaymentSectionSchema>;

// ==========================
// FooterBlockProps - параметры блока футера
// ==========================
export const FooterBlockPropsSchema = z.object({
  social: FooterSocialSectionSchema,
  payment: FooterPaymentSectionSchema,
});

export type FooterBlockPropsType = z.infer<typeof FooterBlockPropsSchema>;

// ==========================
// FooterBlock - Блок подвала сайта
// ==========================
export const FooterBlockSchema = z.object({
  type: z.literal("footer"),
  props: FooterBlockPropsSchema,
});

export type FooterBlockType = z.infer<typeof FooterBlockSchema>;

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
