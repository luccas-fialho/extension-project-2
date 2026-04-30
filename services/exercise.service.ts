import prisma from "@/lib/prisma";

// Função utilitária exclusiva para padronizar textos de exercícios
function standardizeText(text: string) {
  if (!text) return "";
  return text
    .trim()
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const ExerciseService = {
  // Busca o catálogo de exercícios
  async getAllExercises() {
    return await prisma.exercise.findMany({
      orderBy: { name: "asc" },
    });
  },

  // Cria um exercício
  async create(name: string, muscleGroup: string) {
    return await prisma.exercise.create({
      data: {
        name: standardizeText(name),
        muscleGroup: standardizeText(muscleGroup) || "Outros",
      },
    });
  },
};
