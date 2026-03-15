# Help Desk Ticket System

Sistema full stack para gerenciamento de chamados internos de suporte. Desenvolvido com **Node.js**, **React** e **APIs REST**, com autenticacao, controle de acesso baseado em perfis (RBAC) e fluxo completo de gerenciamento de tickets.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)

---

## Visao Geral

Em empresas de medio e grande porte, a gestao de chamados internos de suporte e frequentemente feita por e-mail ou planilhas, o que gera perda de rastreabilidade, atrasos e falta de visibilidade para gestores.

O **Help Desk Ticket System** resolve esse problema centralizando todo o fluxo de abertura, acompanhamento e resolucao de chamados em uma unica plataforma web. O sistema permite que colaboradores abram solicitacoes de suporte, acompanhem o status em tempo real, e que administradores e tecnicos gerenciem, priorizem e resolvam os chamados de forma organizada.

### Principais objetivos:
- Eliminar a comunicacao descentralizada de chamados
- Oferecer rastreabilidade completa do ciclo de vida de cada ticket
- Garantir controle de acesso e permissoes por perfil de usuario
- Fornecer um fluxo de aprovacao financeira integrado

---

## Funcionalidades

### Gestao de Chamados
- Abertura de chamados com categorias e subcategorias
- Formularios dinamicos por subcategoria (campos customizaveis)
- Atribuicao de chamados a tecnicos responsaveis
- Fluxo de status: **Aberto** > **Em Andamento** > **Finalizado**
- Niveis de prioridade (Baixa, Media, Alta)
- Reabertura de chamados com registro de motivo
- Upload de anexos nos chamados
- Sistema de mensagens internas por chamado (chat)
- Historico completo de chamados

### Autenticacao e Autorizacao
- Login com e-mail e senha
- Autenticacao via **JWT** com expiracao de 4 horas
- Controle de acesso baseado em perfis (RBAC)
- Rotas protegidas no frontend e backend
- Fluxo de recuperacao de senha por e-mail

### Aprovacao Financeira
- Flag de aprovacao obrigatoria em chamados
- Fila de aprovacao para gestores
- Status de aprovacao: Pendente, Aprovado, Rejeitado
- Registro de motivo de aprovacao/rejeicao

### Gestao Administrativa
- CRUD de usuarios com atribuicao de perfil e departamento
- CRUD de categorias e subcategorias
- Gestao de centros de custo e departamentos
- Gestao de tecnicos e permissoes por categoria
- Upload de avatar/foto de perfil
- Ativacao/desativacao de usuarios

### Notificacoes
- Notificacoes em tempo real por evento:
  - Novo chamado criado
  - Chamado finalizado
  - Chamado atribuido
  - Aprovacao aprovada/rejeitada
- Controle de lido/nao lido

---

## Tecnologias Utilizadas

### Frontend
| Tecnologia | Versao | Finalidade |
|---|---|---|
| React | 19.2.0 | Biblioteca de interface |
| Vite | 7.2.4 | Build tool e dev server |
| Material UI (MUI) | 7.3.5 | Biblioteca de componentes UI |
| React Router | 7.10.1 | Roteamento SPA |
| Axios | 1.13.2 | Cliente HTTP |
| jwt-decode | 4.0.0 | Decodificacao de tokens JWT |
| Emotion | 11.14.0 | CSS-in-JS (styling MUI) |

### Backend
| Tecnologia | Versao | Finalidade |
|---|---|---|
| Node.js | - | Runtime JavaScript |
| Express | 5.2.1 | Framework HTTP |
| Sequelize | 6.37.7 | ORM para MySQL |
| MySQL2 | 3.15.3 | Driver de banco de dados |
| JSON Web Token | 9.0.2 | Autenticacao |
| bcrypt | 6.0.0 | Hash de senhas |
| Multer | 2.0.2 | Upload de arquivos |
| CORS | 2.8.5 | Cross-Origin Resource Sharing |
| dotenv | 17.2.3 | Variaveis de ambiente |

