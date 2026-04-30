"use server";

import { ExerciseService } from "@/services/exercise.service";

export async function createExerciseAction(name: string, muscleGroup: string) {
  try {
    const newExercise = await ExerciseService.create(name, muscleGroup);
    return newExercise;
  } catch (error) {
    console.error("Erro ao criar exercício:", error);
    return null;
  }
}
