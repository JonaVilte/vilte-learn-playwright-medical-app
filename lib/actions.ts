"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";


// Simulación de base de datos
const users: any[] = [];
const appointments: any[] = [];
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

// Función para generar horarios disponibles (simulación)
async function generateTimeSlots(doctorId: string, date: Date) {
  // Obtener las citas ocupadas desde la base de datos para el doctor en la fecha seleccionada
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)), // Fecha completa, para asegurarse que coincidan solo las de esa fecha
        lt: new Date(date.setHours(23, 59, 59, 999)), // Fecha completa para ese día
      },
    },
  });

  // Extraer los horarios ocupados
  const bookedSlots = appointments.map((a: any) => a.time);

  // Horarios posibles
  const allSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  // Filtrar los horarios ocupados
  return allSlots.filter((slot) => !bookedSlots.includes(slot));
}


// Acciones del servidor
export async function registerUser(userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password, // En producción, debes hashearla con bcrypt
    },
  });

  return { success: true };
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password) {
    throw new Error("Credenciales inválidas");
  }

  (await cookies()).set(
    "session",
    JSON.stringify({
      userId: user.id,
      name: user.name,
      email: user.email,
    })
  );

  return { success: true };
}


export async function logoutUser() {
  (await cookies()).delete("session");
  redirect("/login");
}

export async function getSpecialties() {
  return await prisma.specialty.findMany();
}

export async function getDoctorsBySpecialty(specialtyId: string) {
  return await prisma.doctor.findMany({
    where: { specialtyId },
  });
}

export async function getAvailableTimeSlots(doctorId: string, date: Date) {
  return generateTimeSlots(doctorId, date);
}

export async function createAppointment(data: {
  specialty: string;
  doctorId: string;
  date: Date;
  timeSlot: string;
}) {
  const session = JSON.parse((await cookies()).get("session")?.value || "{}");
  if (!session.userId) {
    throw new Error("No autenticado");
  }

  // Verificar que el usuario no tenga otra cita en el mismo horario
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      userId: session.userId,
      doctorId: data.doctorId,
      date: data.date,
      time: data.timeSlot,
    },
  });

  if (existingAppointment) {
    throw new Error(
      "Ya tienes un turno reservado en este horario. Cancela el turno existente para reservar uno nuevo."
    );
  }

  // Crear la cita en la base de datos
  const appointment = await prisma.appointment.create({
    data: {
      userId: session.userId,
      doctorId: data.doctorId,
      date: data.date,
      time: data.timeSlot,
    },
  });

  revalidatePath("/dashboard");

  return { success: true };
}

export async function getUserAppointments() {
  const session = JSON.parse((await cookies()).get("session")?.value || "{}");
  if (!session.userId) {
    return [];
  }

  return await prisma.appointment.findMany({
    where: {
      userId: session.userId,
    },
    orderBy: {
      date: "asc",  // Ordenar por fecha
    },
    include: {
      doctor: {
        include: {
          specialty: true,
        },
      },
    },
  });
}


export async function cancelAppointment(appointmentId: string) {
  const session = JSON.parse((await cookies()).get("session")?.value || "{}");
  if (!session.userId) {
    throw new Error("No autenticado");
  }

  // Buscar la cita del usuario
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
  });

  if (!appointment) {
    throw new Error("Turno no encontrado");
  }

  if (appointment.userId !== session.userId) {
    throw new Error("No tienes permiso para cancelar este turno");
  }

  const appointmentDateTime = new Date(
    `${appointment.date.toISOString().split("T")[0]}T${appointment.time}`
  );
  const now = new Date();

  const diffInHours = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    throw new Error("No se puede cancelar un turno con menos de 24 horas de anticipación");
  }

  // Eliminar la cita
  await prisma.appointment.delete({
    where: {
      id: appointmentId,
    },
  });

  revalidatePath("/dashboard");

  return { success: true };
}
