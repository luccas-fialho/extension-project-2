import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WorkoutService } from "@/services/workout.service";
import { FinishWorkoutForm } from "./FinishWorkoutForm";

export default async function TreinoPage() {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value;

  if (!studentId) redirect("/aluno/login");

  const ficha = await WorkoutService.getProgramByStudentId(studentId);
  const historico = await WorkoutService.getStudentHistory(studentId);
  const treinosFeitos = await WorkoutService.countStudentHistory(studentId);

  if (!ficha) {
    return (
      <div className="p-8 text-center text-white bg-black min-h-screen">
        <div className="mb-4 flex justify-center">
          <div className="h-1 w-12 bg-[#00FF00]"></div>
        </div>
        <p className="text-gray-400">Você ainda não tem uma ficha ativa.</p>
        <p className="text-sm text-gray-500">Fale com algum professor! 💪</p>
      </div>
    );
  }

  const metaTreinos = ficha.durationInDays;

  const progresso = Math.min(
    Math.round((treinosFeitos / metaTreinos) * 100),
    100,
  );

  return (
    <div className="min-h-screen bg-black p-4 pb-20 text-white font-sans">
      <header className="mb-8 border-l-4 border-[#00FF00] pl-4">
        <h2 className="text-xl font-black uppercase italic tracking-tight">
          Ficha para <span className="text-[#00FF00]">{ficha.objective}</span>
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-gray-500">
          Validade: {ficha.durationInDays} dias
        </p>
      </header>

      {historico.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Últimos Treinos
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {historico.map((log) => (
              <div
                key={log.id}
                className="shrink-0 bg-gray-900 border border-gray-800 rounded-2xl p-4 w-28 flex flex-col items-center justify-center"
              >
                <span className="text-[10px] text-gray-400 uppercase font-bold mb-2 tracking-widest">
                  {new Date(log.completedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 border border-gray-700 text-[#00FF00] font-black text-lg">
                  {log.split.name}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8 bg-gray-900 rounded-2xl p-5 border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF00] opacity-5 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="flex justify-between items-end mb-3 relative z-10">
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Seu Progresso
            </h3>
            <p className="text-sm font-black italic text-white mt-0.5">
              {treinosFeitos} de {metaTreinos} treinos
            </p>
          </div>
          <span className="text-[#00FF00] font-black text-3xl italic leading-none drop-shadow-[0_0_8px_rgba(0,255,0,0.3)]">
            {progresso}%
          </span>
        </div>

        <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-gray-800 relative z-10">
          <div
            className="h-full bg-linear-to-r from-green-600 to-[#00FF00] transition-all duration-1000 ease-out relative"
            style={{ width: `${progresso}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white opacity-30 skew-x-[-20deg]"></div>
          </div>
        </div>

        <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-3 text-center font-bold">
          {progresso === 0
            ? "Bora dar o primeiro passo!"
            : progresso < 50
              ? "Continue no foco!"
              : progresso < 100
                ? "Tá voando! Quase lá!"
                : "Meta atingida! Parabéns! 🏆"}
        </p>
      </section>

      <div className="space-y-4">
        {ficha.splits.map((split) => (
          <div key={split.id}>
            <details className="group overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 transition-all">
              <summary className="flex cursor-pointer items-center justify-between p-5 list-none">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00FF00] text-sm font-black text-black">
                    {split.name}
                  </div>
                  <span className="text-lg font-bold uppercase tracking-tighter italic">
                    Treino {split.name}
                  </span>
                </div>
                <span className="text-[#00FF00] transition-transform duration-300 group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </summary>

              <div className="px-5 pb-5 space-y-3">
                {split.exercises.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-black/40 p-4 border border-gray-800/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white uppercase tracking-tight">
                        {item.exercise.name}
                      </p>
                      <p className="text-[9px] font-medium text-[#00FF00] uppercase tracking-widest opacity-80">
                        {item.exercise.muscleGroup}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="font-black text-lg leading-none text-white italic">
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
              </div>
            </details>
            <FinishWorkoutForm studentId={studentId} splitId={split.id} />
          </div>
        ))}
      </div>

      <footer className="fixed bottom-6 left-0 right-0 flex justify-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700">
          Light Fitness App
        </div>
      </footer>
    </div>
  );
}
