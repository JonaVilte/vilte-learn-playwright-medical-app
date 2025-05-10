// global-setup.ts
import { prisma } from '../../lib/prisma';

async function globalSetup() {
  console.log('🧪 Ejecutando globalSetup: Inicializando entorno de pruebas...');

  // 1. Limpiar base de datos
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.specialty.deleteMany();
  await prisma.user.deleteMany();

  // 2. Insertar especialidades
  const specialties = await prisma.specialty.createMany({
    data: [
      { id: "dermatologia", name: "Dermatología" },
      { id: "cardiologia", name: "Cardiología" },
      { id: "pediatria", name: "Pediatría" },
      { id: "traumatologia", name: "Traumatología" },
    ],
  });

  // 3. Insertar doctores
  await prisma.doctor.createMany({
    data: [
      { id: "doc1", name: "María García", specialtyId: "dermatologia" },
      { id: "doc2", name: "Juan Pérez", specialtyId: "cardiologia" },
      { id: "doc3", name: "Ana Rodríguez", specialtyId: "pediatria" },
      { id: "doc4", name: "Carlos López", specialtyId: "traumatologia" },
    ],
  });

  // 4. Insertar usuario de prueba
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "testuser@example.com",
      phone: "123456789",
      password: "test1234", // ⚠️ En producción, esta contraseña debe estar hasheada
    },
  });

  // 5. Insertar cita de prueba
  await prisma.appointment.create({
    data: {
      userId: user.id,
      doctorId: "doc1",
      date: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 días después
      time: "09:00",
    },
  });

  console.log('✅ Entorno de prueba inicializado correctamente.');
}

export default globalSetup;
