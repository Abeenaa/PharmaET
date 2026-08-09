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

  console.log('✓ Branch created:', branch1.id);

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
