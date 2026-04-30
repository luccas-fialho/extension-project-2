import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StudentService } from "@/services/student.service";
import { ExerciseService } from "@/services/exercise.service";
import WorkoutForm from "./WorkoutForm";
import Link from "next/link";

export default async function NovaFichaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: studentId } = await params;

  // Verifica qual professor está logado no Supabase
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // Verifica se o usuário e o email existem na sessão
  if (!authUser || !authUser.email) redirect("/login");

  // Busca limpa usando a camada de Service!
  const teacher = await StudentService.getByEmail(authUser.email);
  const student = await StudentService.getById(studentId);

  if (!teacher || !student) redirect("/dashboard/alunos");

  // Busca o catálogo de exercícios
  const exercises = await ExerciseService.getAllExercises();

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans pb-24">
      <div className="mx-auto w-full max-w-7xl p-4 md:p-8 md:pt-12">
        <header className="mb-10 flex items-center justify-between">
          <div className="border-l-4 border-[#00FF00] pl-4">
            <h1 className="text-2xl font-black uppercase italic tracking-tight text-white md:text-3xl">
              Montar <span className="text-[#00FF00]">Ficha</span>
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-400">
              Personalizando treino para{" "}
              <span className="capitalize text-[#00FF00]">{student.name}</span>
            </p>
          </div>

          <Link
            href="/dashboard/alunos"
            className="cursor-pointer rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
          >
            Voltar
          </Link>
        </header>

        <div className="w-full">
          <WorkoutForm
            studentId={studentId}
            teacherId={teacher.id}
            studentName={student.name}
            availableExercises={exercises}
          />
        </div>
      </div>
    </div>
  );
}