### Banco de Dados
| Tecnologia | Finalidade |
|---|---|
| MySQL 8+ | Banco de dados relacional |
| Sequelize CLI | Migrations e seeders |

---

## Arquitetura do Sistema

```
┌─────────────────┐         ┌─────────────────────┐         ┌──────────────┐
│                 │  HTTP   │                     │  SQL    │              │
│  React (SPA)   │ ──────> │  Express API REST   │ ──────> │    MySQL     │
│  Vite + MUI    │ <────── │  Node.js + JWT      │ <────── │   Database   │
│  Port: 5173    │  JSON   │  Port: 8080         │         │              │
└─────────────────┘         └─────────────────────┘         └──────────────┘
        │                           │
        │                           │
   sessionStorage              Sequelize ORM
   (JWT Token)                 (18 Models)
```

### Padrao Arquitetural do Backend

O backend segue o padrao **Repository Pattern** com separacao em camadas:

```
Request → Route → Controller → Service → Repository → Database
```

| Camada | Responsabilidade |
|---|---|
| **Routes** | Definicao de endpoints e middlewares |
| **Controllers** | Recebe requisicoes e retorna respostas HTTP |
| **Services** | Regras de negocio |
| **Repositories** | Acesso a dados (queries Sequelize) |
| **Models** | Definicao de entidades e relacionamentos |
| **Middlewares** | Autenticacao, validacao |

---

## Estrutura de Pastas

```
helpdesk-ticket-system/
│
├── backend/
│   ├── src/
│   │   ├── config/           # Configuracao do banco de dados (Sequelize)
│   │   ├── controllers/      # 17 controllers - Logica de requisicao/resposta
│   │   ├── services/         # 14 services - Regras de negocio
│   │   ├── repositories/     # 14 repositories - Acesso a dados
│   │   ├── models/           # 18 models - Entidades do banco
│   │   ├── routes/           # Definicao de endpoints da API
│   │   ├── middlewares/      # Autenticacao JWT e validacoes
│   │   ├── migrations/       # 23 migrations do banco de dados
│   │   ├── seeders/          # 9 seeders com dados iniciais
│   │   ├── utils/            # Utilitarios (Token, Email)
│   │   ├── storage/          # Configuracao de armazenamento de arquivos
│   │   ├── constants/        # Constantes do sistema (status, etc.)
│   │   ├── app.js            # Configuracao do Express
│   │   └── index.js          # Entry point do servidor
│   ├── .env.example          # Template de variaveis de ambiente
│   ├── .sequelizerc          # Configuracao do Sequelize CLI
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # 11 paginas da aplicacao
│   │   ├── components/       # Componentes reutilizaveis
│   │   ├── routes/           # Configuracao de rotas (React Router)
│   │   ├── context/          # AuthContext - Gerenciamento de estado de auth
│   │   ├── services/         # Axios instance com interceptors
│   │   ├── hooks/            # Custom hooks (notificacoes)
│   │   ├── constants/        # Constantes (roles, etc.)
│   │   ├── assets/           # Imagens e recursos estaticos
│   │   ├── App.jsx           # Componente raiz
│   │   └── main.jsx          # Entry point da aplicacao
│   ├── vite.config.js        # Configuracao do Vite
│   └── package.json
│
├── package.json              # Scripts globais do projeto
├── Procfile                  # Configuracao de deploy
└── README.md
```

---

## Fluxo de Autenticacao

O sistema utiliza **JSON Web Token (JWT)** para autenticacao stateless.

### Fluxo de Login

```
1. Usuario envia email + senha
         │
         ▼
2. POST /api/login
         │
         ▼
3. Backend valida credenciais (bcrypt compare)
         │
         ▼
4. Gera JWT com payload:
   {
     id, nome, email,
     role, department, empresa
   }
   Expiracao: 4 horas
         │
         ▼
5. Token retornado ao frontend
         │
         ▼
6. Frontend armazena em sessionStorage
         │
         ▼
7. Axios interceptor adiciona header:
   Authorization: Bearer <token>
         │
         ▼
8. Requisicoes protegidas validadas
   pelo AuthMiddleware no backend
```

