"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  createWorkoutAction,
  createExerciseAction,
} from "@/app/actions/workout"; // Importando a nova action
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

  // Transforma a lista do servidor num estado local para podermos adicionar na hora
  const [exercisesList, setExercisesList] = useState(availableExercises);

  const [splits, setSplits] = useState<CreateWorkoutInput["splits"]>([
    { name: "A", exercises: [] },
  ]);

  // Agrupamento agora observa a 'exercisesList' local
  const groupedExercises = useMemo(() => {
    const groups = exercisesList.reduce(
      (acc, exercise) => {
        const group = exercise.muscleGroup || "Outros";
        if (!acc[group]) acc[group] = [];
        acc[group].push(exercise);
        return acc;
      },
      {} as Record<string, typeof exercisesList>,
    );

    return Object.keys(groups)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
          return acc;
        },
        {} as Record<string, typeof exercisesList>,
      );
  }, [exercisesList]);

  // Função mágica para criar o exercício
  const handleCreateNewExercise = async () => {
    const name = window.prompt("Qual o nome do novo exercício?");
    if (!name) return;

    const muscleGroup =
      window.prompt("Qual o grupo muscular? (Ex: Peito, Pernas, Costas)") ||
      "Outros";

    const newEx = await createExerciseAction(name, muscleGroup);

    if (newEx) {
      setExercisesList((prev) => [...prev, newEx]);
      alert(`Exercício "${newEx.name}" adicionado à lista com sucesso!`);
    } else {
      alert("Erro ao salvar o exercício no banco de dados.");
    }
  };

  const handleAddSplit = () => {
    const nextLetter = String.fromCharCode("A".charCodeAt(0) + splits.length);
    setSplits([...splits, { name: nextLetter, exercises: [] }]);
  };

  const handleAddExercise = (splitIndex: number) => {
    const newSplits = [...splits];
    newSplits[splitIndex].exercises.push({
      exerciseId: exercisesList[0]?.id || "",
      setsAndReps: "4x12",
      order: newSplits[splitIndex].exercises.length + 1,
    });
    setSplits(newSplits);
  };

  const handleRemoveExercise = (splitIndex: number, exerciseIndex: number) => {
    const newSplits = [...splits];
    newSplits[splitIndex].exercises.splice(exerciseIndex, 1);
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
      {/* Configurações Gerais */}
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
              className="w-full rounded-xl border-2 border-gray-800 bg-black p-4 text-base text-white transition-all focus:border-[#00FF00] focus:outline-none"
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
              className="w-full rounded-xl border-2 border-gray-800 bg-black p-4 text-base text-white transition-all focus:border-[#00FF00] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Divisões de Treino */}
      <div className="space-y-6">
        {splits.map((split, sIndex) => (
          <div
            key={sIndex}
            className="rounded-2xl border border-gray-800 bg-black p-4 shadow-sm sm:p-6"
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
                className="cursor-pointer rounded-lg border border-[#00FF00]/30 bg-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#00FF00] transition-colors hover:bg-[#00FF00]/10"
              >
                + Adicionar Exercício
              </button>
            </div>

            <div className="space-y-4">
              {split.exercises.map((ex, eIndex) => (
                <div
                  key={eIndex}
                  className="relative rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-5"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(sIndex, eIndex)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110 hover:bg-red-600"
                    title="Remover Exercício"
                  >
                    ✕
                  </button>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    {/* Seleção do Exercício (Usando Tailwind flex-3 nativo) */}
                    <div className="flex-3 sm:flex-3">
                      <div className="mb-2 flex items-center justify-between">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Exercício
                        </label>
                        {/* BOTÃO PARA CRIAR NOVO EXERCÍCIO NA HORA */}
                        <button
                          type="button"
                          onClick={handleCreateNewExercise}
                          className="cursor-pointer text-[9px] font-bold text-[#00FF00] hover:underline"
                        >
                          + CRIAR NOVO
                        </button>
                      </div>
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
                        className="w-full cursor-pointer rounded-lg border border-gray-700 bg-black p-3 text-sm text-white focus:border-[#00FF00] focus:outline-none"
                      >
                        {Object.entries(groupedExercises).map(
                          ([group, exercises]) => (
                            <optgroup
                              key={group}
                              label={`--- ${group.toUpperCase()} ---`}
                              className="bg-gray-900 font-bold text-[#00FF00]"
                            >
                              {exercises.map((opt) => (
                                <option
                                  key={opt.id}
                                  value={opt.id}
                                  className="bg-black font-medium text-white"
                                >
                                  {opt.name}
                                </option>
                              ))}
                            </optgroup>
                          ),
                        )}
                      </select>
                    </div>

                    {/* Séries (Usando Tailwind flex-1 nativo) */}
                    <div className="flex-1">
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Séries x Reps
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 4x12"
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
                  </div>
                </div>
              ))}

              {split.exercises.length === 0 && (
                <p className="py-6 text-center text-sm font-medium uppercase tracking-widest text-gray-600">
                  Nenhum exercício neste treino.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddSplit}
        className="w-full cursor-pointer rounded-xl border-2 border-dashed border-gray-700 bg-black p-4 text-sm font-bold uppercase tracking-widest text-gray-400 transition-colors hover:border-[#00FF00] hover:text-[#00FF00]"
      >
        + Adicionar Novo Treino{" "}
        {String.fromCharCode("A".charCodeAt(0) + splits.length)}
      </button>

      <div className="sticky bottom-0 z-10 -mx-4 mt-8 flex gap-3 border-t border-gray-800 bg-black/90 p-4 backdrop-blur-md sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <button
          type="button"
          onClick={() => router.push("/dashboard/alunos")}
          className="flex-1 cursor-pointer rounded-xl border-2 border-gray-700 bg-gray-900 p-4 text-sm font-bold uppercase tracking-widest text-gray-300 transition-all hover:border-gray-500 hover:text-white active:scale-95"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-2 sm:flex-2 cursor-pointer rounded-xl bg-[#00FF00] p-4 text-sm font-black uppercase italic tracking-widest text-black transition-all hover:bg-[#00CC00] active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : "Salvar Ficha"}
        </button>
      </div>
    </form>
  );
}
