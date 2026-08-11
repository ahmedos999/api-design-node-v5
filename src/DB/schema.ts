import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),

  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userid').references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),

  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  frequancy: varchar('frequency', { length: 255 }).notNull(),
  targetCount: integer('targe_count').default(1),
  isActive: boolean('is_active').default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const entries = pgTable('entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),

  completionDate: timestamp('completion_date').defaultNow().notNull(),
  note: text('note'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),

  color: varchar('color', { length: 7 }).default('#6d7280'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const habitsTags = pgTable('habit_tags', {
  id: uuid('id').primaryKey().defaultRandom(),

  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),

  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const userRelation = relations(users, ({ many }) => ({
  habits: many(habits),
}))

export const habitsRelation = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  entries: many(entries),
  habitTags: many(habitsTags),
}))

export const entriesRelation = relations(entries, ({ one }) => ({
  habits: one(habits, {
    fields: [entries.habitId],
    references: [habits.id],
  }),
}))

export const tagsRelation = relations(tags, ({ many }) => ({
  habitTags: many(habitsTags),
}))

export const habitsTagsRelation = relations(habitsTags, ({ one }) => ({
  habits: one(habits, {
    fields: [habitsTags.habitId],
    references: [habits.id],
  }),
  tags: one(tags, {
    fields: [habitsTags.tagId],
    references: [tags.id],
  }),
}))

// For compile time validtion
export type User = typeof users.$inferSelect
export type Habit = typeof habits.$inferSelect
export type Entry = typeof entries.$inferSelect
export type Tag = typeof tags.$inferSelect
export type HabitTag = typeof habitsTags.$inferSelect

// Zod for runtime validation
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export const insertHabitSchema = createInsertSchema(habits)
export const selectHabitSchema = createSelectSchema(habits)

export const insertEntrySchema = createInsertSchema(entries)
export const selectEntrySchema = createSelectSchema(entries)

export const insertTagSchema = createInsertSchema(tags)
export const selectTagSchema = createSelectSchema(tags)

export const insertHabitTagSchema = createInsertSchema(habitsTags)
export const selectHabitTagSchema = createSelectSchema(habitsTags)
