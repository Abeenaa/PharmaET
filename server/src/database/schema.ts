import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  enum as pgEnum,
  decimal,
  integer,
  date,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'SUPER_ADMIN',
  'BRANCH_ADMIN',
  'PHARMACIST',
  'CASHIER',
]);

export const batchStatusEnum = pgEnum('batch_status', [
  'ACTIVE',
  'EXPIRING_SOON',
  'EXPIRED',
]);

export const poStatusEnum = pgEnum('po_status', [
  'DRAFT',
  'PENDING',
  'RECEIVED',
  'CANCELLED',
]);

export const grnStatusEnum = pgEnum('grn_status', [
  'DRAFT',
  'FINALIZED',
]);

export const adjustmentReasonEnum = pgEnum('adjustment_reason', [
  'DAMAGE',
  'LOSS',
  'EXPIRED',
  'CORRECTION',
]);

export const alertTypeEnum = pgEnum('alert_type', [
  'LOW_STOCK',
  'EXPIRING_SOON',
  'EXPIRED',
]);

export const auditActionEnum = pgEnum('audit_action', [
  'CREATE',
  'UPDATE',
  'DELETE',
]);

// Tables

export const branches = pgTable(
  'branches',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    license_number: varchar('license_number', { length: 255 }).notNull().unique(),
    contact_phone: varchar('contact_phone', { length: 20 }),
    contact_email: varchar('contact_email', { length: 255 }),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      license_idx: index('branches_license_idx').on(table.license_number),
      active_idx: index('branches_active_idx').on(table.is_active),
    };
  },
);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    branch_id: uuid('branch_id').references(() => branches.id),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password_hash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    role: userRoleEnum('role').notNull(),
    is_active: boolean('is_active').notNull().default(true),
    requires_password_change: boolean('requires_password_change').notNull().default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      email_idx: index('users_email_idx').on(table.email),
      branch_idx: index('users_branch_idx').on(table.branch_id),
      active_idx: index('users_active_idx').on(table.is_active),
    };
  },
);

export const token_blacklist = pgTable(
  'token_blacklist',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    token: text('token').notNull().unique(),
    expires_at: timestamp('expires_at').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      expires_idx: index('token_blacklist_expires_idx').on(table.expires_at),
    };
  },
);

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      active_idx: index('categories_active_idx').on(table.is_active),
    };
  },
);

export const medicines = pgTable(
  'medicines',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sku: varchar('sku', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    generic_name: varchar('generic_name', { length: 255 }).notNull(),
    strength: varchar('strength', { length: 100 }),
    form: varchar('form', { length: 100 }),
    barcode: varchar('barcode', { length: 255 }).notNull().unique(),
    category_id: uuid('category_id').notNull().references(() => categories.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      barcode_idx: index('medicines_barcode_idx').on(table.barcode),
      sku_idx: index('medicines_sku_idx').on(table.sku),
      category_idx: index('medicines_category_idx').on(table.category_id),
    };
  },
);

export const medicine_batches = pgTable(
  'medicine_batches',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    medicine_id: uuid('medicine_id').notNull().references(() => medicines.id),
    batch_number: varchar('batch_number', { length: 255 }).notNull(),
    quantity: integer('quantity').notNull().default(0),
    expiry_date: date('expiry_date').notNull(),
    status: batchStatusEnum('status').notNull().default('ACTIVE'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      medicine_idx: index('medicine_batches_medicine_idx').on(table.medicine_id),
      expiry_idx: index('medicine_batches_expiry_idx').on(table.expiry_date),
      status_idx: index('medicine_batches_status_idx').on(table.status),
    };
  },
);

export const suppliers = pgTable(
  'suppliers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    contact_person: varchar('contact_person', { length: 255 }),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    address: text('address'),
    is_active: boolean('is_active').notNull().default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      active_idx: index('suppliers_active_idx').on(table.is_active),
    };
  },
);

export const purchase_orders = pgTable(
  'purchase_orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    po_number: varchar('po_number', { length: 255 }).notNull().unique(),
    supplier_id: uuid('supplier_id').notNull().references(() => suppliers.id),
    branch_id: uuid('branch_id').notNull().references(() => branches.id),
    status: poStatusEnum('status').notNull().default('DRAFT'),
    created_by: uuid('created_by').notNull().references(() => users.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      po_number_idx: index('purchase_orders_po_number_idx').on(table.po_number),
      supplier_idx: index('purchase_orders_supplier_idx').on(table.supplier_id),
      branch_idx: index('purchase_orders_branch_idx').on(table.branch_id),
      status_idx: index('purchase_orders_status_idx').on(table.status),
    };
  },
);

export const po_items = pgTable(
  'po_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    po_id: uuid('po_id').notNull().references(() => purchase_orders.id),
    medicine_id: uuid('medicine_id').notNull().references(() => medicines.id),
    quantity_ordered: integer('quantity_ordered').notNull(),
    quantity_received: integer('quantity_received').notNull().default(0),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      po_idx: index('po_items_po_idx').on(table.po_id),
      medicine_idx: index('po_items_medicine_idx').on(table.medicine_id),
    };
  },
);

