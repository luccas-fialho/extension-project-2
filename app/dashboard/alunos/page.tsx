import { StudentService } from "@/services/student.service";
import { createStudentAction } from "@/app/actions/student";
import Link from "next/link";

export default async function AlunosPage() {
  const students = await StudentService.getStudents();

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans pb-24">
      <header className="mb-8 border-l-4 border-[#00FF00] pl-4">
        <h1 className="text-2xl font-black uppercase italic tracking-tight text-white">
          Gestão de <span className="text-[#00FF00]">Alunos</span>
        </h1>
        <p className="text-sm font-medium text-gray-400 mt-1">
          Cadastre e atualize as fichas
        </p>
      </header>

      <div className="mb-10 rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
        <h2 className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
          Adicionar Novo Aluno
        </h2>

        <form
          action={createStudentAction}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full rounded-xl border-2 border-gray-800 bg-black p-4 text-white placeholder:text-gray-600 focus:border-[#00FF00] focus:outline-none transition-all"
              placeholder="Nome do Aluno (ex: João Silva)"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#00FF00] px-6 py-4 font-black uppercase italic text-black hover:bg-[#00CC00] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            Gerar Matrícula
          </button>
        </form>
      </div>

      <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:grid-cols-3 xl:grid-cols-4">
        {students.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
            <p className="text-gray-500 font-medium">
              Nenhum aluno cadastrado ainda.
            </p>
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="flex flex-col rounded-2xl border border-gray-800 bg-gray-900 p-5 transition-colors hover:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white capitalize">
                    {student.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                    Matrícula:{" "}
                    <span className="font-black text-[#00FF00] text-sm tracking-[0.2em]">
                      {student.registration}
                    </span>
                  </p>
                </div>

                <div>
                  {student.workoutProgram ? (
                    <span className="inline-flex items-center rounded-full bg-[#00FF00]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#00FF00] border border-[#00FF00]/20">
                      Ficha Ativa
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-gray-400">
                      Sem Ficha
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-800">
                <Link
                  href={`/dashboard/alunos/${student.id}/ficha`}
                  className={`block w-full text-center rounded-lg px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                    student.workoutProgram
                      ? "border border-gray-700 text-white hover:bg-gray-800"
                      : "border border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00] hover:text-black"
                  }`}
                >
                  {student.workoutProgram
                    ? "Editar Ficha"
                    : "Montar Nova Ficha"}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
