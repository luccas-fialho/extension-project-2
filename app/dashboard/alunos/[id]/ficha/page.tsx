import { WorkoutService } from "@/services/workout.service";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WorkoutForm from "./WorkoutForm";

export default async function NovaFichaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Pega o ID do aluno da URL
  const { id: studentId } = await params;

  // Verifica qual professor está logado no Supabase
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  // Pega o ID do professor no nosso banco Prisma (usando o email do auth)
  const teacher = await prisma.user.findUnique({
    where: { email: authUser.email },
  });

  // Busca os dados do aluno para mostrar o nome na tela
  const student = await prisma.user.findUnique({
    where: { id: studentId },
  });

  if (!teacher || !student) redirect("/dashboard/alunos");

  // Busca o catálogo de exercícios que criamos com o Seed
  const exercises = await WorkoutService.getExercises();

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Montar Ficha</h1>
        <p className="mt-1 text-gray-500">
          Criando um novo programa de treinamento para{" "}
          <strong className="text-blue-600">{student.name}</strong>
        </p>
      </div>

      <WorkoutForm
        studentId={studentId}
        teacherId={teacher.id}
        studentName={student.name}
        availableExercises={exercises}
      />
    </div>
  );
}
