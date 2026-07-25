import { pgTable, uuid, text, integer, boolean, timestamp, unique } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default(""),
  imageUrls: text("image_urls").array().notNull().default([]),
  formatOptions: text("format_options"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const faqItems = pgTable("faq_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactInfo = pgTable(
  "contact_info",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    whatsappNumber: text("whatsapp_number").notNull(),
    email: text("email").notNull(),
    instagramHandle: text("instagram_handle").notNull(),
    shopeeUrl: text("shopee_url").notNull(),
    singleton: boolean("singleton").notNull().default(true),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    singletonUnique: unique("contact_info_singleton_unique").on(table.singleton),
  })
);
