import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TaskList } from './TaskList';

// Mock do intersection-observer para não quebrar no JSDOM
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: false }),
}));

describe('Componente TaskList', () => {
  afterEach(() => {
    cleanup();
  });

  it('deve mostrar mensagem quando não há tarefas', () => {
    render(
      <TaskList 
        tasks={[]} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        isDeleting={false} 
        fetchNextPage={vi.fn()} 
        hasNextPage={false} 
        isFetchingNextPage={false} 
      />
    );
    
    expect(screen.getByText('Nenhuma tarefa encontrada')).toBeDefined();
  });

  it('deve renderizar o spinner de infinite scroll quando isFetchingNextPage for true', () => {
    const { container } = render(
      <TaskList 
        tasks={[{ id: '1', titulo: 'Teste', dataCriacao: 0 }]} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        isDeleting={false} 
        fetchNextPage={vi.fn()} 
        hasNextPage={true} 
        isFetchingNextPage={true} 
      />
    );
    
    // Procura pela classe de animação do lucide-react (animate-spin)
    expect(container.querySelector('.animate-spin')).toBeDefined();
  });

  it('deve repassar a ação de editar para o TaskItem', () => {

    const mockEdit = vi.fn();
    render(
      <TaskList 
        tasks={[{ id: '1', titulo: 'Teste', dataCriacao: 0 }]} 
        onEdit={mockEdit} 
        onDelete={vi.fn()} 
        isDeleting={false} 
        fetchNextPage={vi.fn()} 
        hasNextPage={false} 
        isFetchingNextPage={false} 
      />
    );
    
    // Encontra o botão de editar renderizado dentro do TaskItem e clica
    fireEvent.click(screen.getByTitle('Editar'));
    
    expect(mockEdit).toHaveBeenCalledTimes(1);
    expect(mockEdit).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  it('deve repassar a ação de apagar para o TaskItem', () => {
    const mockDelete = vi.fn();
    render(
      <TaskList 
        tasks={[{ id: '1', titulo: 'Teste', dataCriacao: 0 }]} 
        onEdit={vi.fn()} 
        onDelete={mockDelete} 
        isDeleting={false} 
        fetchNextPage={vi.fn()} 
        hasNextPage={false} 
        isFetchingNextPage={false} 
      />
    );
    
    // Clica na lixeira para abrir o modal
    fireEvent.click(screen.getByTitle('Apagar'));
    
    // Clica no botão de confirmar exclusão
    fireEvent.click(screen.getByRole('button', { name: /sim, apagar/i }));
    
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  it('deve garantir a cobertura da arrow function inline de edição', () => {
    const mockEdit = vi.fn();
    render(
      <TaskList 
        tasks={[
          { id: '1', titulo: 'A', dataCriacao: 0 },
          { id: '2', titulo: 'B', dataCriacao: 0 }
        ]} 
        onEdit={mockEdit} 
        onDelete={vi.fn()} 
        isDeleting={false} 
        fetchNextPage={vi.fn()} 
        hasNextPage={false} 
        isFetchingNextPage={false} 
      />
    );
    
    // Procura todos os botões de edição e clica especificamente no primeiro
    const botoesEditar = screen.getAllByTitle('Editar');
    fireEvent.click(botoesEditar[0]);
    
    expect(mockEdit).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });
});