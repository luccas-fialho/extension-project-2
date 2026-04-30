import prisma from "@/lib/prisma";

export interface CreateWorkoutInput {
  studentId: string;
  teacherId: string;
  objective: string;
  durationInDays: number;
  splits: {
    name: string;
    exercises: {
      exerciseId: string;
      setsAndReps: string;
      order: number;
    }[];
  }[];
}

function standardizeText(text: string) {
  if (!text) return ''
  return text
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const WorkoutService = {
  // Vai buscar o catálogo de exercícios para o professor escolher no formulário
  async getExercises() {
    return await prisma.exercise.findMany({
      orderBy: { name: "asc" },
    });
  },

  // Cria a ficha completa e substitui a anterior
  async createProgram(data: CreateWorkoutInput) {
    // Limpa a ficha antiga (se existir).
    // O Prisma apaga os Splits e Exercícios antigos automaticamente por causa do Cascade.
    await prisma.workoutProgram.deleteMany({
      where: { studentId: data.studentId },
    });

    // Cria a nova ficha com tudo aninhado numa única operação
    return await prisma.workoutProgram.create({
      data: {
        studentId: data.studentId,
        teacherId: data.teacherId,
        objective: data.objective,
        durationInDays: data.durationInDays,
        // Cria os treinos (A, B, C...)
        splits: {
          create: data.splits.map((split) => ({
            name: split.name,
            // Dentro de cada treino, cria os exercícios associados
            exercises: {
              create: split.exercises.map((ex) => ({
                exerciseId: ex.exerciseId,
                setsAndReps: ex.setsAndReps,
                order: ex.order,
              })),
            },
          })),
        },
      },
    });
  },

  async getProgramByStudentId(studentId: string) {
    return await prisma.workoutProgram.findUnique({
      where: { studentId },
      include: {
        splits: {
          include: {
            exercises: {
              include: { exercise: true },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { name: "asc" },
        },
      },
    });
  },

  // Registra a conclusão de uma divisão de treino (Ex: Treino A)
  async finishSplit(studentId: string, splitId: string) {
    return await prisma.workoutHistory.create({
      data: {
        studentId,
        splitId,
      },
    });
  },

  // Busca os últimos treinos concluídos pelo aluno
  async getStudentHistory(studentId: string, limit: number = 5) {
    return await prisma.workoutHistory.findMany({
      where: { studentId },
      orderBy: { completedAt: "desc" },
      take: limit,
      include: {
        split: true, // Traz os dados da divisão (ex: name: "A") para mostrar na tela
      },
    });
  },

  async countStudentHistory(studentId: string) {
    // Retorna apenas o número total de treinos concluídos, sem trazer os detalhes de cada um
    return await prisma.workoutHistory.count({
      where: { studentId },
    });
  },

  async deleteProgram(studentId: string) {
    return await prisma.workoutProgram.deleteMany({
      where: { studentId },
    });
  },

  async createExercise(name: string, muscleGroup: string) {
    return await prisma.exercise.create({
      data: {
        name: standardizeText(name),
        muscleGroup: standardizeText(muscleGroup) || 'Outros',
      },
    });
  },
};
