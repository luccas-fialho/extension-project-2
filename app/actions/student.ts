"use server";

import { StudentService } from "@/services/student.service";
import { revalidatePath } from "next/cache";

export async function createStudentAction(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) return;

  await StudentService.createStudent(name);

  revalidatePath("/dashboard/alunos");
}

export async function deleteStudentAction(id: string) {
  try {
    await StudentService.delete(id);

    revalidatePath("/dashboard/alunos", "layout");

    return { success: true };
  } catch (error) {
    console.error("Erro ao eliminar o aluno:", error);
    return {
      success: false,
      error: "Não foi possível eliminar o aluno da base de dados.",
    };
  }
}
