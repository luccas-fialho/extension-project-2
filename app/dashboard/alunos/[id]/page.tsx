import { WorkoutService } from "@/services/workout.service";
import { StudentService } from "@/services/student.service";
import { redirect } from "next/navigation";
import { DeleteWorkoutButton } from "./DeleteWorkoutButton";
import Link from "next/link";

export default async function DetalhesFichaPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await params;
  const studentId = resolvedParams.id;

  const student = await StudentService.getById(studentId);

  if (!student) {
    redirect("/dashboard/alunos");
  }

  const ficha = await WorkoutService.getProgramByStudentId(studentId);
  const historico = await WorkoutService.getStudentHistory(studentId);
  const totalTreinos = await WorkoutService.countStudentHistory(studentId);

  if (!ficha) {
    redirect(`/dashboard/alunos/${studentId}/ficha`);
  }

  const progressPercent = Math.min(
    Math.round((totalTreinos / ficha.durationInDays) * 100),
    100,
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24">
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="border-l-4 border-[#00FF00] pl-4">
            <h1 className="text-2xl font-black uppercase italic tracking-tight text-white md:text-3xl">
              Detalhes da <span className="text-[#00FF00]">Ficha</span>
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-400">
              Acompanhamento e Gestão de{" "}
              <span className="text-[#00FF00]">{student.name}</span>
            </p>
          </div>
          <Link
            href="/dashboard/alunos"
            className="cursor-pointer rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
          >
            Voltar
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card de Resumo e Progresso */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#00FF00]">
              Resumo do Treino
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Objetivo
                </p>
                <p className="text-lg font-bold text-white">
                  {ficha.objective}
                </p>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Frequência / Meta
                  </span>
                  <span className="text-xl font-black italic text-[#00FF00]">
                    {progressPercent}%
                  </span>
                </div>

                {/* Barra de Progresso */}
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full border border-gray-800 bg-black">
                  <div
                    className="h-full rounded-full bg-[#00FF00]"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-xs font-medium text-gray-400">
                  {totalTreinos} treinos concluídos de {ficha.durationInDays}{" "}
                  dias.
                </p>
              </div>
            </div>
          </div>

          {/* Card de Histórico Recente */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#00FF00]">
              Últimas Sessões
            </h2>

            {historico.length === 0 ? (
              <p className="flex h-full items-center justify-center py-8 text-sm font-medium text-gray-500">
                O aluno ainda não registrou nenhum treino.
              </p>
            ) : (
              <div className="space-y-3">
                {historico.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-xl border border-gray-800 bg-black p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#00FF00] text-sm font-black text-black">
                        {log.split.name}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
                          Treino Realizado
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        {new Date(log.completedAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ações da Ficha */}
        <div className="mt-8 flex flex-col gap-4 border-t border-gray-800 pt-6 sm:flex-row md:justify-end">
          <Link
            href={`/dashboard/alunos/${studentId}/ficha`}
            className="cursor-pointer rounded-xl bg-[#00FF00] p-4 text-center text-sm font-black uppercase italic tracking-widest text-black transition-all hover:bg-[#00CC00] active:scale-95 sm:w-48"
          >
            Editar Ficha
          </Link>
          <DeleteWorkoutButton studentId={studentId} />
        </div>
      </div>
    </div>
  );
}
