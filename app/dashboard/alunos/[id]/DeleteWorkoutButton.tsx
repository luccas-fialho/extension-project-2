"use client";

import { useState } from "react";
import { deleteWorkoutAction } from "@/app/actions/workout";

export function DeleteWorkoutButton({ studentId }: { studentId: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    // Confirmação de segurança
    if (
      !confirm(
        "Tem a certeza que deseja excluir esta ficha? Esta ação apagará todo o histórico de treinos do aluno e não pode ser desfeita.",
      )
    ) {
      return;
    }

    setIsPending(true);
    try {
      await deleteWorkoutAction(studentId);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao excluir a ficha.");
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="w-full cursor-pointer rounded-xl border-2 border-red-500/20 bg-red-500/10 p-4 text-center text-sm font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50 sm:w-48"
    >
      {isPending ? "Excluindo..." : "Excluir Ficha"}
    </button>
  );
}
