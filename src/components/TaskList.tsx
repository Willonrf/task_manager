'use client';

import { useEffect } from 'react';
import { ListTodo, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { TaskItem } from './TaskItem';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number;
};

interface TaskListProps {
  tasks: Array<{ id: string; titulo: string; descricao?: string; dataCriacao: number }>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function TaskList({ tasks, onEdit, onDelete, isDeleting, fetchNextPage, hasNextPage, isFetchingNextPage }: TaskListProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <ListTodo className="w-12 h-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">Nenhuma tarefa encontrada</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}

      <div ref={ref} className="py-6 flex justify-center items-center h-16">
        {isFetchingNextPage && (
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        )}
      </div>
    </div>
  );
}