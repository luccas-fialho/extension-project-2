"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWorkoutAction } from "@/app/actions/workout";
import { CreateWorkoutInput } from "@/services/workout.service";

// Tipagem das props que o Server Component vai passar para cá
interface Props {
  studentId: string;
  teacherId: string;
  studentName: string;
  availableExercises: { id: string; name: string; muscleGroup: string }[];
}

export default function WorkoutForm({
  studentId,
  teacherId,
  availableExercises,
}: Props) {
  const router = useRouter();
  const [objective, setObjective] = useState("Hipertrofia");
  const [duration, setDuration] = useState(40);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado inicial: Um treino "A" vazio
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
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-lg bg-white p-6 shadow-sm border border-gray-200"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Objetivo do Aluno
          </label>
          <input
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duração (em dias)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
          />
        </div>
      </div>

      {/* Renderização Dinâmica dos Treinos (A, B, C...) */}
      <div className="space-y-6">
        {splits.map((split, sIndex) => (
          <div
            key={sIndex}
            className="rounded-md border border-gray-200 bg-gray-50 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Treino {split.name}
              </h3>
              <button
                type="button"
                onClick={() => handleAddExercise(sIndex)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                + Adicionar Exercício
              </button>
            </div>

            <div className="space-y-3">
              {split.exercises.map((ex, eIndex) => (
                <div key={eIndex} className="flex gap-2 items-center">
                  <span className="text-sm font-bold text-gray-400">
                    {eIndex + 1}.
                  </span>
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
                    className="flex-1 rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700"
                  >
                    {availableExercises.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} ({opt.muscleGroup})
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Séries x Reps (ex: 4x12)"
                    value={ex.setsAndReps}
                    onChange={(e) =>
                      handleExerciseChange(
                        sIndex,
                        eIndex,
                        "setsAndReps",
                        e.target.value,
                      )
                    }
                    className="w-32 rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700"
                  />

                  <input
                    type="text"
                    placeholder="Máquina (opcional)"
                    value={ex.machineNumber || ""}
                    onChange={(e) =>
                      handleExerciseChange(
                        sIndex,
                        eIndex,
                        "machineNumber",
                        e.target.value,
                      )
                    }
                    className="w-32 rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700"
                  />
                </div>
              ))}
              {split.exercises.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Nenhum exercício neste treino.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleAddSplit}
          className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
        >
          + Adicionar Treino{" "}
          {String.fromCharCode("A".charCodeAt(0) + splits.length)}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-green-600 px-6 py-2 font-bold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : "Salvar Ficha Completa"}
        </button>
      </div>
    </form>
  );
}
