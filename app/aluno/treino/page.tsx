import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WorkoutService } from "@/services/workout.service";
import { FinishWorkoutForm } from "./FinishWorkoutForm";
import Link from "next/link";

export default async function TreinoPage() {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value;

  if (!studentId) redirect("/aluno/login");

  const ficha = await WorkoutService.getProgramByStudentId(studentId);

  if (!ficha) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-center text-white">
        <div className="mb-4 h-1 w-12 bg-[#00FF00]"></div>
        <p className="text-gray-400">Você ainda não tem uma ficha ativa.</p>
        <p className="text-sm text-gray-500">
          Fale com algum professor! 💪
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 pb-24 text-white font-sans">
      <header className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase italic tracking-tight">
            Ficha de <span className="text-[#00FF00]">{ficha.objective}</span>
          </h2>
        </div>
        <Link
          href="/aluno"
          className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white"
        >
          Voltar
        </Link>
      </header>

      <div className="space-y-4">
        {ficha.splits.map((split) => (
          <details
            key={split.id}
            className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all"
          >
            <summary className="flex cursor-pointer items-center justify-between p-5 list-none">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00FF00] text-sm font-black text-black">
                  {split.name}
                </div>
                <span className="text-lg font-bold uppercase italic tracking-tighter">
                  Treino {split.name}
                </span>
              </div>
              <span className="text-[#00FF00] transition-transform duration-300 group-open:rotate-180">
                ▼
              </span>
            </summary>

            <div className="space-y-3 px-5 pb-5">
              {split.exercises.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-gray-800/50 bg-black/40 p-4"
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold uppercase tracking-tight text-white">
                      {item.exercise.name}
                    </p>
                    <p className="text-[9px] font-medium uppercase tracking-widest text-[#00FF00] opacity-80">
                      {item.exercise.muscleGroup}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-lg font-black leading-none italic text-white">
                      {item.setsAndReps}
                    </p>
                    {item.machineNumber && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[8px] font-bold text-gray-400">
                        MÁQ {item.machineNumber}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-800/50 mt-4">
                <FinishWorkoutForm studentId={studentId} splitId={split.id} />
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
