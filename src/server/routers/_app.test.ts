import { describe, it, expect } from "vitest";
import { appRouter } from "./_app";

describe("tRPC Backend Router", () => {
  const caller = appRouter.createCaller({});

  it("deve criar uma nova tarefa", async () => {
    const input = { titulo: "Tarefa de Teste", descricao: "Testando o tRPC" };

    const result = await caller.createTask(input);

    expect(result).toHaveProperty("id");
    expect(result.titulo).toBe("Tarefa de Teste");
    expect(result.descricao).toBe("Testando o tRPC");
  });

  it("deve falhar ao tentar criar tarefa sem titulo", async () => {
    const input = { titulo: "", descricao: "Sem titulo" };

    await expect(caller.createTask(input)).rejects.toThrow();
  });

  it("deve listar as tarefas paginadas", async () => {
    await caller.createTask({ titulo: "Tarefa 1" });

    const result = await caller.listTask({ limit: 1 });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result).toHaveProperty("nextCursor");
  });

  it("deve lançar erro NOT_FOUND ao apagar tarefa inexistente", async () => {
    await expect(
      caller.deleteTask({ id: "id-falso-123" }),
    ).rejects.toThrowError(/tarefa não encontrada/i);
  });

  it("deve atualizar uma tarefa existente", async () => {
    const tarefa = await caller.createTask({
      titulo: "Antiga",
      descricao: "Antiga",
    });

    const atualizada = await caller.updateTask({
      id: tarefa.id,
      titulo: "Nova",
      descricao: "Nova desc",
    });

    expect(atualizada.titulo).toBe("Nova");
    expect(atualizada.descricao).toBe("Nova desc");
  });

  it("deve lançar erro NOT_FOUND ao atualizar tarefa inexistente", async () => {
    await expect(
      caller.updateTask({ id: "falso", titulo: "X" }),
    ).rejects.toThrow();
  });

  it("deve apagar uma tarefa com sucesso", async () => {
    // Cria uma tarefa
    const tarefa = await caller.createTask({ titulo: "Tarefa para apagar" });

    // Apaga a tarefa
    const resultado = await caller.deleteTask({ id: tarefa.id });
    expect(resultado.success).toBe(true);

    // Verifica se ela sumiu da lista
    const lista = await caller.listTask({ limit: 10 });
    expect(lista.items.find((t) => t.id === tarefa.id)).toBeUndefined();
  });

  it("deve listar tarefas usando os parâmetros padrão (sem input)", async () => {
    // Chama a função listTask sem enviar a propriedade { limit, cursor }
    const result = await caller.listTask();

    expect(result.items).toBeInstanceOf(Array);
  });
});
