import prisma from "@/lib/prisma";

// Garantia que o formulário envia os dados corretos
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
      machineNumber?: string;
      order: number;
    }[];
  }[];
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
                machineNumber: ex.machineNumber,
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
};
