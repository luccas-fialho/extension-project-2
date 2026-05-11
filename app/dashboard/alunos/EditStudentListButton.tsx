"use client";

import { useState } from "react";
import { EditStudentModal } from "@/components/EditStudentModal";

interface Props {
  student: {
    id: string;
    name: string;
    registration: string | null;
  };
}

export function EditStudentListButton({ student }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-blue-500/10 text-lg text-blue-500 transition-colors hover:bg-blue-500 hover:text-white dark:bg-blue-500/20 dark:text-blue-400"
        title="Editar Aluno"
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
          className="lucide lucide-pencil-icon lucide-pencil"
        >
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
          <path d="m15 5 4 4" />
        </svg>
      </button>

      <EditStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={{
          id: student.id,
          name: student.name,
          registration: student.registration || "",
        }}
      />
    </>
  );
}
