# PharmaET Frontend - Strategy & Architecture

## Table of Contents
1. [Landing Page Strategy](#landing-page-strategy)
2. [Frontend Application Architecture](#frontend-application-architecture)
3. [Feature Implementation Plan](#feature-implementation-plan)
4. [State Management](#state-management)
5. [Component Structure](#component-structure)
6. [Offline-First Implementation](#offline-first-implementation)
7. [UI/UX Design System](#uiux-design-system)
8. [Development Roadmap](#development-roadmap)

---

## Landing Page Strategy

### Landing Page Purpose
- **Primary Goal**: Sell the system to pharmacy managers/owners
- **Secondary Goal**: Drive login for existing users
- **Tertiary Goal**: Build credibility and trust

### Landing Page Structure

#### Hero Section
```
Headline: "Pharmacy Management Made Simple"
Subheadline: "FEFO-compliant inventory, multi-branch operations, offline-first POS"
CTA Button: "Get Started" (green #10B981)
Background: Gradient (emerald to sky blue)
Hero Image: Dashboard mockup or pharmacy illustration
```

#### Problem Section (Pain Points)
```
3-Column Layout:
├─ Expired Medicine Waste
│  Icon: ⏱️ 
│  Problem: "Lose 15-20% of revenue to expired stock waste"
│  Solution: "PharmaET enforces FEFO automatically"
│
├─ Slow Checkout Process
│  Icon: 🛒
│  Problem: "Manual POS slows operations and causes errors"
│  Solution: "Barcode scanning + FEFO = 3x faster"
│
└─ Multi-Branch Chaos
   Icon: 🏢
   Problem: "No visibility across branches"
   Solution: "Real-time dashboard for all locations"
```

#### Features Section (Key Capabilities)
```
Grid Layout (2x3):
├─ FEFO Enforcement
├─ Offline-First PWA
├─ Multi-Branch Management
├─ Real-time Dashboard
├─ Comprehensive Reporting
└─ Automatic Sync

Each card: Icon + Title + 2-line description
```

#### Benefits Section (ROI)
```
Highlight cards:
├─ Reduce Waste by 25%
├─ Increase Efficiency by 40%
├─ Improve Accuracy to 99%
└─ Support Unlimited Branches
```

#### Pricing Section (if applicable)
```
Simple card:
├─ "Coming Soon" or flat rate
├─ Subscription model
└─ Contact sales CTA
```

#### Testimonials Section (After MVP)
```
3-card layout with pharmacy manager quotes
```

#### Footer
```
├─ Quick Links
├─ Legal (Terms, Privacy, Security)
├─ Contact Information
├─ Social Links
└─ Copyright
```

---

## Frontend Application Architecture

### High-Level Structure

```
PharmaET Client/
├── public/
│   ├── index.html
│   ├── manifest.json (PWA metadata)
│   └── icons/ (192x192, 512x512)
│
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── POSPage.tsx
│   │   ├── InventoryPage.tsx
│   │   ├── PurchaseOrdersPage.tsx
│   │   ├── GRNPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx (with sync indicator)
│   │   │   ├── Sidebar.tsx (role-based nav)
│   │   │   ├── Footer.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── OfflineBanner.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── SalesMetrics.tsx
│   │   │   ├── InventoryStatus.tsx
│   │   │   ├── TopMedicines.tsx
│   │   │   ├── AlertsWidget.tsx
│   │   │   └── DateRangeFilter.tsx
│   │   │
│   │   ├── pos/
│   │   │   ├── MedicineSearch.tsx (barcode scanner)
│   │   │   ├── ShoppingCart.tsx
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── ReceiptPreview.tsx
│   │   │   └── BarcodeScanner.tsx
│   │   │
│   │   ├── inventory/
│   │   │   ├── MedicineTable.tsx
│   │   │   ├── BatchDetails.tsx
│   │   │   ├── StockAdjustmentForm.tsx
│   │   │   └── ExpiryAlert.tsx
│   │   │
│   │   ├── purchase-orders/
│   │   │   ├── POList.tsx
│   │   │   ├── POForm.tsx
│   │   │   ├── POItemsTable.tsx
│   │   │   └── POStatusBadge.tsx
│   │   │
│   │   ├── grn/
│   │   │   ├── GRNList.tsx
│   │   │   ├── GRNForm.tsx
│   │   │   ├── GRNItemsTable.tsx
│   │   │   └── BatchReceiptForm.tsx
│   │   │
│   │   ├── reports/
│   │   │   ├── SalesReport.tsx
│   │   │   ├── InventoryReport.tsx
│   │   │   ├── ReportFilters.tsx
│   │   │   └── ExportButton.tsx
│   │   │
│   │   └── forms/
│   │       ├── LoginForm.tsx
│   │       ├── UserForm.tsx
│   │       ├── MedicineForm.tsx
│   │       ├── SupplierForm.tsx
│   │       └── BranchForm.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts (authentication context)
│   │   ├── useSales.ts (sales operations)
│   │   ├── useMedicines.ts (medicine management)
│   │   ├── useOfflineSync.ts (offline queue)
│   │   ├── useNotifications.ts (alerts)
│   │   └── useApi.ts (API call wrapper)
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── auth.service.ts
│   │   │   ├── medicines.service.ts
│   │   │   ├── sales.service.ts
│   │   │   ├── purchases.service.ts
│   │   │   ├── grn.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── reports.service.ts
│   │   │   └── sync.service.ts
│   │   │
│   │   ├── offline/
│   │   │   ├── indexeddb.service.ts (IndexedDB wrapper)
│   │   │   ├── offlineQueue.service.ts (pending operations)
│   │   │   ├── syncEngine.service.ts (reconciliation)
│   │   │   └── cacheManager.service.ts
│   │   │
│   │   ├── barcode/
│   │   │   ├── barcodeScanner.service.ts
│   │   │   └── barcodeValidator.service.ts
│   │   │
│   │   └── printer/
│   │       └── receiptPrinter.service.ts
│   │
│   ├── store/
│   │   ├── auth.store.ts (Zustand - user/token)
│   │   ├── offline.store.ts (Zustand - sync status)
│   │   ├── ui.store.ts (Zustand - modals, sidebar)
│   │   └── notifications.store.ts (Zustand - alerts)
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── theme.css (color variables)
│   │   └── animations.css
│   │
│   ├── types/
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── domain.types.ts
│   │   └── ui.types.ts
│   │
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── formatters.ts (currency, date)
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts (protected routes)
│   │   ├── errorHandler.middleware.ts
│   │   └── logger.middleware.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── serviceWorker.ts (PWA offline)
│   └── vite-env.d.ts
│
├── .env.example
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

---

## Feature Implementation Plan

### Phase 1: Foundation (Weeks 1-2)
- ✅ Project scaffolding with Vite + React 18
- ✅ Tailwind CSS setup with brand colors
- ✅ Landing page (public, no auth required)
- ✅ Login/logout flow
- ✅ Protected route guards
- ✅ API service layer setup
- ✅ Error handling & loading states
- ✅ Responsive mobile layout

### Phase 2: Core Dashboard (Weeks 3-4)
- ✅ Dashboard page with real-time metrics
- ✅ Sales summary cards
- ✅ Inventory status overview
- ✅ Active alerts display
- ✅ Date range filtering
- ✅ Role-based navigation sidebar
- ✅ User profile & settings dropdown

### Phase 3: POS System (Weeks 5-6)
- ✅ Barcode scanner integration
- ✅ Medicine search (name/SKU/barcode)
- ✅ Shopping cart with add/remove/quantity
- ✅ FEFO batch display
- ✅ Stock availability validation
- ✅ Checkout form
- ✅ Receipt preview & print
- ✅ Offline POS queue

### Phase 4: Inventory Management (Weeks 7-8)
- ✅ Medicine list with search/filter
- ✅ Medicine detail page
- ✅ Batch status display (ACTIVE/EXPIRING/EXPIRED)
- ✅ Stock adjustment form
- ✅ Expiry alerts & warnings
- ✅ Bulk operations (import from CSV)
- ✅ Medicine archive/deactivate

### Phase 5: Purchase & GRN (Weeks 9-10)
- ✅ Purchase order creation form
- ✅ PO list with status filtering
- ✅ GRN creation & item entry
- ✅ Batch receipt form
- ✅ GRN finalization workflow
- ✅ PO item reconciliation
- ✅ Print PO/GRN documents

### Phase 6: Reports & Analytics (Weeks 11-12)
- ✅ Sales report generation
- ✅ Inventory report with batch details
- ✅ Export to CSV/PDF
- ✅ Date range filtering
- ✅ Category/medicine filtering
- ✅ Charts & visualizations
- ✅ Report scheduling (if time permits)

### Phase 7: Offline & Sync (Weeks 13-14)
- ✅ IndexedDB setup for local cache
- ✅ Service worker registration
- ✅ Offline mode indicator
- ✅ Offline POS sales queue
- ✅ Background sync on reconnection
- ✅ Conflict detection & resolution
- ✅ Sync status indicator

### Phase 8: Polish & Optimization (Weeks 15-16)
- ✅ Performance optimization
- ✅ Accessibility audit (WCAG AA)
- ✅ Mobile responsiveness testing
- ✅ Error boundary & crash handling
- ✅ Loading skeleton states
- ✅ Toast notifications
- ✅ Animation polish

---

## State Management

### Authentication (Zustand Store)
```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  userRole: UserRole;
}
```

### Offline Sync (Zustand Store)
```typescript
interface OfflineStore {
  isOnline: boolean;
  isSyncing: boolean;
  pendingSalesCount: number;
  pendingAdjustmentsCount: number;
  syncErrors: SyncError[];
  
  setPendingOperations: (ops: PendingOperation[]) => void;
  addPendingSale: (sale: Sale) => void;
  resolveSyncConflict: (conflictId: string, resolution: any) => void;
  clearSyncErrors: () => void;
}
```

### UI State (Zustand Store)
```typescript
interface UIStore {
  isSidebarOpen: boolean;
  activeModal: ModalType | null;
  theme: 'light' | 'dark';
  
  toggleSidebar: () => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

### TanStack Query (Server State)
- Used for API data fetching, caching, and invalidation
- Hooks: `useQuery`, `useMutation`, `useQueryClient`
- Cache invalidation triggers after mutations

---

## Component Structure

### Page Layout Template
```typescript
// pages/DashboardPage.tsx
import Layout from '@/components/common/Layout';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';

export default function DashboardPage() {
  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 bg-pharma-gray-100">
        <Header title="Dashboard" />
        <div className="p-6">
          {/* Page content */}
        </div>
      </main>
    </Layout>
  );
}
```

### Reusable Component Examples

#### Alert Card
```typescript
interface AlertCardProps {
  type: 'low-stock' | 'expiring' | 'expired';
  title: string;
  message: string;
  medicineName: string;
  onDismiss: () => void;
}

export function AlertCard({ type, title, message, medicineName, onDismiss }) {
  const bgColor = {
    'low-stock': 'bg-pharma-amber-50 border-pharma-amber-500',
    'expiring': 'bg-pharma-amber-50 border-pharma-amber-500',
    'expired': 'bg-pharma-red-50 border-pharma-red-500',
  }[type];

  return (
    <div className={`border-l-4 p-4 rounded ${bgColor}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm">{medicineName}</p>
      <p>{message}</p>
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
}
```

#### Status Badge
```typescript
export function StatusBadge({ status, variant = 'default' }) {
  const styles = {
    'ACTIVE': 'bg-pharma-green-100 text-pharma-green-700',
    'EXPIRING_SOON': 'bg-pharma-amber-100 text-pharma-amber-700',
    'EXPIRED': 'bg-pharma-red-100 text-pharma-red-700',
    'DRAFT': 'bg-pharma-gray-100 text-pharma-gray-700',
    'PENDING': 'bg-pharma-blue-100 text-pharma-blue-700',
    'RECEIVED': 'bg-pharma-green-100 text-pharma-green-700',
  }[status];

  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles}`}>{status}</span>;
}
```

---

## Offline-First Implementation

### IndexedDB Schema
```typescript
// Database structure for offline cache
const dbSchema = {
  medicines: 'id, name, barcode',
  categories: 'id',
  suppliers: 'id',
  batches: 'id, medicine_id, expiry_date',
  branches: 'id',
  pendingSales: 'id, created_at',
  pendingAdjustments: 'id, created_at',
  syncLog: 'id, timestamp',
};
```

### Offline Queue Manager
```typescript
// On offline sale:
1. Create sale object locally
2. Store in pending_sales IndexedDB table
3. Add to UI pending queue
4. Show "pending" badge on receipt
5. When online, sync to server
6. On success, remove from pending
7. On conflict, show resolution UI
```

### Service Worker Strategy
```typescript
// Cache first for static assets
// Network first for API calls
// Stale while revalidate for images
```

---

## UI/UX Design System

### Color Palette
```
Primary Green:     #10B981 (brand, CTAs, success)
Secondary Blue:    #0EA5E9 (secondary actions, info)
Alert Red:         #EF4444 (expired, critical)
Warning Amber:     #F59E0B (expiring, caution)
Dark Gray:         #1F2937 (text, main UI)
Light Gray:        #F3F4F6 (backgrounds, borders)
White:             #FFFFFF (card backgrounds)
```

### Typography
```
H1: Poppins Bold 32px (page titles)
H2: Poppins Bold 24px (section headers)
H3: Poppins SemiBold 18px (card titles)
Body: Inter Regular 14px (default text)
Small: Inter Regular 12px (secondary text)
Mono: Fira Code 12px (transaction IDs, barcodes)
```

### Spacing System
```
xs: 4px  (gap between inline elements)
sm: 8px  (small padding)
md: 16px (standard padding)
lg: 24px (section padding)
xl: 32px (large section padding)
```

### Component Shadows
```
Subtle:     box-shadow: 0 1px 3px rgba(0,0,0,0.12)
Elevation:  box-shadow: 0 4px 6px rgba(0,0,0,0.15)
Modal:      box-shadow: 0 20px 25px rgba(0,0,0,0.2)
```

---

## Development Roadmap

### Setup (Day 1)
```bash
npm create vite@latest -- --template react-ts
npm install react-router-dom zustand @tanstack/react-query axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Branch Structure
```
main (production releases)
└── develop (integration branch)
    ├── feature/landing-page
    ├── feature/dashboard
    ├── feature/pos-system
    ├── feature/offline-sync
    └── bugfix/...
```

### Git Workflow
1. Create feature branch from develop
2. Implement feature with commits
3. Create PR with description
4. Request code review
5. Merge to develop
6. Test on staging
7. Deploy to production

### Code Standards
- ESLint + Prettier for code formatting
- TypeScript strict mode
- Components should be under 300 lines
- Custom hooks for complex logic
- Comprehensive error handling
- Accessibility (WCAG AA minimum)
- Mobile-first responsive design

---

## Success Metrics

### Performance
- First contentful paint: < 2s
- Largest contentful paint: < 3s
- Time to interactive: < 4s
- Offline functionality: 100% operational

### User Experience
- Task completion rate: > 95%
- Error rate: < 2%
- User satisfaction: > 4.5/5

### Technical
- Test coverage: > 70%
- Bundle size: < 500KB (gzipped)
- Mobile score: > 90 (Lighthouse)
- Accessibility score: > 95 (Lighthouse)