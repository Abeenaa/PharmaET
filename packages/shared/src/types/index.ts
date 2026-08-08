// User & Auth Types
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  BRANCH_ADMIN = 'BRANCH_ADMIN',
  PHARMACIST = 'PHARMACIST',
  CASHIER = 'CASHIER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  branch_id?: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  location: string;
  license_number: string;
  contact_phone: string;
  contact_email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Medicine Types
export interface Medicine {
  id: string;
  sku: string;
  name: string;
  generic_name: string;
  strength: string;
  form: string;
  barcode: string;
  category_id: string;
  total_stock?: number;
  batches?: Batch[];
  created_at: Date;
  updated_at: Date;
}

// Batch Types
export enum BatchStatus {
  ACTIVE = 'ACTIVE',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED'
}

export interface Batch {
  id: string;
  medicine_id: string;
  batch_number: string;
  quantity: number;
  expiry_date: Date;
  status: BatchStatus;
  created_at: Date;
  updated_at: Date;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Purchase Order Types
export enum POStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  branch_id: string;
  status: POStatus;
  items: POItem[];
  created_at: Date;
  updated_at: Date;
}

export interface POItem {
  id: string;
  po_id: string;
  medicine_id: string;
  quantity_ordered: number;
  quantity_received: number;
  created_at: Date;
}

// GRN Types
export enum GRNStatus {
  DRAFT = 'DRAFT',
  FINALIZED = 'FINALIZED'
}

export interface GRN {
  id: string;
  grn_number: string;
  po_id: string;
  branch_id: string;
  status: GRNStatus;
  items: GRNItem[];
  received_at: Date;
  created_at: Date;
}

export interface GRNItem {
  id: string;
  grn_id: string;
  po_item_id: string;
  quantity_received: number;
  batch_number: string;
  expiry_date: Date;
  created_at: Date;
}

// Sale Types
export interface Sale {
  id: string;
  transaction_id: string;
  branch_id: string;
  cashier_id: string;
  total_amount: number;
  items: SaleItem[];
  created_at: Date;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  medicine_id: string;
  batch_id: string;
  quantity: number;
  unit_price: number;
  created_at: Date;
}

// Stock Adjustment Types
export enum AdjustmentReason {
  DAMAGE = 'DAMAGE',
  LOSS = 'LOSS',
  EXPIRED = 'EXPIRED',
  CORRECTION = 'CORRECTION'
}

export interface StockAdjustment {
  id: string;
  medicine_id: string;
  branch_id: string;
  reason: AdjustmentReason;
  quantity_change: number;
  performed_by: string;
  created_at: Date;
}

// Alert Types
export enum AlertType {
  LOW_STOCK = 'LOW_STOCK',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED'
}

export interface Alert {
  id: string;
  branch_id: string;
  medicine_id: string;
  alert_type: AlertType;
  is_read: boolean;
  acknowledged_by?: string;
  acknowledged_at?: Date;
  created_at: Date;
}

// Dashboard Types
export interface DashboardSummary {
  today_sales_total: number;
  transaction_count: number;
  top_medicines: TopMedicine[];
  inventory_status: InventoryStatus;
  active_alerts: Alert[];
}

export interface TopMedicine {
  medicine_id: string;
  name: string;
  quantity_sold: number;
  revenue: number;
}

export interface InventoryStatus {
  total_medicines: number;
  low_stock_count: number;
  expiring_soon_count: number;
  expired_count: number;
  by_category: CategoryStock[];
}

export interface CategoryStock {
  category_id: string;
  category_name: string;
  total_stock: number;
  medicine_count: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
