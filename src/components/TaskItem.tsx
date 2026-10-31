'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: { id: string; titulo: string; descricao?: string; dataCriacao: number };
  onEdit: () => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function TaskItem({ task, onEdit, onDelete, isDeleting }: TaskItemProps) {
  const [showModal, setShowModal] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between items-start group hover:border-blue-200 transition-colors">
        <div className="pr-4">
          <h3 className="text-lg font-semibold text-gray-900">{task.titulo}</h3>
          {task.descricao && <p className="text-gray-600 mt-2 leading-relaxed">{task.descricao}</p>}
          <span className="text-xs font-medium text-gray-400 mt-3 block">
            {new Date(task.dataCriacao).toLocaleDateString('pt-PT', {
              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </span>
        </div>

        <div className="flex gap-2 opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowModal(true)}
            disabled={isDeleting}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Apagar"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-semibold text-gray-900">Apagar Tarefa</h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Tem a certeza que deseja apagar esta tarefa? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sim, apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}