"use client";

import { useActionState, useEffect } from "react";
import { finishWorkoutAction } from "@/app/actions/workout";
import { useRouter } from "next/navigation";

export function FinishWorkoutForm({
  studentId,
  splitId,
}: {
  studentId: string;
  splitId: string;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    finishWorkoutAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/aluno");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-2 space-y-2">
      {/* Estes inputs invisíveis é que enviam os IDs para o formData da Action */}
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="splitId" value={splitId} />

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#00FF00] hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-black p-4 rounded-xl font-bold uppercase tracking-wide transition-colors"
      >
        {isPending ? "Registrando..." : "Finalizar Treino"}
      </button>

      {state?.error && (
        <p className="text-xs text-center font-bold tracking-wide text-red-500">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-xs text-center font-bold tracking-wide text-[#00FF00]">
          Treino registrado com sucesso! 💪
        </p>
      )}
    </form>
  );
}
