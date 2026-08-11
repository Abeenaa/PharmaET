import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create branches
  const branch1 = await prisma.branch.upsert({
    where: { license_number: 'BRANCH-001' },
    update: {},
    create: {
      name: 'Main Branch',
      location: 'Addis Ababa',
      license_number: 'BRANCH-001',
      contact_phone: '+251911111111',
      contact_email: 'main@pharmaet.local',
      is_active: true,
    },
  });

  const branch2 = await prisma.branch.upsert({
    where: { license_number: 'BRANCH-002' },
    update: {},
    create: {
      name: 'Secondary Branch',
      location: 'Dire Dawa',
      license_number: 'BRANCH-002',
      contact_phone: '+251922222222',
      contact_email: 'secondary@pharmaet.local',
      is_active: true,
    },
  });

  console.log('✓ Branches created:', branch1.id, branch2.id);

  // Create Super Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pharmaet.local' },
    update: {},
    create: {
      email: 'admin@pharmaet.local',
      password_hash: hashedPassword,
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      is_active: true,
      requires_password_change: false,
    },
  });

  console.log('✓ Admin user created:', admin.id);

  // Create Branch Manager
  const manager = await prisma.user.upsert({
    where: { email: 'manager@pharmaet.local' },
    update: {},
    create: {
      email: 'manager@pharmaet.local',
      password_hash: hashedPassword,
      name: 'Branch Manager',
      branch_id: branch1.id,
      role: UserRole.BRANCH_ADMIN,
      is_active: true,
      requires_password_change: false,
    },
  });

  console.log('✓ Manager user created:', manager.id);

  // Create Pharmacist
  const pharmacist = await prisma.user.upsert({
    where: { email: 'pharmacist@pharmaet.local' },
    update: {},
    create: {
      email: 'pharmacist@pharmaet.local',
      password_hash: hashedPassword,
      name: 'Pharmacist',
      branch_id: branch1.id,
      role: UserRole.PHARMACIST,
      is_active: true,
      requires_password_change: false,
    },
  });

  console.log('✓ Pharmacist user created:', pharmacist.id);

  // Create Cashier
  const cashier = await prisma.user.upsert({
    where: { email: 'cashier@pharmaet.local' },
    update: {},
    create: {
      email: 'cashier@pharmaet.local',
      password_hash: hashedPassword,
      name: 'Cashier',
      branch_id: branch1.id,
      role: UserRole.CASHIER,
      is_active: true,
      requires_password_change: false,
    },
  });

  console.log('✓ Cashier user created:', cashier.id);

  // Create Branch Manager for second branch
  const manager2 = await prisma.user.upsert({
    where: { email: 'manager2@pharmaet.local' },
    update: {},
    create: {
      email: 'manager2@pharmaet.local',
      password_hash: hashedPassword,
      name: 'Manager Secondary',
      branch_id: branch2.id,
      role: UserRole.BRANCH_ADMIN,
      is_active: true,
      requires_password_change: false,
    },
  });

  console.log('✓ Second branch manager created:', manager2.id);

  // Create categories
  const antibiotic = await prisma.category.upsert({
    where: { id: 'cat-antibiotics' },
    update: {},
    create: {
      id: 'cat-antibiotics',
      name: 'Antibiotics',
      description: 'Antibiotic medicines',
    },
  });

  console.log('✓ Category created:', antibiotic.name);

  // Create suppliers (only if not exists)
  const existingSupplier1 = await prisma.supplier.findFirst({
    where: { email: 'supplier@globalpharma.com' },
  });

  const existingSupplier2 = await prisma.supplier.findFirst({
    where: { email: 'supplier@localdist.com' },
  });

  if (!existingSupplier1) {
    await prisma.supplier.create({
      data: {
        name: 'Global Pharma Ltd',
        contact_person: 'John Supplier',
        email: 'supplier@globalpharma.com',
        phone: '+251911999999',
        address: 'Addis Ababa',
        is_active: true,
      },
    });
  }

  if (!existingSupplier2) {
    await prisma.supplier.create({
      data: {
        name: 'Local Distributors Inc',
        contact_person: 'Jane Distributor',
        email: 'supplier@localdist.com',
        phone: '+251922999999',
        address: 'Dire Dawa',
        is_active: true,
      },
    });
  }

  console.log('✓ Suppliers created');

  console.log('✓  Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('faah Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
