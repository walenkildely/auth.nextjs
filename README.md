# Sistema de Gerenciamento de Usuários

Este projeto é uma aplicação web de gerenciamento de usuários desenvolvida com Next.js e SQLite, atendendo aos requisitos do desafio técnico para a vaga de Fullstack com ênfase em Frontend.

## Funcionalidades

### 1. Cadastro Público de Usuário
- Cadastro público com campos obrigatórios: nome, e-mail e senha
- Campos opcionais: CEP, estado e cidade
- Validação de senha com regras específicas
- Preenchimento automático de estado e cidade a partir do CEP usando API pública

### 2. Administrador Inicial
- Sistema possui um administrador com acesso preconfigurado

### 3. Login Público
- Autenticação via e-mail e senha
- Redirecionamento para área autenticada após login

### 4. Área Autenticada do Usuário Comum
- Mensagem de boas-vindas personalizada
- Visualização dos próprios dados
- Restrição de acesso a dados de outros usuários

### 5. Área do Administrador
- Visualização de lista com todos os usuários
- Edição de nome e senha de usuários
- Exclusão de usuários (exceto administradores)

## Tecnologias Utilizadas

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: SQLite
- **Autenticação**: NextAuth.js
- **Validação de Formulários**: React Hook Form, Zod
- **Integração de API**: Fetch API para consumo da API de CEP

## Instalação e Execução

### Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/auth-user.git
cd auth-user
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="file:./dev.db"

# Better Auth (opcional - será gerado automaticamente se não fornecido)
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

https://www.better-auth.com/docs/installation
```

> **Nota**: Para gerar uma chave secreta forte, você pode usar:
> ```bash
> openssl rand -base64 32
> ```

4. Configure o banco de dados:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Execute o seed para criar o usuário administrador:
```bash
npx prisma db seed
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

7. Acesse a aplicação em `http://localhost:3000`

## Credenciais de Acesso

### Administrador
- Email: admin@example.com
- Senha: Admin@123

## Estrutura do Projeto

```
auth-user/
├── prisma/                  # Configuração do Prisma e migrations
├── public/                  # Arquivos estáticos
├── src/
│   ├── app/                 # Rotas e páginas (App Router)
│   │   ├── admin/           # Área do administrador
│   │   ├── api/             # Rotas da API
│   │   ├── cadastro/        # Página de cadastro
│   │   ├── dashboard/       # Área autenticada do usuário
│   │   └── login/           # Página de login
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/              # Componentes de UI
│   │   └── login/           # Componentes relacionados ao login
│   ├── lib/                 # Utilitários e configurações
│   │   └── auth.ts          # Configuração de autenticação
│   └── schema.ts            # Schemas de validação com Zod
└── ...
```

## Variáveis de Ambiente


| `DATABASE_URL` | URL de conexão com o banco de dados SQLite | `file:./dev.db` |
| `BETTER_AUTH_SECRET` | Chave secreta para autenticação | `sua-chave-secreta-aqui` |
| `BETTER_AUTH_URL` | URL base da aplicação| `http://localhost:3000` |

## Funcionalidades Adicionais Implementadas

- Interface responsiva e moderna com Tailwind CSS e Shadcn UI
- Validação de formulários com feedback visual em tempo real
- Tratamento de erros com mensagens claras para o usuário
- Proteção de rotas baseada em autenticação e autorização
- Feedback visual durante operações assíncronas (loading states)
- Confirmação para ações destrutivas (exclusão de usuários)

## Melhorias Futuras

- Implementação de testes automatizados
- Adição de funcionalidade de recuperação de senha
- Melhorias na acessibilidade
- Expansão das funcionalidades de administração
