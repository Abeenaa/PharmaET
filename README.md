# PharmaET - Multi-Branch Pharmacy Management System

A comprehensive offline-first Progressive Web App (PWA) designed to streamline pharmacy operations across multiple branches with FEFO (First Expiring, First Out) inventory management.

## Project Structure

```
PharmaET/
├── server/              # NestJS backend API
├── client/              # React frontend PWA
├── packages/shared/     # Shared TypeScript types
└── .kiro/specs/         # Project specifications
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 14+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment files:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Configure your database URL in `server/.env`

### Development

Start the backend:
```bash
npm run dev:server
```

Start the frontend (in another terminal):
```bash
npm run dev:client
```

The app will be available at `http://localhost:5173`

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

## Architecture

- **Backend**: NestJS + Drizzle ORM + PostgreSQL
- **Frontend**: React 18 + TanStack Query + Vite
- **State Management**: Zustand (local) + TanStack Query (server)
- **Offline**: IndexedDB + Background Sync
- **Styling**: Tailwind CSS

## Features

✓ Multi-branch management  
✓ Role-based access control (RBAC)  
✓ FEFO inventory enforcement  
✓ Point-of-sale (POS) system  
✓ Offline-first PWA  
✓ Real-time dashboard  
✓ Comprehensive reporting  
✓ Audit trails  

## Documentation

- [Requirements](./pharmaET/.kiro/specs/pharmaet-mvp/requirements.md)
- [Design](./pharmaET/.kiro/specs/pharmaet-mvp/design.md)
- [Implementation Plan](./pharmaET/.kiro/specs/pharmaet-mvp/tasks.md)

## License

UNLICENSED
