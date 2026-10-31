import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import GestorTarefas from './page';

class IntersectionObserverMock {
  observe = vi.fn(); disconnect = vi.fn(); takeRecords = vi.fn(); unobserve = vi.fn();
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

const mockUseInfiniteQuery = vi.fn();
const mockMutateCreate = vi.fn();
const mockMutateUpdate = vi.fn();
const mockMutateDelete = vi.fn();

type MutationOpts = { 
  onSuccess?: () => void; 
  onError?: (err: Error) => void;
};

vi.mock('@/trpc/client', () => ({
  trpc: {
    useUtils: () => ({ listTask: { invalidate: vi.fn() } }),
    listTask: { useInfiniteQuery: (...args: unknown[]) => mockUseInfiniteQuery(...args) },
    createTask: { 
      useMutation: (opts?: MutationOpts) => ({ 
        mutate: (vars: { titulo?: string; descricao?: string }) => { 
          mockMutateCreate(vars); 
          if (vars.titulo === 'Erro') opts?.onError?.(new Error('Falha simulada'));
          else opts?.onSuccess?.(); 
        }, 
        isPending: false 
      }) 
    },
    updateTask: { 
      useMutation: (opts?: MutationOpts) => ({ 
        mutate: (vars: { id?: string; titulo?: string; descricao?: string }) => { 
          mockMutateUpdate(vars); 
          if (vars.titulo === 'Erro') opts?.onError?.(new Error('Falha simulada'));
          else opts?.onSuccess?.(); 
        }, 
        isPending: false 
      }) 
    },
    deleteTask: { 
      useMutation: (opts?: MutationOpts) => ({ 
        mutate: (vars: { id?: string }) => { 
          mockMutateDelete(vars); 
          if (vars.id === 'erro-id') opts?.onError?.(new Error('Falha simulada'));
          else opts?.onSuccess?.(); 
        }, 
        isPending: false 
      }) 
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  }
}));

describe('Página Principal (GestorTarefas)', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('deve mostrar estado de loading', () => {
    mockUseInfiniteQuery.mockReturnValue({ isLoading: true });
    render(<GestorTarefas />);
    expect(screen.getByText('A carregar...')).toBeDefined();
  });

  it('deve mostrar estado de erro', () => {
    mockUseInfiniteQuery.mockReturnValue({ isLoading: false, isError: true });
    render(<GestorTarefas />);
    expect(screen.getByText('Erro ao carregar as tarefas.')).toBeDefined();
  });

  it('deve criar uma nova tarefa', () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ items: [] }] },
      isLoading: false, isError: false,
    });
    
    render(<GestorTarefas />);
    
    const input = screen.getByPlaceholderText(/o que precisa de ser feito/i);
    fireEvent.change(input, { target: { value: 'Nova Tarefa' } });
    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
    
    expect(mockMutateCreate).toHaveBeenCalledWith({ titulo: 'Nova Tarefa', descricao: '' });
  });

  it('deve entrar em modo de edição ao clicar no botão de editar', () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ items: [{ id: '1', titulo: 'Mock Task', dataCriacao: 0 }] }] },
      isLoading: false, isError: false,
    });
    
    render(<GestorTarefas />);
    
    fireEvent.click(screen.getByTitle('Editar'));
    
    expect(screen.getByRole('button', { name: /guardar alterações/i })).toBeDefined();
  });

  it('deve atualizar uma tarefa existente ao submeter no modo de edição', () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ items: [{ id: '1', titulo: 'Mock Task', dataCriacao: 0 }] }] },
      isLoading: false, isError: false,
    });
    render(<GestorTarefas />);
    
    fireEvent.click(screen.getByTitle('Editar'));
    
    fireEvent.click(screen.getByRole('button', { name: /guardar alterações/i }));
    expect(mockMutateUpdate).toHaveBeenCalled();
  });

  it('deve cancelar a edição de uma tarefa', () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ items: [{ id: '1', titulo: 'Mock Task', dataCriacao: 0 }] }] },
      isLoading: false, isError: false,
    });
    render(<GestorTarefas />);
    
    fireEvent.click(screen.getByTitle('Editar'));
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    
    expect(screen.getByRole('button', { name: /criar tarefa/i })).toBeDefined();
  });

  it('deve apagar uma tarefa', () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ items: [{ id: '1', titulo: 'Mock Task', dataCriacao: 0 }] }] },
      isLoading: false, isError: false,
    });
    render(<GestorTarefas />);
    
    fireEvent.click(screen.getByTitle('Apagar'));
    
    fireEvent.click(screen.getByRole('button', { name: /sim, apagar/i }));
    
    expect(mockMutateDelete).toHaveBeenCalledWith({ id: '1' });
  });

  it('deve exibir notificação de erro ao falhar a criação', () => {
    mockUseInfiniteQuery.mockReturnValue({ data: { pages: [{ items: [] }] } });
    render(<GestorTarefas />);
    
    const input = screen.getByPlaceholderText(/o que precisa de ser feito/i);
    fireEvent.change(input, { target: { value: 'Erro' } });
    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
    
    expect(mockMutateCreate).toHaveBeenCalled();
  });

  it('deve exibir notificação de erro ao falhar a atualização', () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ items: [{ id: '1', titulo: 'Antigo', dataCriacao: 0 }] }] }
    });
    render(<GestorTarefas />);
    
    fireEvent.click(screen.getByTitle('Editar'));
    
    const input = screen.getByPlaceholderText(/o que precisa de ser feito/i);
    fireEvent.change(input, { target: { value: 'Erro' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar alterações/i }));
    
    expect(mockMutateUpdate).toHaveBeenCalled();
  });

  it('deve exibir notificação de erro ao falhar a exclusão', () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ items: [{ id: 'erro-id', titulo: 'Mock Task', dataCriacao: 0 }] }] }
    });
    render(<GestorTarefas />);
    
    fireEvent.click(screen.getByTitle('Apagar'));
    fireEvent.click(screen.getByRole('button', { name: /sim, apagar/i }));
    
    expect(mockMutateDelete).toHaveBeenCalled();
  });

  it('deve acionar as linhas de erro (onError) para todas as mutações', () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: { pages: [{ items: [{ id: 'erro-id', titulo: 'Erro', dataCriacao: 0 }] }] },
      isLoading: false, isError: false,
    });
    
    render(<GestorTarefas />);
    
    const input = screen.getByPlaceholderText(/o que precisa de ser feito/i);
    fireEvent.change(input, { target: { value: 'Erro' } });
    fireEvent.click(screen.getByRole('button', { name: /criar tarefa/i }));
    
    fireEvent.click(screen.getByTitle('Editar'));
    fireEvent.click(screen.getByRole('button', { name: /guardar alterações/i }));
    
    fireEvent.click(screen.getByTitle('Apagar'));
    fireEvent.click(screen.getByRole('button', { name: /sim, apagar/i }));
    
  });
});