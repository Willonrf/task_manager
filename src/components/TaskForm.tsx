'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TaskFormProps {
  onSubmit: (titulo: string, descricao: string) => void;
  onCancel?: () => void;
  isPending: boolean;
  tarefaEmEdicao: { id: string; titulo: string; descricao?: string } | null;
}

export function TaskForm({ onSubmit, onCancel, isPending, tarefaEmEdicao }: TaskFormProps) {
  const [titulo, setTitulo] = useState(tarefaEmEdicao?.titulo || '');
  const [descricao, setDescricao] = useState(tarefaEmEdicao?.descricao || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      toast.warning('O título é obrigatório.');
      return;
    }
    onSubmit(titulo, descricao);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 transition-all hover:shadow-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="O que precisa de ser feito?"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
        />
      </div>

      <div className="mb-4">
        <textarea
          placeholder="Detalhes adicionais (opcional)..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors min-h-[100px] resize-none"
        />
      </div>

      <div className="flex gap-3 justify-end">
        {tarefaEmEdicao && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {tarefaEmEdicao ? 'Guardar Alterações' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
}