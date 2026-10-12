import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("buildnest@2024", 10);

  await prisma.users.upsert({
    where: { Username: "admin" },
    update: {},
    create: {
      Username: "admin",
      Password: hashedPassword,
      Role: "admin",
    },
  });

  console.log("✅ Admin user created: admin / buildnest@2024");
  console.log("ℹ️  Import the SQL file to populate all construction data:");
  console.log("   mysql -u root -p ConstructionWorkerManagement < 'BuildNest- Where Owners and Workers Meet.sql'");
  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
