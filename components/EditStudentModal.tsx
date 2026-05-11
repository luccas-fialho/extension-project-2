"use client";

import { useState } from "react";
import { updateStudentAction } from "@/app/actions/student";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: { id: string; name: string; registration: string };
}

export function EditStudentModal({ isOpen, onClose, student }: Props) {
  const [name, setName] = useState(student.name);
  const [registration, setRegistration] = useState(student.registration || "");
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage("");

    const result = await updateStudentAction(student.id, name, registration);

    if (result?.success) {
      onClose();
    } else {
      setErrorMessage(result?.error || "Erro desconhecido ao atualizar.");
    }

    setIsPending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-black uppercase italic tracking-tight text-gray-900 dark:text-white">
            Editar <span className="text-[#00FF00]">Aluno</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-[#00FF00] focus:outline-none dark:border-gray-700 dark:bg-black dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
              Matrícula
            </label>
            <input
              type="text"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-[#00FF00] focus:outline-none dark:border-gray-700 dark:bg-black dark:text-white"
            />
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-red-100 p-3 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-500">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="mt-6 flex gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-xl bg-gray-100 p-3 text-xs font-bold uppercase tracking-widest text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 cursor-pointer rounded-xl bg-[#00FF00] p-3 text-xs font-black uppercase italic tracking-widest text-black transition-colors hover:bg-[#00CC00] disabled:opacity-50"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
