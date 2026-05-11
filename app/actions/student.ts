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

export async function updateStudentAction(
  id: string,
  name: string,
  registration: string,
) {
  try {
    const existingStudent =
      await StudentService.getByRegistration(registration);

    if (existingStudent && existingStudent.id !== id) {
      return {
        success: false,
        error: "Esta matrícula já está em uso por outro aluno.",
      };
    }

    await StudentService.update(id, name, registration);

    revalidatePath("/dashboard/alunos", "layout");
    revalidatePath(`/dashboard/alunos/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    return {
      success: false,
      error: "Ocorreu um erro interno ao salvar o aluno.",
    };
  }
}
