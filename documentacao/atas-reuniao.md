# Atas de Reunião — Projeto AgroSensor

Este documento registra as reuniões realizadas pela equipe durante o desenvolvimento do projeto integrador AgroSensor.

---

# Reunião 01

## Informações Gerais

Data:
08/05/2026

Horário:
19:00

Participantes:
- Carolaine
- Alex 
- Cybelle
- Sandy
- Jailson

---

## Pauta da Reunião

- Definição do tema do projeto;
- Discussão sobre contexto regional;
- Continuação no andamento do GitHub;
- Definição preliminar das funções da equipe.

---

## Decisões Tomadas

- O tema definido foi:
  AgroSensor - Monitoramento Climático para Agricultura Familiar no Vale do Jequitinhonha.

- O sistema utilizará sensores ambientais conectados ao Arduino Mega 2560.

- Os dados coletados serão:
  - temperatura;
  - umidade do ar;
  - umidade do solo;
  - luminosidade;
  - incidência de chuva.

- O projeto terá foco na agricultura familiar da região de Araçuaí e Vale do Jequitinhonha.

- Foi definida a utilização do GitHub para gerenciamento do projeto e documentação.

---

## Tarefas Definidas

| Tarefa | Responsável | Status |
|---|---|---|
| Criar repositório GitHub | Carolaine | Concluído |
| Organizar documentação inicial | Carolaine | Em andamento |
| Pesquisar sensores | Equipe | Em andamento |
| Levantar referências científicas | Carolaine | Em andamento |

---

## Próximos Passos

- Criar tabela de requisitos;
- Definir sensores do projeto;
- Estruturar backend;
- Desenvolver protótipos das telas;
- Organizar backlog no GitHub Projects.

---
# Reunião 02

Data:
15/05/2026

Horário:
20:00

## Participantes
- Carolaine
- Sandy
- Jailson
- Alex
- Cybelle

---

## Objetivo da Reunião
Realizar alinhamento geral do Projeto Integrador AgroSensor, discutir o andamento atual das atividades, esclarecer dúvidas sobre as funções de cada integrante da equipe e definir os próximos passos do projeto.

---

## Assuntos Discutidos

### 1. Organização das funções da equipe
Foram revisadas as atribuições de cada integrante conforme os papéis definidos no projeto:

- Product Owner (PO)
- Frontend Developer
- UX/UI Designer
- Backend Developers
- QA/Tester

A equipe discutiu dúvidas relacionadas às responsabilidades individuais e às entregas esperadas para a primeira etapa do projeto integrador.

---

### 2. Escopo da primeira entrega
Foi reforçado que nesta primeira etapa do projeto não será necessário entregar o sistema completamente finalizado, mas sim:

- Modelagem conceitual e lógica do banco de dados;
- Requisitos funcionais e não funcionais;
- Estrutura inicial do backend;
- Integração inicial Arduino + sensores;
- Protótipos das telas;
- Guia de estilo;
- Documentação do projeto;
- Artigo acadêmico inicial.

---

### 3. Sensores e hardware definidos
A equipe confirmou a utilização dos seguintes sensores:

- Sensor DHT22 (temperatura e umidade do ar);
- Sensor de umidade do solo HW-080;
- Sensor de luminosidade LDR.

---

### 4. Situação atual do backend
Os integrantes responsáveis pelo backend informaram que:

- o código inicial do Arduino já foi desenvolvido;
- testes preliminares dos sensores já foram realizados;
- a integração inicial entre sensores e Arduino encontra-se em desenvolvimento.

---

### 5. Definição das próximas atividades
Ficaram definidas as seguintes prioridades:

- criação da modelagem do banco;
- elaboração dos requisitos funcionais e não funcionais;
- desenvolvimento dos protótipos das telas;
- documentação técnica do projeto;
- testes dos sensores pela equipe de QA.

---

## Decisões Tomadas

