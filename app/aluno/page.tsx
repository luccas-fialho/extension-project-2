import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WorkoutService } from "@/services/workout.service";
import Link from "next/link";
import Image from "next/image";

export default async function AlunoDashboard() {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value;

  if (!studentId) redirect("/aluno/login");

  const ficha = await WorkoutService.getProgramByStudentId(studentId);
  if (!ficha) redirect("/aluno/treino");

  // Busca dados para a gamificação
  const historico = await WorkoutService.getStudentHistory(studentId);
  const totalTreinos = await WorkoutService.countStudentHistory(studentId);

  const progressPercent = Math.min(
    Math.round((totalTreinos / ficha.durationInDays) * 100),
    100,
  );

  let progressMessage = "Vamos começar! O primeiro passo é o mais importante.";
  if (progressPercent > 0 && progressPercent < 50)
    progressMessage = "Belo começo! Mantenha o ritmo.";
  if (progressPercent >= 50 && progressPercent < 100)
    progressMessage = "Passou da metade! Você está voando.";
  if (progressPercent >= 100)
    progressMessage =
      "Meta atingida! Fale com o professor para uma nova ficha.";

  let nextSplitName = ficha.splits[0]?.name || "A"; // Padrão é o primeiro treino
  if (historico.length > 0) {
    const lastSplitName = historico[0].split.name; // Assume que o histórico [0] é o mais recente
    const splitIndex = ficha.splits.findIndex((s) => s.name === lastSplitName);

    if (splitIndex !== -1 && splitIndex < ficha.splits.length - 1) {
      nextSplitName = ficha.splits[splitIndex + 1].name; // Pega a próxima letra
    } else {
      nextSplitName = ficha.splits[0].name; // Se era o último (ex: C), volta pro A
    }
  }

  const today = new Date();
  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (13 - i));
    return d;
  });

  // Transforma as datas do histórico em strings "YYYY-MM-DD" para facilitar a comparação
  const historyDateStrings = historico.map(
    (h) => new Date(h.completedAt).toISOString().split("T")[0],
  );

  return (
    <div className="min-h-screen bg-black p-6 text-white font-sans pb-24">
      <header className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.3)]">
          <Image
            src={"/logo.png"}
            height={96}
            width={96}
            alt="Logo Light Fitness"
          />
        </div>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">
          Meu <span className="text-[#00FF00]">Progresso</span>
        </h1>
      </header>

      <div className="relative mb-8 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#00FF00]/10 blur-[50px]"></div>

        <div className="relative z-10 flex items-end justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Evolução da Ficha
          </span>
          <span className="text-2xl font-black italic text-[#00FF00]">
            {progressPercent}%
          </span>
        </div>

        <div className="relative z-10 h-3 w-full overflow-hidden rounded-full bg-black border border-gray-800">
          <div
            className="h-full rounded-full bg-linear-to-r from-green-600 to-[#00FF00] transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 w-10 bg-linear-to-r from-transparent to-white/30 blur-[2px]"></div>
          </div>
        </div>

        <div className="relative z-10 mt-3 flex justify-between text-[10px] uppercase tracking-widest font-bold text-gray-500">
          <span>{totalTreinos} Feitos</span>
          <span>Meta: {ficha.durationInDays} Dias</span>
        </div>
        <p className="relative z-10 mt-4 text-center text-xs font-medium text-gray-400">
          {progressMessage}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
          Sugestão de Hoje
        </h2>
        <Link
          href="/aluno/treino"
          className="flex w-full items-center justify-between rounded-2xl bg-[#00FF00] p-6 shadow-[0_0_20px_rgba(0,255,0,0.15)] transition-all active:scale-95"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-green-900">
              Iniciar Próximo
            </p>
            <p className="text-2xl font-black uppercase italic text-black">
              Treino {nextSplitName}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-[#00FF00]">
            ▶
          </div>
        </Link>
      </div>

      <div>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
          Últimos 14 Dias
        </h2>
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex flex-wrap justify-center gap-2">
            {last14Days.map((date, index) => {
              const dateString = date.toISOString().split("T")[0];

              // Busca no histórico se o aluno treinou neste dia exato
              const treinoDoDia = historico.find(
                (h) =>
                  new Date(h.completedAt).toISOString().split("T")[0] ===
                  dateString,
              );

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center gap-1 ${index === 13 ? "scale-110" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 sm:h-6 sm:w-6 items-center justify-center rounded-md transition-colors ${
                      treinoDoDia
                        ? "bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.4)] text-black font-black text-xs sm:text-[10px]"
                        : "bg-black border border-gray-800"
                    }`}
                  >
                    {/* Se treinou, mostra a letra (A, B...). Se não, deixa vazio */}
                    {treinoDoDia ? treinoDoDia.split.name : ""}
                  </div>
                  <span className="text-[9px] sm:text-[8px] font-bold text-gray-500">
                    {date.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-black border border-gray-800"></div>{" "}
              Descanso
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex h-2.5 w-2.5 items-center justify-center rounded-sm bg-[#00FF00] text-[6px] text-black font-black"></div>{" "}
              Treino
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
