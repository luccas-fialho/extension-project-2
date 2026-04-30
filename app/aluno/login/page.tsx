"use client";

import Image from "next/image";
import { loginStudentAction } from "@/app/actions/auth";
import { useActionState } from "react";

export default function AlunoLoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginStudentAction,
    null,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white font-sans">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#00FF00] shadow-[0_0_30px_rgba(0,255,0,0.3)]">
        <Image
          src={"/logo.png"}
          height={96}
          width={96}
          alt="Logo Light Fitness"
        />
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
          Light <span className="text-[#00FF00]">Fitness</span>
        </h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-widest text-gray-500">
          Área do Aluno
        </p>
      </div>

      <form action={formAction} className="mt-10 w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <label className="block text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Digite sua Matrícula
          </label>
          <input
            name="registration"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            className="w-full rounded-xl border-2 border-gray-800 bg-gray-900 p-5 text-center text-4xl font-black tracking-[0.5em] text-[#00FF00] placeholder:text-gray-800 focus:border-[#00FF00] focus:outline-none transition-all"
            maxLength={6}
            autoComplete="false"
          />
        </div>

        {state?.error && (
          <p className="text-center text-sm font-bold text-red-500 animate-pulse">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[#00FF00] p-5 text-lg font-black uppercase italic text-black transition-all hover:bg-[#00e600] active:scale-95 disabled:opacity-50"
        >
          {isPending ? "Verificando..." : "Bora Treinar!"}
        </button>
      </form>

      <footer className="mt-16 text-[10px] uppercase tracking-widest text-gray-600">
        Desenvolvido por Luccas Fialho
      </footer>
    </div>
  );
}
