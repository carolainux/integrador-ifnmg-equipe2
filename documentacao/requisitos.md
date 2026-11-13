# Requisitos do Sistema — AgroSensor

## Objetivo

O AgroSensor é um sistema de monitoramento climático desenvolvido para apoiar a agricultura familiar por meio da coleta automática de dados ambientais utilizando Internet das Coisas (IoT). A solução integra sensores conectados a um Arduino Mega 2560, um gateway de comunicação serial e um backend responsável pelo processamento, armazenamento e gerenciamento das informações.

---

# Requisitos Funcionais

| Nº | Requisito Funcional |
|----|----------------------|
| RF01 | O sistema deve permitir o cadastro de usuários informando nome, e-mail, telefone e senha. |
| RF02 | O sistema deve permitir a autenticação de usuários utilizando e-mail e senha. |
| RF03 | O sistema deve permitir que usuários autenticados editem seus dados cadastrais. |
| RF04 | O sistema deve permitir a exclusão de usuários cadastrados. |
| RF05 | O sistema deve permitir o cadastro de plantações associadas ao usuário. |
| RF06 | O sistema deve permitir editar e remover plantações cadastradas. |
| RF07 | O sistema deve permitir cadastrar dispositivos responsáveis pelo envio das leituras ambientais. |
| RF08 | O sistema deve permitir cadastrar sensores ambientais disponíveis no sistema. |
| RF09 | O sistema deve permitir associar sensores a uma plantação. |
| RF10 | O usuário deve poder definir valores mínimos e máximos para cada sensor associado à plantação. |
| RF11 | O Gateway deve receber automaticamente as leituras enviadas pelo Arduino por comunicação serial. |
| RF12 | O Gateway deve validar as informações recebidas antes de encaminhá-las ao backend. |
| RF13 | O backend deve armazenar automaticamente as leituras recebidas no banco de dados. |
| RF14 | O sistema deve classificar automaticamente cada leitura conforme os limites configurados para a plantação. |
| RF15 | O sistema deve gerar alertas automaticamente quando uma leitura ultrapassar os limites estabelecidos. |
| RF16 | O sistema deve armazenar o histórico de leituras e alertas gerados. |
| RF17 | O sistema deve enviar notificações via WhatsApp quando configurado para alertas críticos. |
| RF18 | O sistema deve disponibilizar operações REST para gerenciamento de usuários, plantações, sensores, dispositivos, leituras e alertas. |
| RF19 | O usuário deve poder visualizar a lista de dispositivos e sensores disponíveis no momento do cadastro de uma plantação. |

---

# Requisitos Não Funcionais

| Nº | Requisito Não Funcional |
|----|--------------------------|
| RNF01 | O backend deve ser desenvolvido utilizando Node.js e TypeScript. |
| RNF02 | A API deve seguir o padrão arquitetural REST. |
| RNF03 | O sistema deve utilizar arquitetura modular organizada em controladores, serviços, modelos, rotas, middlewares, schemas e utilitários. |
| RNF04 | As senhas dos usuários devem ser armazenadas utilizando criptografia com bcrypt. |
| RNF05 | A autenticação dos usuários deve utilizar JSON Web Token (JWT). |
| RNF06 | As entradas da aplicação devem ser validadas utilizando Zod. |
| RNF07 | O sistema deve utilizar Prisma ORM como camada de acesso ao banco de dados. |
| RNF08 | O banco de dados utilizado deve ser o SQLite. |
| RNF09 | O Gateway deve comunicar-se com o Arduino utilizando comunicação serial USB. |
| RNF10 | A comunicação entre Gateway e Backend deve ocorrer por meio de requisições HTTP para a API REST. |
| RNF11 | O sistema deve registrar automaticamente data e horário de todas as leituras armazenadas. |
| RNF12 | A arquitetura deve permitir a inclusão de novos sensores e dispositivos sem necessidade de alterações significativas na estrutura da aplicação. |
| RNF13 | O sistema deve ser executado localmente, necessitando de acesso à internet apenas para o envio de notificações via WhatsApp. |
