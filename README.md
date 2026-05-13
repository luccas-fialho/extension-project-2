# Light Fitness - Sistema de Gestão de Fichas de Treino Digitais - [preview](https://lightfitnessapp.vercel.app)

Este projeto consiste em uma plataforma web progressiva (PWA) desenvolvida para a digitalização e gestão de fichas de musculação da Academia Light Fitness. O sistema foi concebido como parte das Práticas Extensionistas do curso de Análise e Desenvolvimento de Sistemas da PUCPR, visando substituir métodos físicos de controle por uma interface digital eficiente tanto para treinadores quanto para alunos.

## Contexto do Projeto

O objetivo principal é otimizar o fluxo de trabalho dos instrutores e melhorar a experiência de acompanhamento dos alunos. A aplicação permite que professores gerenciem o cadastro de alunos e montem programas de treinamento personalizados, enquanto os alunos acessam seus treinos de forma rápida através de seus dispositivos móveis.

## Requisitos Funcionais

### Painel Administrativo (Treinador)

- Gerenciamento completo de alunos (Cadastro, Edição e Exclusão).

- Validação de unicidade para matrículas de alunos, prevenindo duplicidade de registros.

- Criação de programas de treino vinculados individualmente a cada aluno.

- Divisão de treinos por blocos (Ex: Treino A, B, C).

- Biblioteca dinâmica de exercícios categorizados por grupos musculares.

- Sistema de exclusão com integridade referencial (Exclusão em cascata).

### Interface e Experiência do Usuário

- Design responsivo otimizado para tablets e smartphones.

## Tecnologias Utilizadas

- Next.js (App Router)

- TypeScript

- Tailwind CSS

- Prisma

- PostgreSQL (Supabase)

- Docker (Banco de dados local postgres)

## Arquitetura de Dados

O banco de dados foi modelado seguindo as normas de integridade referencial, utilizando os seguintes modelos principais:

- User: Armazena dados de Treinadores (Acesso via E-mail) e Alunos (Acesso via Matrícula).

- WorkoutProgram: Define o objetivo e duração do ciclo de treinamento.

- WorkoutSplit: Organiza as divisões de treino (A, B, C, etc.).

- Exercise: Catálogo geral de exercícios disponíveis.

- WorkoutExercise: Relacionamento que define as séries, repetições e ordem dos exercícios em um treino.

- WorkoutHistory: Registro histórico de conclusões de treino pelos alunos.

## Configuração do Ambiente de Desenvolvimento

### Requisitos

- Docker
- Node v24+
- Git

Para executar o projeto localmente siga as instruções abaixo:

- Clone o repositório:

```sh
git clone https://github.com/luccas-fialho/extension-project-2.git
```

- Instale as dependências:

```sh
npm ci
```

- Copie o arquivo `.env.example`:

```sh
cp .env.example .env
```

- Inicie o container do banco de dados:

```sh
npm run supabase:start
```

- Execute as migrações do Prisma para preparar o banco de dados:

```sh
npx prisma migrate dev

npx prisma generate

npx prisma db seed
```

- Inicie o servidor de desenvolvimento:

```sh
npm run dev
```

## Práticas Extensionistas e Impacto Social

Como um projeto extensionista, a aplicação da tecnologia buscou impactar diretamente a comunidade local, proporcionando:

- Redução no consumo de papel e desperdício de materiais físicos.

- Melhoria na organização de dados administrativos da academia.

- Democratização do acesso à tecnologia para acompanhamento de saúde e bem-estar.

## Autor

Desenvolvido por [Luccas Fialho](https://linkedin.com/in/luccas-fialho) como atividade acadêmica para a PUCPR.