### Protecao de Rotas

- **Backend:** Middleware `AuthMiddleware` valida o token em todas as rotas protegidas. Retorna `401 Unauthorized` se invalido.
- **Frontend:** Componente `PrivateRoute` verifica autenticacao e perfil do usuario antes de renderizar a pagina. Redireciona para `/login` se nao autenticado.
- **Interceptor:** Axios response interceptor captura erros `401` e faz logout automatico.

---

## Banco de Dados

### Diagrama de Entidades

O sistema possui **18 tabelas** gerenciadas pelo Sequelize ORM:

```
┌──────────┐     ┌───────────┐     ┌──────────────┐
│   Role   │────<│   User    │>────│  Department  │
└──────────┘     └─────┬─────┘     └──────────────┘
                       │                    │
                       │               ┌────┴─────┐
                       │               │CostCenter│
                       │               └──────────┘
                 ┌─────┴──────┐
                 │   Called   │
                 │  (Ticket)  │
                 └─────┬──────┘
          ┌────────────┼────────────┐
          │            │            │
   ┌──────┴──────┐ ┌──┴───┐ ┌─────┴────────┐
   │MessageCalled│ │Attach │ │CalledField   │
   │  (Chat)     │ │ments  │ │  Value       │
   └─────────────┘ └──────┘ └──────────────┘
```

### Principais Tabelas

| Tabela | Descricao |
|---|---|
| `User` | Usuarios do sistema com perfil, departamento e centro de custo |
| `Role` | Perfis de acesso (Admin, Tecnico, Usuario) |
| `Permission` | Permissoes granulares do sistema |
| `RolePermission` | Mapeamento N:N entre perfis e permissoes |
| `Called` | Tabela principal de chamados/tickets |
| `StatusCalled` | Status possiveis dos chamados |
| `Priority` | Niveis de prioridade |
| `Category` | Categorias de chamados |
| `Subcategory` | Subcategorias vinculadas a categorias |
| `SubcategoryFormField` | Campos dinamicos por subcategoria |
| `CalledFieldValue` | Valores preenchidos nos campos dinamicos |
| `MessageCalled` | Mensagens/comentarios nos chamados |
| `CalledAttachments` | Arquivos anexados aos chamados |
| `CostCenter` | Centros de custo/empresas |
| `Department` | Departamentos dentro dos centros de custo |
| `UserCategory` | Permissao de usuarios por categoria (N:N) |
| `Notification` | Notificacoes do sistema |
| `PasswordReset` | Tokens de recuperacao de senha |

---

## Como Rodar o Projeto Localmente

### Pre-requisitos

- **Node.js** >= 18.x
- **MySQL** >= 8.0
- **npm** >= 9.x

### Passo 1 - Clonar o repositorio

```bash
git clone https://github.com/samuelguedesss/helpdesk-ticket-system.git
cd helpdesk-ticket-system
```

### Passo 2 - Instalar dependencias

```bash
npm install
```

> Este comando instala as dependencias do backend e frontend automaticamente.

### Passo 3 - Configurar o banco de dados

Crie um banco de dados MySQL:

```sql
CREATE DATABASE sistema_chamado;
```

### Passo 4 - Configurar variaveis de ambiente

Crie o arquivo `.env` na pasta `backend/`:

```bash
cp backend/.env.example backend/.env
```

