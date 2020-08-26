[![Build Status](https://travis-ci.org/lucashenrique18/donus-code-challenge.svg?branch=master)](https://travis-ci.org/lucashenrique18/donus-code-challenge)
[![Coverage Status](https://coveralls.io/repos/github/lucashenrique18/donus-code-challenge/badge.svg?branch=master)](https://coveralls.io/github/lucashenrique18/donus-code-challenge?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/rmanguinho/clean-ts-api/badge.svg)](https://snyk.io/test/github/lucashenrique18/donus-code-challenge)

# **Donus Code Challenge**
---
Essa API faz parte de um teste apresentado pela ZTECH.

O objetivo desenvolvido foi criar uma API utilizando Typescript com uma arquitetura bem definida e desacoplada, utilizando TDD (programação orientada a testes) como metodologia de trabalho, Clean Architecture para fazer a distribuição de responsabilidades em camadas, sempre seguindo os princípios do SOLID e, sempre que possível, aplicando Design Patterns para resolver alguns problemas comuns.

---
> ## Regras de Negócio
- Com essa conta é possível realizar transferências para outras contas, depositar e retirar o dinheiro;
- Ao depositar dinheiro na conta, o cliente recebe da Donus mais meio por cento do valor depositado como bônus;
- Ao retirar o dinheiro é cobrado o valor de um por cento sobre o valor retirado, e não aceitamos valores negativos nas contas;
- Transferências entre contas são gratuitas e ilimitadas;
- Ter o histórico de todas as movimentações dos clientes.

> ## APIs Construídas
1. [Cadastro](./requirements/signup.md)
2. [Depositar](./requirements/deposit.md)
3. [Transferir](./requirements/transfer.md)
4. [Sacar](./requirements/withdraw.md)
5. [Listar Movimentações](./requirements/movimentations.md)

> ## Princípios Utilizados
* Single Responsibility Principle (SRP)
* Open Closed Principle (OCP)
* Liskov Substitution Principle (LSP)
* Interface Segregation Principle (ISP)
* Dependency Inversion Principle (DIP)
* Separation of Concerns (SOC)
* Don't Repeat Yourself (DRY)
* You Aren't Gonna Need It (YAGNI)
* Keep It Simple, Silly (KISS)
* Composition Over Inheritance
* Small Commits

> ## Design Patterns Utilizados
* Factory
* Adapter
* Composite
* Dependency Injection
* Abstract Server
* Composition Root
* Builder

> ## Metodologias e Designs Utilizadas
* TDD
* Clean Architecture
* DDD
* Conventional Commits
* Modular Design
* Continuous Integration
* Continuous Delivery
* Continuous Deployment

> ## Melhorias indentificadas
* Log de erro e persistencia de erro em banco
* Token e rota de login
* Nomenclaturas confusas
* Imagem docker
* Documentação de API com Swagger
