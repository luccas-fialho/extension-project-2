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

export async function finishWorkoutAction(prevState: any, formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const splitId = formData.get("splitId") as string;

  if (!studentId || !splitId) {
    return { success: false, error: "Dados inválidos." };
  }

  try {
    await WorkoutService.finishSplit(studentId, splitId);

    revalidatePath("/alunos/treino");

    return { success: true };
  } catch (error) {
    console.error("Erro ao finalizar treino:", error);
    return {
      success: false,
      error: "Erro ao registrar a conclusão do treino.",
    };
  }
}
