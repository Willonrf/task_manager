import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TaskForm } from './TaskForm';

describe('Componente TaskForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('deve renderizar os campos corretamente', () => {
    render(<TaskForm onSubmit={vi.fn()} isPending={false} tarefaEmEdicao={null} />);
    
    expect(screen.getByPlaceholderText(/o que precisa de ser feito/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /criar tarefa/i })).toBeDefined();
  });

  it('deve chamar onSubmit com os dados preenchidos ao submeter', () => {
    const mockSubmit = vi.fn();
    render(<TaskForm onSubmit={mockSubmit} isPending={false} tarefaEmEdicao={null} />);
    
    const inputTitulo = screen.getByPlaceholderText(/o que precisa de ser feito/i);
    // Usar name: /criar tarefa/i torna a busca específica para este botão
    const btnSubmit = screen.getByRole('button', { name: /criar tarefa/i });

    fireEvent.change(inputTitulo, { target: { value: 'Lavar a loiça' } });
    fireEvent.click(btnSubmit);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith('Lavar a loiça', '');
  });

  it('deve desativar o botão quando isPending for true', () => {
    render(<TaskForm onSubmit={vi.fn()} isPending={true} tarefaEmEdicao={null} />);
    
    // Seleciona especificamente o botão principal, ignorando outros botões se existirem
    const btnSubmit = screen.getByRole('button', { name: /criar tarefa/i });
    expect(btnSubmit.hasAttribute('disabled')).toBe(true);
  });

  it('deve impedir a submissão se o título estiver vazio', () => {
    const mockSubmit = vi.fn();
    render(<TaskForm onSubmit={mockSubmit} isPending={false} tarefaEmEdicao={null} />);
    
    const btnSubmit = screen.getByRole('button', { name: /criar tarefa/i });
    fireEvent.click(btnSubmit);

    // Como o título está vazio, a prop onSubmit não deve ser chamada
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('deve permitir preencher a descrição', () => {
    render(<TaskForm onSubmit={vi.fn()} isPending={false} tarefaEmEdicao={null} />);
    
    const inputDescricao = screen.getByPlaceholderText(/detalhes adicionais/i);
    fireEvent.change(inputDescricao, { target: { value: 'Minha descrição' } });
    
    expect((inputDescricao as HTMLTextAreaElement).value).toBe('Minha descrição');
  });

  it('deve renderizar o botão cancelar e acionar onCancel ao editar', () => {
    const mockCancel = vi.fn();
    render(
      <TaskForm 
        onSubmit={vi.fn()} 
        onCancel={mockCancel} 
        isPending={false} 
        tarefaEmEdicao={{ id: '1', titulo: 'Editando', descricao: '' }} 
      />
    );
    
    const btnCancel = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(btnCancel);
    
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});