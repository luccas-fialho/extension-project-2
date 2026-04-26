import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.user.upsert({
    where: { email: "professores@lightfitness.com.br" },
    update: {},
    create: {
      email: "professores@lightfitness.com.br",
      name: "Professor Admin",
      role: "TEACHER",
    },
  });
  // Limpa os exercícios existentes para evitar duplicatas caso rode o seed mais de uma vez
  await prisma.exercise.deleteMany({});

  const exercises = [
    // --- PEITO ---
    { name: "Supino Reto com Barra", muscleGroup: "Peito" },
    { name: "Supino Inclinado com Halteres", muscleGroup: "Peito" },
    { name: "Voador (Peck Deck)", muscleGroup: "Peito" },
    { name: "Crucifixo na Máquina", muscleGroup: "Peito" },
    { name: "Crossover na Polia Alta", muscleGroup: "Peito" },

    // --- COSTAS ---
    { name: "Puxada Frontal (Pulley)", muscleGroup: "Costas" },
    { name: "Remada Baixa com Triângulo", muscleGroup: "Costas" },
    { name: "Remada Curvada Articulada", muscleGroup: "Costas" },
    { name: "Pulldown com Corda", muscleGroup: "Costas" },
    { name: "Voador Inverso (Posterior)", muscleGroup: "Costas" },

    // --- PERNAS (Membros Inferiores) ---
    { name: "Leg Press 45º", muscleGroup: "Pernas" },
    { name: "Agachamento Livre", muscleGroup: "Pernas" },
    { name: "Cadeira Extensora", muscleGroup: "Pernas" },
    { name: "Cadeira Flexora", muscleGroup: "Pernas" },
    { name: "Mesa Flexora", muscleGroup: "Pernas" },
    { name: "Cadeira Abdutora", muscleGroup: "Pernas" },
    { name: "Cadeira Adutora", muscleGroup: "Pernas" },
    { name: "Panturrilha no Leg Press", muscleGroup: "Pernas" },
    { name: "Panturrilha Sentado (Máquina)", muscleGroup: "Pernas" },

    // --- OMBROS ---
    { name: "Desenvolvimento com Halteres", muscleGroup: "Ombros" },
    { name: "Elevação Lateral na Polia", muscleGroup: "Ombros" },
    { name: "Elevação Frontal com Halteres", muscleGroup: "Ombros" },
    { name: "Encolhimento (Trapézio)", muscleGroup: "Ombros" },

    // --- BÍCEPS ---
    { name: "Rosca Direta com Barra", muscleGroup: "Bíceps" },
    { name: "Rosca Martelo com Halteres", muscleGroup: "Bíceps" },
    { name: "Rosca Scott na Máquina", muscleGroup: "Bíceps" },
    { name: "Rosca Alternada", muscleGroup: "Bíceps" },

    // --- TRÍCEPS ---
    { name: "Tríceps Pulley (Barra Reta)", muscleGroup: "Tríceps" },
    { name: "Tríceps Corda", muscleGroup: "Tríceps" },
    { name: "Tríceps Testa", muscleGroup: "Tríceps" },
    { name: "Mergulho na Máquina", muscleGroup: "Tríceps" },

    // --- ABDÔMEN & CORE ---
    { name: "Abdominal Supra na Máquina", muscleGroup: "Abdômen" },
    { name: "Abdominal Infra no Banco", muscleGroup: "Abdômen" },
    { name: "Prancha Isométrica", muscleGroup: "Abdômen" },
  ];

  await prisma.exercise.createMany({
    data: exercises,
  });
}

main();