- O projeto seguirá o tema AgroSensor — Monitoramento Climático para Agricultura Familiar no Vale do Jequitinhonha.
- O sistema utilizará sensores ambientais conectados ao Arduino Mega 2560.
- O GitHub será utilizado para gerenciamento das tarefas, documentação e versionamento do projeto.
- As reuniões da equipe serão registradas em atas dentro do repositório.


---
# Reunião 03

Data:
04/09/2026

Horário:
19:00

## Participantes
- Carolaine
- Alex
- Cybelle
- Sandy
- Jailson

---

## Objetivo da Reunião
Realizar o replanejamento das atividades de frontend para o semestre, revisando o que já foi implementado, identificando as telas pendentes e reorganizando o quadro Kanban do GitHub Projects para refletir o trabalho restante.

---

## Assuntos Discutidos

### 1. Levantamento das telas já implementadas
Foi realizado um comparativo entre os protótipos do Figma (pasta `design-ux-ui/prototipos/`) e as páginas já codificadas em `frontend/`. Das 20 telas/estados previstos no protótipo, 7 já estavam implementados:

- Login (`login.html`)
- Cadastro (`cadastro.html`)
- Dashboard (`index.html`)
- Lista de Plantações (`plantacoes.html`)
- Nova Plantação (`plantacao-nova.html`)
- Detalhe da Plantação (`plantacao-detalhe.html`), incluindo gráfico de temperatura/umidade com Chart.js
- Sensores (`sensores.html`)

---

### 2. Telas e estados pendentes
Foram identificadas 13 telas/estados ainda não implementados:

- Tela Inicial (splash)
- Estado vazio - Minhas Plantações
- Tela de Dispositivos e seu estado vazio
- Tela de Alertas
- Tela de Perfil e Editar Perfil
- Tela de Configurações
- Tela de Ajuda
- Modais de sucesso (Nova Plantação e Editar Perfil)
- Estados globais de Carregamento e Erro da aplicação

---

### 3. Divisão de responsabilidades do frontend
Ficou definido que o desenvolvimento das telas restantes será dividido entre Carolaine e Sandy:

- **Carolaine**: Tela de Alertas, Tela de Perfil e Editar Perfil (telas que seguem padrões visuais já existentes no projeto).
- **Sandy e Alex**: Tela Inicial, Tela de Dispositivos, Tela de Configurações e Tela de Ajuda (telas que exigem definição de design a partir do zero).

Os modais de sucesso e estados vazios foram organizados como sub-issues das telas principais correspondentes, para manter a rastreabilidade sem poluir o quadro com cards adicionais.

---

### 4. Reorganização do Kanban (GitHub Projects)
O quadro "AgroSensor" foi atualizado com:

- Criação de issues para as 7 telas já implementadas, movidas para a coluna "Em Revisão", já que estão funcionais visualmente mas ainda não foram validadas pela QA nem integradas com dados reais.
- Criação de issues para as 13 telas/estados pendentes na coluna "Pronto para Iniciar", com definição de responsável, prioridade e tamanho estimado.
- Criação de issues de integração com a API já existente do backend (login/cadastro, dashboard/plantações, gráfico/alertas), mapeadas a partir das rotas reais documentadas em `backend/src/routes/`.
- Criação de issues de QA para teste de fluxo completo e responsividade mobile, atribuídas à Cybelle.

---

### 5. Confirmação do escopo do semestre
Foi reforçado que, com o backend já entregue no semestre anterior, o foco do semestre atual é:

- finalização das telas restantes do frontend;
- integração do frontend com a API já existente;
- validação de responsividade e usabilidade (QA);
- atualização do modelo de negócio;
- consolidação da versão final do artigo científico.

---

## Decisões Tomadas

- O desenvolvimento das telas pendentes foi dividido entre Carolaine e Sandy.
- O quadro Kanban foi reorganizado e populado com todas as issues de frontend pendentes.
- A integração com a API será tratada em issues separadas, após a conclusão das telas visuais.
- A equipe de QA (Cybelle) ficará responsável por validar as telas já implementadas e testar a responsividade do sistema.