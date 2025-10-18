# Sistema de Gerenciamento Financeiro - Front-end

Interface web moderna e intuitiva para o Sistema de Gerenciamento Financeiro Pessoal, desenvolvida com Next.js 15 e TypeScript.

## 📋 Sobre o Projeto

Este é o front-end do Sistema de Gerenciamento Financeiro, uma aplicação web completa que permite aos usuários:

- 👤 Registrar e autenticar usuários
- 💰 Gerenciar contas e despesas pessoais
- 📊 Criar e gerenciar planejamentos financeiros
- 🤖 Gerar planejamentos financeiros automaticamente usando IA
- 🔐 Recuperar senha via email
- 📱 Interface responsiva e moderna

## 🔗 API Backend

Este front-end consome uma API REST. Para mais detalhes sobre a API e todos os endpoints disponíveis, consulte o arquivo [`api.md`](./api.md).

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript tipado para maior segurança e produtividade
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utilitário para estilização
- **[Axios](https://axios-http.com/)** - Cliente HTTP para comunicação com o backend
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários performático
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first

## 📦 Instalação e Configuração

### Pré-requisitos

- **Node.js** v18 ou superior
- **npm** ou **yarn** ou **pnpm**
- **API Backend**

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Executando o Projeto

```bash
# Modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm run start
```

## 🎨 Funcionalidades

### Autenticação
- **Página de Login** - Autenticação de usuários existentes
- **Página de Registro** - Cadastro de novos usuários
- **Recuperação de Senha** - Fluxo completo de reset de senha via email
- **Proteção de Rotas** - Rotas privadas que requerem autenticação

### Gerenciamento de Contas
- **Listar Contas** - Visualização de todas as contas/despesas
- **Adicionar Conta** - Formulário para criar novas contas
- **Editar Conta** - Atualização de contas existentes
- **Remover Conta** - Exclusão de contas (soft delete)
- **Filtros e Busca** - Filtrar contas por diversos critérios

### Planejamentos Financeiros
- **Listar Planejamentos** - Visualização de todos os planejamentos
- **Criar Planejamento Manual** - Formulário para criar planejamentos
- **Gerar com IA** - Criar planejamento automaticamente usando IA
- **Editar Planejamento** - Atualização de planejamentos existentes
- **Remover Planejamento** - Exclusão de planejamentos
- **Acompanhamento** - Visualizar progresso dos objetivos

### Perfil do Usuário
- **Dados Pessoais** - Visualizar e editar informações do usuário
- **Alterar Senha** - Atualizar senha do usuário
- **Configurações** - Preferências da aplicação

## 📄 Licença

Este projeto é um TCC (Trabalho de Conclusão de Curso).

---

**Desenvolvido com ❤️ usando Next.js 15 + TypeScript + TailwindCSS**