"use server";

import { WorkoutService, CreateWorkoutInput } from "@/services/workout.service";
import { revalidatePath } from "next/cache";

export async function createWorkoutAction(data: CreateWorkoutInput) {
  if (!data.studentId || !data.teacherId) {
    throw new Error("Faltam dados de identificação");
  }

  await WorkoutService.createProgram(data);

  // Atualiza a tabela de alunos para mostrar que a ficha está "Ativa"
  revalidatePath("/dashboard/alunos");

  return { success: true };
}
