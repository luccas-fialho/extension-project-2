import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WorkoutService } from "@/services/workout.service";

export default async function TreinoPage() {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value;

  if (!studentId) redirect("/aluno/login");

  // Agora usamos o serviço em vez do prisma direto
  const ficha = await WorkoutService.getProgramByStudentId(studentId);

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

  return (
    <div className="min-h-screen bg-black p-4 pb-20 text-white font-sans">
      <header className="mb-8 border-l-4 border-[#00FF00] pl-4">
        <h2 className="text-xl font-black uppercase italic tracking-tight">
          Ficha de <span className="text-[#00FF00]">{ficha.objective}</span>
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-gray-500">
          Validade: {ficha.durationInDays} dias
        </p>
      </header>

      <div className="space-y-4">
        {ficha.splits.map((split) => (
          <details
            key={split.id}
            className="group overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 transition-all"
          >
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
