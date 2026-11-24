# Requisitos do Sistema — AgroSensor

## Objetivo

O AgroSensor é um sistema de monitoramento climático desenvolvido para apoiar a agricultura familiar por meio da coleta automática de dados ambientais utilizando Internet das Coisas (IoT). A solução integra sensores conectados a um Arduino Mega 2560, um gateway de comunicação serial e um backend responsável pelo processamento, armazenamento e gerenciamento das informações.

---

# Requisitos Funcionais

> Numeração alinhada ao Quadro 2 do artigo do Projeto Integrador II. A coluna **Situação** indica se a funcionalidade existe no código (“Implementado”) ou se o requisito é cumprido pela solução (“Atendido”); não indica validação em uso real. “Não testado” significa que o código existe, mas a funcionalidade ainda não foi verificada pela equipe.
>
> Mudanças de numeração em relação à versão anterior deste arquivo: os antigos RF20, RF21 e RF22 (resolução de alertas, status online/offline e exportação CSV) passaram a RF27, RF28 e RF29; o antigo RNF14 (isolamento dos dados por usuário) foi incorporado ao RNF05. RF20 a RF26 e RNF14 e RNF15 descrevem a interface e as funções acrescentadas no Projeto Integrador II.

| Nº | Requisito Funcional | Situação |
|----|-------------------|----------|
| RF01 | O sistema deve permitir o cadastro de usuários informando nome, e-mail, telefone e senha. | Implementado |
| RF02 | O sistema deve permitir a autenticação de usuários utilizando e-mail e senha. | Implementado |
| RF03 | O sistema deve permitir que usuários autenticados editem seus dados cadastrais. | Implementado |
| RF04 | O sistema deve permitir a exclusão de usuários cadastrados. | Implementado |
| RF05 | O sistema deve permitir o cadastro de plantações associadas ao usuário, com cultura, área, espaçamento, datas e dispositivo. | Implementado |
| RF06 | O sistema deve permitir editar e remover plantações cadastradas. | Implementado |
| RF07 | O sistema deve permitir cadastrar, editar e remover os dispositivos responsáveis pelo envio das leituras. | Implementado |
| RF08 | O sistema deve permitir cadastrar, editar e remover sensores, informando a direção do alerta. | Implementado |
| RF09 | O sistema deve permitir associar sensores a uma plantação. | Implementado |
| RF10 | O usuário deve poder definir limites de atenção e crítico para cada sensor associado à plantação. | Implementado |
| RF11 | O Gateway deve receber automaticamente as leituras enviadas pelo Arduino por comunicação serial. | Implementado |
| RF12 | O Gateway deve validar as informações recebidas antes de encaminhá-las ao backend. | Implementado |
| RF13 | O backend deve armazenar automaticamente as leituras recebidas no banco de dados. | Implementado |
| RF14 | O sistema deve exibir a situação de cada plantação (ideal, atenção ou crítica). | Implementado |
| RF15 | O sistema deve gerar alertas automaticamente quando uma leitura ultrapassar os limites estabelecidos. | Implementado |
| RF16 | O sistema deve armazenar o histórico de leituras e alertas gerados. | Implementado |
| RF17 | O sistema deve enviar notificações de alertas via WhatsApp, conforme as preferências do usuário. | Implementado |
| RF18 | O sistema deve disponibilizar operações REST para gerenciamento de usuários, plantações, sensores, dispositivos, leituras e alertas. | Implementado |
| RF19 | O usuário deve poder visualizar a lista de dispositivos e sensores disponíveis no momento do cadastro de uma plantação. | Implementado |
| RF20 | O sistema deve manter a sessão do usuário, permitir sair (*logout*) e restringir as telas internas a usuários autenticados. | Implementado |
| RF21 | O sistema deve permitir recuperar a senha por link enviado ao e-mail. | Implementado |
| RF22 | O sistema deve exibir um painel com indicadores e a situação das plantações. | Implementado |
| RF23 | O sistema deve exibir o histórico das leituras em gráfico, por período. | Parcial |
| RF24 | O sistema deve permitir consultar os alertas gerados. | Implementado |
| RF25 | O usuário deve poder escolher quais tipos de alerta geram notificação. | Implementado, não testado |
| RF26 | O sistema deve avisar por WhatsApp a perda de comunicação com o Arduino. | Implementado, não testado |
| RF27 | O sistema deve permitir marcar alertas como resolvidos. | Implementado |
| RF28 | O sistema deve exibir o status online/offline dos dispositivos vinculados, com base na última leitura da plantação. | Implementado |
| RF29 | O sistema deve permitir exportar o histórico de leituras do usuário autenticado em formato CSV. | Implementado |

---

# Requisitos Não Funcionais

| Nº | Requisito Não Funcional | Situação |
|----|-----------------------|----------|
| RNF01 | O backend deve ser desenvolvido utilizando Node.js e TypeScript. | Atendido |
| RNF02 | A API deve seguir o padrão arquitetural REST. | Atendido |
| RNF03 | O sistema deve utilizar arquitetura modular organizada em controladores, serviços, modelos, rotas, middlewares, schemas e utilitários. | Atendido |
| RNF04 | As senhas dos usuários devem ser armazenadas utilizando criptografia com bcrypt. | Atendido |
| RNF05 | A autenticação dos usuários deve utilizar JSON Web Token (JWT), e a API deve permitir acesso apenas aos recursos vinculados ao usuário autenticado. | Atendido |
| RNF06 | As entradas da aplicação devem ser validadas utilizando Zod. | Atendido |
| RNF07 | O sistema deve utilizar Prisma ORM como camada de acesso ao banco de dados. | Atendido |
| RNF08 | O banco de dados utilizado deve ser o SQLite. | Atendido |
| RNF09 | O Gateway deve comunicar-se com o Arduino utilizando comunicação serial USB. | Atendido |
| RNF10 | A comunicação entre Gateway e Backend deve ocorrer por meio de requisições HTTP para a API REST. | Atendido |
| RNF11 | O sistema deve registrar automaticamente data e horário de todas as leituras armazenadas. | Atendido |
| RNF12 | A arquitetura deve permitir a inclusão de novos sensores e dispositivos do mesmo tipo sem alterações no código. | Atendido |
| RNF13 | O sistema deve ser executado localmente, necessitando de acesso à internet apenas para notificações via WhatsApp, consulta do clima e bibliotecas carregadas pela interface. | Atendido |
| RNF14 | A interface deve ser desenvolvida em HTML5, Tailwind CSS, JavaScript e Chart.js. | Atendido |
| RNF15 | A interface deve se adaptar a computador e celular. | Atendido |
