import prisma from "@/lib/prisma";

export const StudentService = {
  // Vai buscar todos os alunos para listar no Dashboard
  async getStudents() {
    return await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        workoutProgram: true,
      },
    });
  },

  // Cria um novo aluno gerando uma matrícula automática
  async createStudent(name: string) {
    let registration = "";
    let isUnique = false;

    while (!isUnique) {
      registration = Math.floor(100000 + Math.random() * 900000).toString();

      const existingUser = await prisma.user.findUnique({
        where: { registration },
      });

      if (!existingUser) {
        isUnique = true;
      }
    }

    return await prisma.user.create({
      data: {
        name,
        role: "STUDENT",
        registration,
      },
    });
  },

  // Busca o aluno pelo ID único (UUID)
  async getById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  // Busca um aluno específico pela matrícula
  async getByRegistration(registration: string) {
    return await prisma.user.findUnique({
      where: { registration },
    });
  },

  async getByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    })
  },

  async delete(id: string) {
    await prisma.workoutProgram.deleteMany({
      where: { studentId: id },
    });

    await prisma.workoutHistory.deleteMany({
      where: { studentId: id },
    });

    return await prisma.user.delete({
      where: { id },
    });
  },
};
