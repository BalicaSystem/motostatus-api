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

export const registrationStatusEnum = pgEnum('registration_status', [
  'without_registration',
  'registering',
  'registered',
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

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  document: text('document').notNull().unique(),
  city: text('city').notNull(),
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

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id),
  seller: text('seller').notNull(),
  billingDate: date('billing_date'),
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

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, {
      onDelete: 'cascade',
    }),
  motorcycleId: uuid('motorcycle_id')
    .notNull()
    .references(() => motorcycles.id),
  registrationStatus: registrationStatusEnum('registration_status')
    .notNull()
    .default('without_registration'),
  registrationDate: date('registration_date'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
})

export type Motorcycle = InferSelectModel<typeof motorcycles>
export type NewMotorcycle = InferInsertModel<typeof motorcycles>

export type Customer = InferSelectModel<typeof customers>
export type NewCustomer = InferInsertModel<typeof customers>

export type Order = InferSelectModel<typeof orders>
export type NewOrder = InferInsertModel<typeof orders>

export type OrderItem = InferSelectModel<typeof orderItems>
export type NewOrderItem = InferInsertModel<typeof orderItems>
