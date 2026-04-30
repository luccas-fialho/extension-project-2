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

export const WorkoutService = {
  // Cria a ficha completa e substitui a anterior
  async createProgram(data: CreateWorkoutInput) {
    await prisma.workoutProgram.deleteMany({
      where: { studentId: data.studentId },
    });

    return await prisma.workoutProgram.create({
      data: {
        studentId: data.studentId,
        teacherId: data.teacherId,
        objective: data.objective,
        durationInDays: data.durationInDays,
        splits: {
          create: data.splits.map((split) => ({
            name: split.name,
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
        split: true,
      },
    });
  },

  async countStudentHistory(studentId: string) {
    return await prisma.workoutHistory.count({
      where: { studentId },
    });
  },

  async deleteProgram(studentId: string) {
    return await prisma.workoutProgram.deleteMany({
      where: { studentId },
    });
  },
};
