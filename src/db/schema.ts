import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  date,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const motorcycleStatusEnum = pgEnum('motorcycle_status', [
  'in_transit',
  'delayed',
  'arrived',
])

export const motorcycles = pgTable('motorcycles', {
  id: uuid('id').defaultRandom().primaryKey(),
  model: text('model').notNull(),
  chassis: text('chassis').notNull().unique(),
  estimatedArrival: date('estimated_arrival'),
  status: motorcycleStatusEnum('status').notNull().default('in_transit'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
})

export type Motorcycle = InferSelectModel<typeof motorcycles>
export type NewMotorcycle = InferInsertModel<typeof motorcycles>
