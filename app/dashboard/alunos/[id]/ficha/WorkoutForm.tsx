"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWorkoutAction } from "@/app/actions/workout";
import { CreateWorkoutInput } from "@/services/workout.service";

interface Props {
  studentId: string;
  teacherId: string;
  studentName: string;
  availableExercises: { id: string; name: string; muscleGroup: string }[];
}

export default function WorkoutForm({
  studentId,
  teacherId,
  studentName,
  availableExercises,
}: Props) {
  const router = useRouter();
  const [objective, setObjective] = useState("Hipertrofia");
  const [duration, setDuration] = useState(40);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [splits, setSplits] = useState<CreateWorkoutInput["splits"]>([
    { name: "A", exercises: [] },
  ]);

  const handleAddSplit = () => {
    const nextLetter = String.fromCharCode("A".charCodeAt(0) + splits.length);
    setSplits([...splits, { name: nextLetter, exercises: [] }]);
  };

  const handleAddExercise = (splitIndex: number) => {
    const newSplits = [...splits];
    newSplits[splitIndex].exercises.push({
      exerciseId: availableExercises[0]?.id || "",
      setsAndReps: "4x12",
      machineNumber: "",
      order: newSplits[splitIndex].exercises.length + 1,
    });
    setSplits(newSplits);
  };

  const handleRemoveExercise = (splitIndex: number, exerciseIndex: number) => {
    const newSplits = [...splits];
    newSplits[splitIndex].exercises.splice(exerciseIndex, 1);
    // Reordenar os restantes
    newSplits[splitIndex].exercises.forEach((ex, idx) => (ex.order = idx + 1));
    setSplits(newSplits);
  };

  const handleExerciseChange = (
    splitIndex: number,
    exerciseIndex: number,
    field: string,
    value: string,
  ) => {
    const newSplits = [...splits];
    newSplits[splitIndex].exercises[exerciseIndex] = {
      ...newSplits[splitIndex].exercises[exerciseIndex],
      [field]: value,
    };
    setSplits(newSplits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: CreateWorkoutInput = {
      studentId,
      teacherId,
      objective,
      durationInDays: duration,
      splits,
    };

    try {
      await createWorkoutAction(payload);
      router.push("/dashboard/alunos");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar a ficha.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Configurações Gerais da Ficha */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#00FF00]">
          Configurações da Ficha
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">
              Objetivo
            </label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-gray-800 bg-black p-4 text-base text-white focus:border-[#00FF00] focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">
              Duração (Dias)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
              className="w-full rounded-xl border-2 border-gray-800 bg-black p-4 text-base text-white focus:border-[#00FF00] focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Divisões de Treino (A, B, C...) */}
      <div className="space-y-6">
        {splits.map((split, sIndex) => (
          <div
            key={sIndex}
            className="rounded-2xl border border-gray-800 bg-black p-4 sm:p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF00] text-lg font-black text-black">
                  {split.name}
                </div>
                <h3 className="text-xl font-black uppercase italic text-white">
                  Treino {split.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleAddExercise(sIndex)}
                className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#00FF00] border border-[#00FF00]/30 hover:bg-[#00FF00]/10 transition-colors cursor-pointer"
              >
                + Exercício
              </button>
            </div>

            <div className="space-y-4">
              {split.exercises.map((ex, eIndex) => (
                <div
                  key={eIndex}
                  className="relative rounded-xl border border-gray-800 bg-gray-900 p-4"
                >
                  {/* Botão de Remover Exercício */}
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(sIndex, eIndex)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 cursor-pointer"
                  >
                    ✕
                  </button>

                  <div className="flex flex-col gap-3">
                    {/* Linha 1: Seleção do Exercício (Ocupa 100%) */}
                    <div className="w-full">
                      <select
                        value={ex.exerciseId}
                        onChange={(e) =>
                          handleExerciseChange(
                            sIndex,
                            eIndex,
                            "exerciseId",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-gray-700 bg-black p-3 text-sm text-white focus:border-[#00FF00] focus:outline-none"
                      >
                        {availableExercises.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name} ({opt.muscleGroup})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Linha 2: Séries e Máquina (Lado a lado no mobile) */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Séries x Reps (Ex: 4x12)"
                          value={ex.setsAndReps}
                          onChange={(e) =>
                            handleExerciseChange(
                              sIndex,
                              eIndex,
                              "setsAndReps",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-gray-700 bg-black p-3 text-sm text-white focus:border-[#00FF00] focus:outline-none"
                        />
                      </div>
                      <div className="w-24 shrink-0 sm:w-32">
                        <input
                          type="text"
                          placeholder="MÁQ"
                          value={ex.machineNumber || ""}
                          onChange={(e) =>
                            handleExerciseChange(
                              sIndex,
                              eIndex,
                              "machineNumber",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-gray-700 bg-black p-3 text-center text-sm text-white focus:border-[#00FF00] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {split.exercises.length === 0 && (
                <p className="text-center text-sm text-gray-600 py-4 font-medium uppercase tracking-widest">
                  Nenhum exercício adicionado.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botão de Adicionar Nova Divisão (A, B, C...) */}
      <button
        type="button"
        onClick={handleAddSplit}
        className="w-full rounded-xl border-2 border-dashed border-gray-700 bg-black p-4 text-sm font-bold uppercase tracking-widest text-gray-400 hover:border-[#00FF00] hover:text-[#00FF00] transition-colors cursor-pointer"
      >
        + Adicionar Treino{" "}
        {String.fromCharCode("A".charCodeAt(0) + splits.length)}
      </button>

      {/* Área de Ações Fixa no Rodapé (Mobile First) */}
      <div className="sticky bottom-0 z-10 -mx-4 mt-8 flex gap-3 border-t border-gray-800 bg-black/90 p-4 backdrop-blur-md sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <button
          type="button"
          onClick={() => router.push("/dashboard/alunos")}
          className="flex-1 rounded-xl border-2 border-gray-700 bg-gray-900 p-4 text-sm font-bold uppercase tracking-widest text-gray-300 hover:border-gray-500 hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-2 rounded-xl bg-[#00FF00] p-4 text-sm font-black uppercase italic tracking-widest text-black hover:bg-[#00CC00] transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
        >
          {isSubmitting ? "Salvando..." : "Salvar Ficha"}
        </button>
      </div>
    </form>
  );
}
