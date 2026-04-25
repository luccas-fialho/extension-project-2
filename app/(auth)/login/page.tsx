"use client"; // Necessário para usar hooks do React

import { loginTeacher } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
  // O hook gerencia o estado do retorno da função e se está carregando
  const [state, formAction, isPending] = useActionState(loginTeacher, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Acesso Professor
        </h1>

        {/* Trocamos o action={loginTeacher} pelo formAction do hook */}
        <form action={formAction} className="space-y-4">
          {/* Se a Action retornar um erro, ele aparece aqui de forma elegante */}
          {state?.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {state.error}
            </div>
          )}

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="professores@lightfitness.com.br"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isPending} // Desabilita o botão enquanto processa o login
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isPending ? "Entrando..." : "Entrar no Painel"}
          </button>
        </form>
      </div>
    </div>
  );
}
