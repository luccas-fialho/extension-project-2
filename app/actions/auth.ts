"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { StudentService } from "@/services/student.service";

export async function loginTeacher(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Credenciais inválidas. Tente novamente." };
  }

  redirect("/dashboard/alunos");
}

export async function loginStudentAction(prevState: any, formData: FormData) {
  const registration = formData.get("registration") as string;

  if (!registration) {
    return { error: "Por favor, insira a sua matrícula." };
  }

  const student = await StudentService.getByRegistration(registration);

  if (!student) {
    return {
      error: "Matrícula não encontrada. Verifique com o seu professor.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("student_id", student.id, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/aluno/treino");
}
