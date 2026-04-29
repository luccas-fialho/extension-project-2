import { StudentService } from "@/services/student.service";
import { createStudentAction } from "@/app/actions/student";
import Link from "next/link";

export default async function AlunosPage() {
  const students = await StudentService.getStudents();

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24">
      <div className="mx-auto max-w-7xl p-4 md:p-8 md:pt-12">
        <header className="mb-10 border-l-4 border-[#00FF00] pl-4">
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white md:text-4xl">
            Gestão de <span className="text-[#00FF00]">Alunos</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-400">
            Cadastre e atualize as fichas da academia
          </p>
        </header>

        <div className="mb-12 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            Adicionar Novo Aluno
          </h2>

          <form
            action={createStudentAction}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <div className="flex-1">
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full rounded-xl border-2 border-gray-800 bg-black p-4 text-white placeholder:text-gray-600 transition-all focus:border-[#00FF00] focus:outline-none"
                placeholder="Nome do Aluno (ex: João Silva)"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer whitespace-nowrap rounded-xl bg-[#00FF00] px-8 py-4 font-black uppercase italic text-black transition-all hover:bg-[#00CC00] active:scale-95"
            >
              + Gerar Matrícula
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {students.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-gray-800 bg-gray-900 p-12 text-center">
              <p className="font-medium text-gray-500">
                Nenhum aluno cadastrado ainda.
              </p>
            </div>
          ) : (
            students.map((student) => (
              <div
                key={student.id}
                className="flex h-full flex-col rounded-2xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-gray-600"
              >
                <div className="mb-6 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold capitalize text-white leading-tight mb-2 wrap-break-word">
                      {student.name}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-gray-400">
                      Matrícula: <br className="sm:hidden" />
                      <span className="text-sm font-black tracking-[0.2em] text-[#00FF00]">
                        {student.registration}
                      </span>
                    </p>
                  </div>

                  <div className="shrink-0 mt-1">
                    {student.workoutProgram ? (
                      <span className="inline-flex items-center rounded-full border border-[#00FF00]/20 bg-[#00FF00]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#00FF00]">
                        Ativa
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Sem Ficha
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-800 pt-5">
                  <Link
                    href={
                      student.workoutProgram
                        ? `/dashboard/alunos/${student.id}`
                        : `/dashboard/alunos/${student.id}/ficha`
                    }
                    className={`block w-full cursor-pointer rounded-xl px-4 py-3 text-center text-xs font-black uppercase tracking-widest transition-all ${
                      student.workoutProgram
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "border-2 border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00] hover:text-black"
                    }`}
                  >
                    {student.workoutProgram ? "Ver Detalhes" : "Montar Ficha"}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
