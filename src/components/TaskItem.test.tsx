import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TaskItem } from './TaskItem';

describe('Componente TaskItem', () => {
  afterEach(() => {
    cleanup();
  });

  const mockTask = {
    id: '123',
    titulo: 'Comprar pão',
    descricao: 'Na padaria',
    dataCriacao: Date.now(),
  };

  it('deve acionar onEdit ao clicar no botão de edição', () => {
    const mockEdit = vi.fn();
    render(<TaskItem task={mockTask} onEdit={mockEdit} onDelete={vi.fn()} isDeleting={false} />);
    
    const btnEditar = screen.getByTitle('Editar');
    fireEvent.click(btnEditar);
    
    expect(mockEdit).toHaveBeenCalledTimes(1);
  });

  it('deve abrir o modal de exclusão e confirmar a ação', () => {
    const mockDelete = vi.fn();
    render(<TaskItem task={mockTask} onEdit={vi.fn()} onDelete={mockDelete} isDeleting={false} />);
    
    // Clica na lixeira inicial
    const btnApagar = screen.getByTitle('Apagar');
    fireEvent.click(btnApagar);
    
    // Usamos RegExp (/.../i) para que ele encontre o texto mesmo havendo outras frases no parágrafo
    expect(screen.getByText(/Tem a certeza que deseja apagar esta tarefa/i)).toBeDefined();
    
    // Confirma a exclusão no modal
    const btnConfirmar = screen.getByRole('button', { name: /sim, apagar/i });
    fireEvent.click(btnConfirmar);
    
    expect(mockDelete).toHaveBeenCalledWith('123');
  });

  it('deve fechar o modal de exclusão ao clicar em cancelar', () => {
    render(<TaskItem task={mockTask} onEdit={vi.fn()} onDelete={vi.fn()} isDeleting={false} />);
    
    fireEvent.click(screen.getByTitle('Apagar'));
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    
    // Também atualizamos aqui para RegExp para manter a consistência
    expect(screen.queryByText(/Tem a certeza que deseja apagar esta tarefa/i)).toBeNull();
  });
});