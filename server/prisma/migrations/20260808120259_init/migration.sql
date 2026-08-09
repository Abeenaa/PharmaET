-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'BRANCH_ADMIN', 'PHARMACIST', 'CASHIER');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('ACTIVE', 'EXPIRING_SOON', 'EXPIRED');

-- CreateEnum
CREATE TYPE "POStatus" AS ENUM ('DRAFT', 'PENDING', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GRNStatus" AS ENUM ('DRAFT', 'FINALIZED');

-- CreateEnum
CREATE TYPE "AdjustmentReason" AS ENUM ('DAMAGE', 'LOSS', 'EXPIRED', 'CORRECTION');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('LOW_STOCK', 'EXPIRING_SOON', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "contact_phone" TEXT,
    "contact_email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "branch_id" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "requires_password_change" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "generic_name" TEXT NOT NULL,
    "strength" TEXT,
    "form" TEXT,
    "barcode" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicineBatch" (
    "id" TEXT NOT NULL,
    "medicine_id" TEXT NOT NULL,
    "batch_number" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicineBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_person" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "po_number" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "status" "POStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POItem" (
    "id" TEXT NOT NULL,
    "po_id" TEXT NOT NULL,
    "medicine_id" TEXT NOT NULL,
    "quantity_ordered" INTEGER NOT NULL,
    "quantity_received" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "POItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GRN" (
    "id" TEXT NOT NULL,
    "grn_number" TEXT NOT NULL,
    "po_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "status" "GRNStatus" NOT NULL DEFAULT 'DRAFT',
    "received_by" TEXT NOT NULL,
    "received_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GRN_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GRNItem" (
    "id" TEXT NOT NULL,
    "grn_id" TEXT NOT NULL,
    "po_item_id" TEXT NOT NULL,
    "quantity_received" INTEGER NOT NULL,
    "batch_number" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GRNItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "cashier_id" TEXT NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "sale_id" TEXT NOT NULL,
    "medicine_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockAdjustment" (
    "id" TEXT NOT NULL,
    "medicine_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "reason" "AdjustmentReason" NOT NULL,
    "quantity_change" INTEGER NOT NULL,
    "performed_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "medicine_id" TEXT NOT NULL,
    "alert_type" "AlertType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged_by" TEXT,
    "acknowledged_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "performed_by" TEXT NOT NULL,
    "branch_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfflinePendingSync" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "action" "AuditAction" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "synced_at" TIMESTAMP(3),

    CONSTRAINT "OfflinePendingSync_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_license_number_key" ON "Branch"("license_number");

-- CreateIndex
CREATE INDEX "Branch_license_number_idx" ON "Branch"("license_number");

-- CreateIndex
CREATE INDEX "Branch_is_active_idx" ON "Branch"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_branch_id_idx" ON "User"("branch_id");

-- CreateIndex
CREATE INDEX "User_is_active_idx" ON "User"("is_active");

-- CreateIndex
CREATE INDEX "Category_is_active_idx" ON "Category"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_sku_key" ON "Medicine"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_barcode_key" ON "Medicine"("barcode");

-- CreateIndex
CREATE INDEX "Medicine_barcode_idx" ON "Medicine"("barcode");

-- CreateIndex
CREATE INDEX "Medicine_sku_idx" ON "Medicine"("sku");

-- CreateIndex
CREATE INDEX "Medicine_category_id_idx" ON "Medicine"("category_id");

-- CreateIndex
CREATE INDEX "MedicineBatch_medicine_id_idx" ON "MedicineBatch"("medicine_id");

-- CreateIndex
CREATE INDEX "MedicineBatch_expiry_date_idx" ON "MedicineBatch"("expiry_date");

-- CreateIndex
CREATE INDEX "MedicineBatch_status_idx" ON "MedicineBatch"("status");

-- CreateIndex
CREATE INDEX "Supplier_is_active_idx" ON "Supplier"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_po_number_key" ON "PurchaseOrder"("po_number");

-- CreateIndex
CREATE INDEX "PurchaseOrder_po_number_idx" ON "PurchaseOrder"("po_number");

-- CreateIndex
CREATE INDEX "PurchaseOrder_supplier_id_idx" ON "PurchaseOrder"("supplier_id");

-- CreateIndex
CREATE INDEX "PurchaseOrder_branch_id_idx" ON "PurchaseOrder"("branch_id");

-- CreateIndex
CREATE INDEX "PurchaseOrder_status_idx" ON "PurchaseOrder"("status");

-- CreateIndex
CREATE INDEX "POItem_po_id_idx" ON "POItem"("po_id");

-- CreateIndex
CREATE INDEX "POItem_medicine_id_idx" ON "POItem"("medicine_id");

-- CreateIndex
CREATE UNIQUE INDEX "GRN_grn_number_key" ON "GRN"("grn_number");

-- CreateIndex
CREATE INDEX "GRN_grn_number_idx" ON "GRN"("grn_number");

-- CreateIndex
CREATE INDEX "GRN_po_id_idx" ON "GRN"("po_id");

-- CreateIndex
CREATE INDEX "GRN_branch_id_idx" ON "GRN"("branch_id");

-- CreateIndex
CREATE INDEX "GRN_status_idx" ON "GRN"("status");

-- CreateIndex
CREATE INDEX "GRNItem_grn_id_idx" ON "GRNItem"("grn_id");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_transaction_id_key" ON "Sale"("transaction_id");

-- CreateIndex
CREATE INDEX "Sale_transaction_id_idx" ON "Sale"("transaction_id");

-- CreateIndex
CREATE INDEX "Sale_branch_id_idx" ON "Sale"("branch_id");

-- CreateIndex
CREATE INDEX "Sale_cashier_id_idx" ON "Sale"("cashier_id");

-- CreateIndex
CREATE INDEX "Sale_created_at_idx" ON "Sale"("created_at");

-- CreateIndex
CREATE INDEX "SaleItem_sale_id_idx" ON "SaleItem"("sale_id");

-- CreateIndex
CREATE INDEX "SaleItem_medicine_id_idx" ON "SaleItem"("medicine_id");

-- CreateIndex
CREATE INDEX "StockAdjustment_medicine_id_idx" ON "StockAdjustment"("medicine_id");

-- CreateIndex
CREATE INDEX "StockAdjustment_branch_id_idx" ON "StockAdjustment"("branch_id");

-- CreateIndex
CREATE INDEX "StockAdjustment_created_at_idx" ON "StockAdjustment"("created_at");

-- CreateIndex
CREATE INDEX "Alert_branch_id_idx" ON "Alert"("branch_id");

-- CreateIndex
CREATE INDEX "Alert_medicine_id_idx" ON "Alert"("medicine_id");

-- CreateIndex
CREATE INDEX "Alert_alert_type_idx" ON "Alert"("alert_type");

-- CreateIndex
CREATE INDEX "Alert_is_read_idx" ON "Alert"("is_read");

-- CreateIndex
CREATE INDEX "AuditLog_entity_type_entity_id_idx" ON "AuditLog"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "AuditLog_performed_by_idx" ON "AuditLog"("performed_by");

-- CreateIndex
CREATE INDEX "AuditLog_branch_id_idx" ON "AuditLog"("branch_id");

-- CreateIndex
CREATE INDEX "AuditLog_created_at_idx" ON "AuditLog"("created_at");

-- CreateIndex
CREATE INDEX "OfflinePendingSync_status_idx" ON "OfflinePendingSync"("status");

-- CreateIndex
CREATE INDEX "OfflinePendingSync_created_at_idx" ON "OfflinePendingSync"("created_at");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineBatch" ADD CONSTRAINT "MedicineBatch_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POItem" ADD CONSTRAINT "POItem_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POItem" ADD CONSTRAINT "POItem_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRN" ADD CONSTRAINT "GRN_received_by_fkey" FOREIGN KEY ("received_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GRNItem" ADD CONSTRAINT "GRNItem_grn_id_fkey" FOREIGN KEY ("grn_id") REFERENCES "GRN"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "MedicineBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustment" ADD CONSTRAINT "StockAdjustment_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustment" ADD CONSTRAINT "StockAdjustment_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAdjustment" ADD CONSTRAINT "StockAdjustment_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
