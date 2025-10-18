import { pgTable, serial, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const readings = pgTable('readings', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  aiResult: jsonb('ai_result').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Zod schemas for validation
const aiResponseSchema = z.object({
  expression: z.string(),
  career_prediction: z.string(),
  love_prediction: z.string(),
  general_tip: z.string(),
})

export const insertReadingSchema = createInsertSchema(readings, {
  aiResult: aiResponseSchema,
}).omit({ id: true, createdAt: true })

export const selectReadingSchema = createSelectSchema(readings, {
  aiResult: aiResponseSchema,
})

export type Reading = typeof readings.$inferSelect
export type NewReading = typeof readings.$inferInsert