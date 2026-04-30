"use client";

import { useState } from "react";
import { createExerciseAction } from "@/app/actions/exercise";

// Lista padronizada e imutável de grupos musculares (em ordem alfabética)
const MUSCLE_GROUPS = [
  "Abdômen",
  "Bíceps",
  "Costas",
  "Glúteos",
  "Ombros",
  "Panturrilhas",
  "Peito",
  "Pernas",
  "Tríceps",
  "Outros",
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newExercise: {
    id: string;
    name: string;
    muscleGroup: string;
  }) => void;
}

export function CreateExerciseModal({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  // Define o valor inicial como o primeiro item da lista para não ir vazio
  const [muscleGroup, setMuscleGroup] = useState(MUSCLE_GROUPS[0]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newEx = await createExerciseAction(name, muscleGroup);

      if (newEx) {
        onSuccess(newEx);
        setName("");
      } else {
        alert("Erro ao salvar o exercício no banco de dados.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-black uppercase italic tracking-tight text-white">
            Novo <span className="text-[#00FF00]">Exercício</span>
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">
              Nome do Exercício
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="Ex: Supino Inclinado"
              className="w-full rounded-xl border border-gray-700 bg-black p-3 text-sm text-white focus:border-[#00FF00] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">
              Grupo Muscular
            </label>
            <select
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-gray-700 bg-black p-3 text-sm text-white focus:border-[#00FF00] focus:outline-none"
            >
              {MUSCLE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex gap-3 border-t border-gray-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-xl bg-gray-800 p-3 text-xs font-bold uppercase tracking-widest text-gray-300 transition-all hover:bg-gray-700 active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 cursor-pointer rounded-xl bg-[#00FF00] p-3 text-xs font-black uppercase italic tracking-widest text-black transition-all hover:bg-[#00CC00] active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "A Salvar..." : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
