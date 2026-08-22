/**
 * API Response Types
 * Shared interfaces with backend
 */

export type UserRole = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'PHARMACIST' | 'CASHIER';

export type BatchStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';

export type POStatus = 'DRAFT' | 'PENDING' | 'RECEIVED' | 'CANCELLED';

export type GRNStatus = 'DRAFT' | 'FINALIZED';

export type AlertType = 'LOW_STOCK' | 'EXPIRING_SOON' | 'EXPIRED';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  branch_id?: string;
  is_active: boolean;
  requires_password_change: boolean;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  license_number: string;
  contact_phone?: string;
  contact_email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  _count?: { medicines: number };
  created_at: string;
  updated_at: string;
}

export interface Medicine {
  id: string;
  sku: string;
  name: string;
  generic_name: string;
  strength: string;
  form: string;
  barcode: string;
  category_id: string;
  category?: Category;
  total_stock?: number;
  batches?: MedicineBatch[];
  created_at: string;
  updated_at: string;
}

export interface MedicineBatch {
  id: string;
  medicine_id: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  status: BatchStatus;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier?: Supplier;
  branch_id: string;
  status: POStatus;
  created_by: string;
  po_items?: PurchaseOrderItem[];
  created_user?: User;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  po_id: string;
  medicine_id: string;
  medicine?: Medicine;
  quantity_ordered: number;
  quantity_received: number;
  created_at: string;
}

export interface GRN {
  id: string;
  grn_number: string;
  po_id: string;
  purchase_order?: PurchaseOrder;
  branch_id: string;
  status: GRNStatus;
  received_by: string;
  received_at?: string;
  grn_items?: GRNItem[];
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface GRNItem {
  id: string;
  grn_id: string;
  po_item_id: string;
  quantity_received: number;
  batch_number: string;
  expiry_date: string;
  created_at: string;
}

export interface Sale {
  id: string;
  transaction_id: string;
  branch_id: string;
  cashier_id: string;
  cashier?: User;
  total_amount: number;
  sale_items?: SaleItem[];
  branch?: Branch;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  medicine_id: string;
  medicine?: Medicine;
  batch_id: string;
  batch?: MedicineBatch;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface StockAdjustment {
  id: string;
  medicine_id: string;
  medicine?: Medicine;
  branch_id: string;
  reason: 'DAMAGE' | 'LOSS' | 'EXPIRED' | 'CORRECTION';
  quantity_change: number;
  performed_by: string;
  user?: User;
  created_at: string;
}

export interface Alert {
  id: string;
  medicine_id: string;
  medicine?: Medicine;
  branch_id: string;
  alert_type: AlertType;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  date: string;
  total_sales: number;
  transaction_count: number;
  top_selling_medicines: Array<Medicine & { quantity_sold: number }>;
}

export interface InventoryStatus {
  total_medicines: number;
  low_stock_count: number;
  expiring_soon_count: number;
  expired_count: number;
  stock_by_category: Record<string, number>;
}

export interface DashboardAlerts {
  low_stock_alerts: Alert[];
  expiring_soon_alerts: Alert[];
}

export interface SalesReport {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_revenue: number;
    transaction_count: number;
    avg_transaction_value: number;
  };
  medicine_details: Array<{
    medicine_id: string;
    medicine_name: string;
    category_name: string;
    quantity_sold: number;
    revenue: number;
    transactions: number;
  }>;
}

export interface InventoryReport {
  report_date: string;
  total_medicines: number;
  total_stock: number;
  items: Array<{
    medicine_id: string;
    medicine_name: string;
    sku: string;
    barcode: string;
    category_name: string;
    total_stock: number;
    batch_count: number;
    batch_details: {
      active: { count: number; total_quantity: number };
      expiring_soon: { count: number; total_quantity: number };
      expired: { count: number; total_quantity: number };
    };
    batches: MedicineBatch[];
  }>;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}

export interface PendingOperation {
  id: string;
  type: 'SALE' | 'ADJUSTMENT';
  data: Sale | StockAdjustment;
  created_at: string;
  status: 'PENDING' | 'FAILED';
  error?: string;
}

export interface SyncConflict {
  id: string;
  operation: PendingOperation;
  serverData: any;
  conflict_type: 'STOCK_UNAVAILABLE' | 'DUPLICATE' | 'EXPIRED';
  created_at: string;
}
