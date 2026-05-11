"use client";

import { useState } from "react";
import { deleteStudentAction } from "@/app/actions/student";
import { DeleteStudentModal } from "@/components/DeleteStudentModal";

export function DeleteStudentListButton({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    const result = await deleteStudentAction(studentId);

    if (!result.success) {
      alert(result.error);
    }

    setIsPending(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-red-500/10 text-lg text-red-500 transition-colors hover:bg-red-500 hover:text-white dark:bg-red-500/20 dark:text-red-400"
        title="Excluir Aluno"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-trash-icon lucide-trash"
        >
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>

      <DeleteStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        isPending={isPending}
        studentName={studentName}
      />
    </>
  );
}
