# Gestor de Tarefas (Task Manager)

Uma aplicação moderna, reativa e robusta de gestão de tarefas (To-Do List). Este projeto foi arquitetado como uma **Single Page Application (SPA)** focada em performance e Type Safety de ponta a ponta.

## Principais Decisões Arquiteturais

Para atender aos requisitos do desafio priorizando a qualidade de código e a experiência do utilizador (UX), as seguintes decisões foram tomadas:

1. **Abordagem Single Page Application (SPA):**
   - **Decisão:** Manter a criação, listagem, edição e exclusão na mesma tela.
   - **Porquê:** Evita navegações e recarregamentos desnecessários. Usando o estado do React combinado com as mutações do tRPC, a interface responde instantaneamente, proporcionando uma experiência muito mais fluida.
2. **tRPC em vez de REST tradicional ou GraphQL:**
   - **Decisão:** Usar tRPC para a comunicação entre Front-end e Back-end.
   - **Porquê:** Permite partilhar tipagens estritas de TypeScript de ponta a ponta sem necessidade de processos de build complexos ou geração de código (como no GraphQL). Qualquer alteração no schema do Back-end acusa erro imediato no Front-end, eliminando bugs de contrato.
3. **Mock de Banco de Dados com Seed Dinâmico Inteligente:**
   - **Decisão:** Utilizar um array em memória com injeção condicional de dados (Seed).
   - **Porquê:** Facilita a avaliação imediata do projeto sem exigir a configuração de um banco de dados externo. O Seed calcula datas relativas (`Date.now()`) no momento do arranque para que os dados pareçam sempre recentes. Além disso, a injeção é bloqueada no ambiente de testes (`NODE_ENV === 'test'`) para garantir a pureza da cobertura do Vitest.
4. **Build Docker Multi-stage + Next.js Standalone:**
   - **Decisão:** Criar um `Dockerfile` em três estágios usando a feature _standalone_ do Next.js.
   - **Porquê:** O Next.js copia apenas os pacotes utilizados para produção. Isso permite que a imagem final do Docker (Runner) exclua totalmente a pasta `node_modules` gigante e ferramentas de desenvolvimento (ex: ESLint, Vitest), resultando num container extremamente leve, rápido e seguro.
5. **Estratégia de Testes e Mocks:**
   - **Decisão:** Focar em testes de integração (Page) e testes isolados de componentes com quase 100% de cobertura.
   - **Porquê:** Mocar o provedor do tRPC no frontend garantiu que os testes rodassem rapidamente e sem dependências de rede. Isso valida perfeitamente o comportamento da UI (ex: tratamento de loading e erros) e os callbacks, blindando a aplicação contra regressões.

## Stack Tecnológica

**Front-end:**

- [Next.js 15](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (Ícones)
- [Sonner](https://sonner.emilkowal.ski/) (Notificações Toast)

**Back-end & Integração:**

- [tRPC](https://trpc.io/)
- [Zod](https://zod.dev/) (Validação de schemas)

**Testes & DevOps:**

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Docker](https://www.docker.com/) & Docker Compose
- GitHub Actions

## Variáveis de Ambiente

O projeto requer a configuração de variáveis de ambiente. Utilize o ficheiro `.env.example` como base:

```bash
cp .env.example .env
```

_(O ficheiro já inclui as definições padrão para a porta `3000` e o `NEXT_PUBLIC_APP_URL` configurado para localhost)._

## Como Executar o Projeto

Pode executar a aplicação localmente utilizando o Node.js ou através do Docker.

### Opção 1: Via Docker Compose (Recomendado para Produção)

A forma mais rápida de subir a aplicação completa, isolada e otimizada (build standalone).

1. Execute o comando de build e subida do container:
   ```bash
   docker compose up -d --build
   ```
2. Aceda no seu navegador a `http://localhost:3000`.
3. _(Opcional)_ Para verificar os logs em tempo real:
   ```bash
   docker compose logs -f
   ```
4. Para parar a aplicação:
   ```bash
   docker compose down
   ```

### Opção 2: Localmente (Desenvolvimento)

Certifique-se de que tem o Node.js (v22+) instalado.

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Aceda no seu navegador a `http://localhost:3000`.

## Testes Automatizados

O projeto foca fortemente na confiabilidade do código. Para executar a suíte de testes:

- **Rodar os testes em modo watch:**
  ```bash
  npm run test
  ```
- **Rodar os testes e gerar o relatório de cobertura (Coverage):**
  ```bash
  npm run test:coverage
  ```

---

_Desenvolvido por Willon Rodrigues Freitas._
