"use server";

import { StudentService } from "@/services/student.service";
import { revalidatePath } from "next/cache";

export async function createStudentAction(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) return;

  await StudentService.createStudent(name);

  revalidatePath("/dashboard/alunos");
}