Edite com suas configuracoes locais (veja a secao [Variaveis de Ambiente](#variaveis-de-ambiente)).

### Passo 5 - Executar migrations e seeders

```bash
# Criar tabelas
npm run migrate:dev

# Popular com dados iniciais
npm run seed:dev
```

### Passo 6 - Configurar o frontend

Crie o arquivo `.env` na pasta `frontend/`:

```
VITE_API_URL=http://localhost:8080
```

### Passo 7 - Iniciar a aplicacao

```bash
# Terminal 1 - Backend (porta 8080)
cd backend && npm run dev

# Terminal 2 - Frontend (porta 5173)
cd frontend && npm run dev
```

Acesse: **http://localhost:5173**

---

## Variaveis de Ambiente

### Backend (`backend/.env`)

```env
# Servidor
PORT=8080

# Banco de Dados
DB_HOST=localhost
DB_NAME=sistema_chamado
DB_USER=root
DB_PASS=root

# Autenticacao
JWT_SECRET=sua_chave_secreta_aqui

# URLs
BASE_URL=http://localhost:8080
FRONTEND_URL=http://localhost:5173

# Email (Microsoft Graph - Opcional)
MAIL_CLIENT_ID=seu_client_id
MAIL_CLIENT_SECRET=seu_client_secret
MAIL_FROM=Chamados noreply@seudominio.com
MAIL_TENANT_ID=seu_tenant_id
MAIL_USER=noreply@seudominio.com
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8080
```

---

## Endpoints da API

### Autenticacao
| Metodo | Endpoint | Descricao |
|---|---|---|
| `POST` | `/api/login` | Autenticar usuario |
| `POST` | `/api/password-reset` | Solicitar recuperacao de senha |
| `GET` | `/api/password-reset/:token` | Validar token de reset |

### Chamados
| Metodo | Endpoint | Descricao |
|---|---|---|
| `POST` | `/api/called` | Abrir novo chamado |
| `GET` | `/api/calleds` | Listar chamados |
| `PATCH` | `/api/calleds/:id` | Atualizar chamado |
| `POST` | `/api/calledsAttachments` | Upload de anexo |
| `GET` | `/api/calledsAttachments/:id` | Listar anexos do chamado |
| `POST` | `/api/messages-called` | Enviar mensagem no chamado |
| `GET` | `/api/messages-called/:id` | Listar mensagens do chamado |

### Usuarios
| Metodo | Endpoint | Descricao |
|---|---|---|
| `GET` | `/api/user` | Listar usuarios |
| `POST` | `/api/user` | Criar usuario |
| `PUT` | `/api/user/:id` | Atualizar usuario |
| `PATCH` | `/api/user/:id` | Atualizar parcialmente |

### Administracao
| Metodo | Endpoint | Descricao |
|---|---|---|
| `GET/POST/PUT` | `/api/categories` | CRUD de categorias |
| `GET/POST/PUT` | `/api/subcategories` | CRUD de subcategorias |
| `GET/POST/PUT` | `/api/departments` | CRUD de departamentos |
| `GET/POST/PUT` | `/api/costCenters` | CRUD de centros de custo |
| `GET/POST` | `/api/user-categories` | Permissoes usuario-categoria |
| `GET/POST/PUT` | `/api/subcategoryFormFields` | Campos dinamicos |

---

## Melhorias Futuras

- [ ] **Testes automatizados** - Implementar testes unitarios e de integracao com Jest e React Testing Library
- [ ] **Dashboard com metricas** - Graficos de tempo medio de resolucao, volume de chamados por categoria e SLA
- [ ] **WebSocket** - Notificacoes em tempo real e atualizacao automatica do chat
- [ ] **Exportacao de relatorios** - Gerar relatorios em PDF/Excel com historico de chamados
- [ ] **SLA (Service Level Agreement)** - Definir prazos por categoria/prioridade com alertas de vencimento
- [ ] **Sistema de avaliacao** - Permitir que o solicitante avalie o atendimento apos finalizacao
- [ ] **Integracao com Slack/Teams** - Notificacoes externas via webhooks
- [ ] **Docker** - Containerizacao completa com Docker Compose
- [ ] **CI/CD** - Pipeline de deploy automatizado com GitHub Actions
- [ ] **Internacionalizacao (i18n)** - Suporte a multiplos idiomas
- [ ] **Modo escuro** - Tema dark mode com MUI

---

## Licenca

Este projeto esta sob a licenca MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Desenvolvido por <a href="https://github.com/samuelguedesss">Samuel Guedes</a>
</p>
