"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteWorkoutAction } from "@/app/actions/workout";
import { DeleteWorkoutModal } from "@/components/DeleteWorkoutModal";

export function DeleteWorkoutButton({ studentId }: { studentId: string }) {
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleConfirmDelete = async () => {
    setIsPending(true);
    try {
      await deleteWorkoutAction(studentId);
      router.push("/dashboard/alunos");
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao excluir a ficha.");
      setIsPending(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full cursor-pointer rounded-xl border-2 border-red-500/20 bg-red-500/10 p-4 text-center text-sm font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95 sm:w-48"
      >
        Excluir Ficha
      </button>

      <DeleteWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
      />
    </>
  );
}
