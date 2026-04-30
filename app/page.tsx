import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  // Verifica se existe aluno logado
  const cookieStore = await cookies();
  const studentId = cookieStore.get("student_id")?.value;

  if (studentId) {
    redirect("/aluno");
  }

  // Verifica se existe professor logado
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard/alunos");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white font-sans">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00FF00]/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#00FF00] shadow-[0_0_30px_rgba(0,255,0,0.4)]">
          <Image
            src={"/logo.png"}
            height={96}
            width={96}
            alt="Logo Light Fitness"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-2">
          Light <span className="text-[#00FF00]">Fitness</span>
        </h1>
        <p className="mb-12 text-sm md:text-base font-medium text-gray-400 max-w-md">
          Acesse sua plataforma de treinos e acompanhe sua evolução diária.
        </p>

        <div className="flex flex-col w-full max-w-xs gap-4">
          <Link
            href="/aluno/login"
            className="w-full text-center rounded-xl bg-[#00FF00] p-4 text-lg font-black uppercase italic text-black transition-all hover:bg-[#00e600] hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,255,0,0.2)]"
          >
            Área do Aluno
          </Link>

          <Link
            href="/login"
            className="w-full text-center rounded-xl border-2 border-gray-800 bg-gray-900 p-4 text-sm font-bold uppercase tracking-widest text-gray-300 transition-all hover:border-gray-600 hover:text-white active:scale-95"
          >
            Acesso Professor
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-[10px] uppercase tracking-widest text-gray-600">
        Desenvolvido por Luccas Fialho
      </footer>
    </div>
  );
}
