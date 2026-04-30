"use client";

import Image from "next/image";
import { loginTeacher } from "@/app/actions/auth";
import { useActionState } from "react";

export default function CoachLoginPage() {
  const [state, formAction, isPending] = useActionState(loginTeacher, null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white font-sans">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-900 border-2 border-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.2)]">
        <Image
          src={"/logo.png"}
          height={96}
          width={96}
          alt="Logo Light Fitness"
        />
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
          Painel do <span className="text-[#00FF00]">Professor</span>
        </h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-widest text-gray-500">
          Gestão de alunos e treinos
        </p>
      </div>

      <form action={formAction} className="w-full max-w-sm space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              E-mail de Acesso
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="professores@lightfitness.com.br"
              className="w-full rounded-xl border-2 border-gray-800 bg-gray-900 p-4 text-white placeholder:text-gray-600 focus:border-[#00FF00] focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Senha
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border-2 border-gray-800 bg-gray-900 p-4 text-white placeholder:text-gray-600 focus:border-[#00FF00] focus:outline-none transition-all"
            />
          </div>
        </div>

        {state?.error && (
          <p className="text-center text-sm font-bold text-red-500 animate-pulse">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[#00FF00] p-5 text-lg font-black uppercase italic text-black transition-all hover:bg-[#00e600] active:scale-95 disabled:opacity-50 mt-4 cursor-pointer"
        >
          {isPending ? "Entrando..." : "Acessar Painel"}
        </button>
      </form>
    </div>
  );
}
