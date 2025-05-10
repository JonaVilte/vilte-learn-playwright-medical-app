// global-teardown.ts
import { prisma } from '../../lib/prisma';

async function globalTeardown() {
  console.log('🧹 Ejecutando globalTeardown: Limpiando entorno de pruebas...');

  // Eliminar citas, doctores, especialidades y usuarios
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.specialty.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Datos de prueba eliminados correctamente.');
}

export default globalTeardown;
