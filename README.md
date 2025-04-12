# 🛒 Product Service API

Este é um serviço de produtos desenvolvido com **Node.js**, **TypeScript**, **Prisma** e estruturado utilizando os princípios de **DDD (Domain-Driven Design)** e **Clean Architecture**. A API faz parte de um ecossistema maior de microserviços voltados para uma aplicação de pedidos, produtos e clientes.

---

## 🚀 Funcionalidades

- ✅ Cadastro de produtos
- ✅ Listagem de produtos
- ✅ Atualização de produtos
- ✅ Exclusão de produtos
- ✅ Validações e tratamento de erros com padrão `Either`
- ✅ Logs com `Pino`
- ✅ Estrutura DDD: separação clara entre domínio, infraestrutura e aplicação

---

## 🧱 Tecnologias e Ferramentas

- **Node.js**
- **TypeScript**
- **Prisma ORM**
- **Express**
- **Pino** (para logs estruturados)
- **Jest** (para testes unitários)
- **Zod** (validações)
- **ESLint & Prettier**

---

## 📁 Estrutura do Projeto

```bash
src/
├── application/         # Casos de uso
├── core/                # Generics e entidades base
├── domain/              # Entidades, enums e regras de negócio
│   └── utils/           # Logger e helpers do domínio
├── http/                # Controllers, rotas e validações
├── infrastructure/      # Prisma, repositórios e middlewares
└── server.ts            # Entry point

```



