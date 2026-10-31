'use client';

import { useState } from 'react';
import { trpc } from '../trpc/client';
import { toast } from 'sonner';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';

type Task = { id: string; titulo: string; descricao?: string; dataCriacao: number };

export default function GestorTarefas() {
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<Task | null>(null);
  const [formKey, setFormKey] = useState(0);

  const utils = trpc.useUtils();

  const { 
    data, 
    isLoading, 
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = trpc.listTask.useInfiniteQuery(
    { limit: 5 },
    { 
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const tasks = data?.pages.flatMap((page) => page.items) || [];

  const createTask = trpc.createTask.useMutation({
    onSuccess: () => {
      utils.listTask.invalidate();
      toast.success('Tarefa criada com sucesso!');
      setTarefaEmEdicao(null);
      setFormKey((prev) => prev + 1);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateTask = trpc.updateTask.useMutation({
    onSuccess: () => {
      utils.listTask.invalidate();
      toast.success('Tarefa atualizada!');
      setTarefaEmEdicao(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteTask = trpc.deleteTask.useMutation({
    onSuccess: () => {
      utils.listTask.invalidate();
      toast.success('Tarefa removida.');
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmitTask = (titulo: string, descricao: string) => {
    if (tarefaEmEdicao) {
      updateTask.mutate({ id: tarefaEmEdicao.id, titulo, descricao });
    } else {
      createTask.mutate({ titulo, descricao });
    }
  };

  const handleEditTask = (task: Task) => {
    setTarefaEmEdicao(task);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate({ id });
  };

  const handleCancelEdit = () => {
    setTarefaEmEdicao(null);
  };

  const isPending = createTask.isPending || updateTask.isPending;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <Loader2 className="animate-spin w-8 h-8 mr-2" />
        A carregar...
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Erro ao carregar as tarefas.</div>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6 font-sans">
      <header className="mb-10 text-center mt-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
          <CheckCircle2 className="w-10 h-10 text-blue-600" />
          TaskFlow
        </h1>
      </header>

      <TaskForm
        key={tarefaEmEdicao ? tarefaEmEdicao.id : `nova-tarefa-${formKey}`}
        onSubmit={handleSubmitTask}
        onCancel={handleCancelEdit}
        isPending={isPending}
        tarefaEmEdicao={tarefaEmEdicao}
      />

      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        isDeleting={deleteTask.isPending}
        fetchNextPage={fetchNextPage}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </main>
  );
}