export const grns = pgTable(
  'grns',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    grn_number: varchar('grn_number', { length: 255 }).notNull().unique(),
    po_id: uuid('po_id').notNull().references(() => purchase_orders.id),
    branch_id: uuid('branch_id').notNull().references(() => branches.id),
    status: grnStatusEnum('status').notNull().default('DRAFT'),
    received_by: uuid('received_by').notNull().references(() => users.id),
    received_at: timestamp('received_at'),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      grn_number_idx: index('grns_grn_number_idx').on(table.grn_number),
      po_idx: index('grns_po_idx').on(table.po_id),
      branch_idx: index('grns_branch_idx').on(table.branch_id),
      status_idx: index('grns_status_idx').on(table.status),
    };
  },
);

export const grn_items = pgTable(
  'grn_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    grn_id: uuid('grn_id').notNull().references(() => grns.id),
    po_item_id: uuid('po_item_id').notNull().references(() => po_items.id),
    quantity_received: integer('quantity_received').notNull(),
    batch_number: varchar('batch_number', { length: 255 }).notNull(),
    expiry_date: date('expiry_date').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      grn_idx: index('grn_items_grn_idx').on(table.grn_id),
      po_item_idx: index('grn_items_po_item_idx').on(table.po_item_id),
    };
  },
);

export const sales = pgTable(
  'sales',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    transaction_id: varchar('transaction_id', { length: 255 }).notNull().unique(),
    branch_id: uuid('branch_id').notNull().references(() => branches.id),
    cashier_id: uuid('cashier_id').notNull().references(() => users.id),
    total_amount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      transaction_idx: index('sales_transaction_idx').on(table.transaction_id),
      branch_idx: index('sales_branch_idx').on(table.branch_id),
      cashier_idx: index('sales_cashier_idx').on(table.cashier_id),
      created_idx: index('sales_created_idx').on(table.created_at),
    };
  },
);

export const sale_items = pgTable(
  'sale_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sale_id: uuid('sale_id').notNull().references(() => sales.id),
    medicine_id: uuid('medicine_id').notNull().references(() => medicines.id),
    batch_id: uuid('batch_id').notNull().references(() => medicine_batches.id),
    quantity: integer('quantity').notNull(),
    unit_price: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      sale_idx: index('sale_items_sale_idx').on(table.sale_id),
      medicine_idx: index('sale_items_medicine_idx').on(table.medicine_id),
    };
  },
);

export const stock_adjustments = pgTable(
  'stock_adjustments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    medicine_id: uuid('medicine_id').notNull().references(() => medicines.id),
    branch_id: uuid('branch_id').notNull().references(() => branches.id),
    reason: adjustmentReasonEnum('reason').notNull(),
    quantity_change: integer('quantity_change').notNull(),
    performed_by: uuid('performed_by').notNull().references(() => users.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      medicine_idx: index('stock_adjustments_medicine_idx').on(table.medicine_id),
      branch_idx: index('stock_adjustments_branch_idx').on(table.branch_id),
      created_idx: index('stock_adjustments_created_idx').on(table.created_at),
    };
  },
);

export const alerts = pgTable(
  'alerts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    branch_id: uuid('branch_id').notNull().references(() => branches.id),
    medicine_id: uuid('medicine_id').notNull().references(() => medicines.id),
    alert_type: alertTypeEnum('alert_type').notNull(),
    is_read: boolean('is_read').notNull().default(false),
    acknowledged_by: uuid('acknowledged_by').references(() => users.id),
    acknowledged_at: timestamp('acknowledged_at'),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      branch_idx: index('alerts_branch_idx').on(table.branch_id),
      medicine_idx: index('alerts_medicine_idx').on(table.medicine_id),
      type_idx: index('alerts_type_idx').on(table.alert_type),
      read_idx: index('alerts_read_idx').on(table.is_read),
    };
  },
);

export const audit_logs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    entity_type: varchar('entity_type', { length: 255 }).notNull(),
    entity_id: uuid('entity_id').notNull(),
    action: auditActionEnum('action').notNull(),
    old_values: jsonb('old_values'),
    new_values: jsonb('new_values'),
    performed_by: uuid('performed_by').notNull().references(() => users.id),
    branch_id: uuid('branch_id').references(() => branches.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => {
    return {
      entity_idx: index('audit_logs_entity_idx').on(table.entity_type, table.entity_id),
      user_idx: index('audit_logs_user_idx').on(table.performed_by),
      branch_idx: index('audit_logs_branch_idx').on(table.branch_id),
      created_idx: index('audit_logs_created_idx').on(table.created_at),
    };
  },
);

export const offline_pending_sync = pgTable(
  'offline_pending_sync',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    entity_type: varchar('entity_type', { length: 255 }).notNull(),
    entity_id: uuid('entity_id'),
    action: auditActionEnum('action').notNull(),
    payload: jsonb('payload').notNull(),
    status: varchar('status', { length: 50 }).notNull().default('PENDING'),
    error_message: text('error_message'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    synced_at: timestamp('synced_at'),
  },
  (table) => {
    return {
      status_idx: index('offline_pending_sync_status_idx').on(table.status),
      created_idx: index('offline_pending_sync_created_idx').on(table.created_at),
    };
  },
);
