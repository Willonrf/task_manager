import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import seedData from "../data/seed.json";

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number;
};

const tasks: Task[] =
  process.env.NODE_ENV === "test" ? [] : carregarSeedDinâmico();

function carregarSeedDinâmico(): Task[] {
  const agora = Date.now();

  return seedData.map((task, index) => ({
    id: task.id,
    titulo: task.titulo,
    descricao: task.descricao,
    dataCriacao: agora - index * 60000,
  }));
}

export const appRouter = router({
  listTask: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).nullish(),
          cursor: z.number().nullish(),
        })
        .optional(),
    )
    .query(({ input }) => {
      const limit = input?.limit ?? 5;
      const cursor = input?.cursor ?? 0;

      const tarefasOrdenadas = [...tasks].sort(
        (a, b) => b.dataCriacao - a.dataCriacao,
      );

      const items = tarefasOrdenadas.slice(cursor, cursor + limit);

      let nextCursor: typeof cursor | undefined = undefined;

      if (cursor + limit < tarefasOrdenadas.length) {
        nextCursor = cursor + limit;
      }

      return {
        items,
        nextCursor,
      };
    }),

  createTask: publicProcedure
    .input(
      z.object({
        titulo: z.string().min(1, "O Título é obrigatorio"),
        descricao: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        titulo: input.titulo,
        descricao: input.descricao,
        dataCriacao: Date.now(),
      };
      tasks.push(newTask);
      return newTask;
    }),
  updateTask: publicProcedure
    .input(
      z.object({
        id: z.string(),
        titulo: z.string().min(1, "O Título é obrigatório"),
        descricao: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const index = tasks.findIndex((t) => t.id === input.id);
      if (index === -1) {
        throw new Error("Tarefa não encontrada");
      }
      tasks[index] = {
        ...tasks[index],
        titulo: input.titulo,
        descricao: input.descricao,
      };
      return tasks[index];
    }),
  deleteTask: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ input }) => {
      const index = tasks.findIndex((t) => t.id === input.id);
      if (index === -1) {
        throw new Error("Tarefa não encontrada");
      }
      tasks.splice(index, 1);
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;
