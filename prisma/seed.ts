// prisma/seed.ts
import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const specialties = [
    { id: "dermatologia", name: "Dermatología" },
    { id: "cardiologia", name: "Cardiología" },
    { id: "pediatria", name: "Pediatría" },
    { id: "traumatologia", name: "Traumatología" },
  ];

  const doctors = [
    { id: "doc1", name: "María García", specialtyId: "dermatologia" },
    { id: "doc2", name: "Juan Pérez", specialtyId: "cardiologia" },
    { id: "doc3", name: "Ana Rodríguez", specialtyId: "pediatria" },
    { id: "doc4", name: "Carlos López", specialtyId: "traumatologia" },
  ];

  // Insert specialties
  for (const specialty of specialties) {
    await prisma.specialty.upsert({
      where: { id: specialty.id },
      update: {},
      create: specialty,
    });
  }

  // Insert doctors
  for (const doctor of doctors) {
    await prisma.doctor.upsert({
      where: { id: doctor.id },
      update: {},
      create: doctor,
    });
  }

  console.log("✅ Datos insertados correctamente");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
