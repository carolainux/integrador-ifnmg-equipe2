# 🌱 AgroSensor

<p align="center">

Sistema inteligente de monitoramento climático para agricultura familiar utilizando Internet das Coisas (IoT), arquitetura modular, sistema embarcado, gateway de comunicação e API REST.

Projeto desenvolvido na disciplina de **Projeto Integrador** do **Instituto Federal do Norte de Minas Gerais (IFNMG)**.

</p>

---

## 📖 Sobre o Projeto

O **AgroSensor** é uma solução tecnológica desenvolvida para auxiliar pequenos produtores rurais no monitoramento das condições ambientais de suas plantações por meio de dispositivos de baixo custo baseados em Internet das Coisas (IoT).

O sistema realiza a coleta automática de dados ambientais utilizando sensores conectados a um **Arduino Mega 2560**, encaminha essas informações por meio de um **Gateway Serial**, processa os dados em uma **API REST** desenvolvida em **Node.js** e armazena as leituras em banco de dados para posterior consulta e geração automática de alertas.

O projeto foi concebido considerando a realidade da agricultura familiar do **Vale do Jequitinhonha**, região caracterizada por longos períodos de estiagem e elevada variabilidade climática, buscando oferecer uma ferramenta acessível para apoiar o acompanhamento das condições ambientais e contribuir para a tomada de decisões relacionadas ao manejo agrícola.

---

# 🎯 Objetivos

## Objetivo Geral

Desenvolver uma solução baseada em Internet das Coisas capaz de monitorar variáveis ambientais em tempo real, permitindo o acompanhamento das condições climáticas das plantações e auxiliando produtores rurais na tomada de decisões.

## Objetivos Específicos

- Monitorar temperatura ambiente;
- Monitorar umidade do ar;
- Monitorar umidade do solo;
- Monitorar luminosidade;
- Armazenar automaticamente as leituras ambientais;
- Gerenciar usuários, plantações e sensores;
- Emitir notificações automáticas via WhatsApp em situações críticas;
- Utilizar arquitetura modular para facilitar manutenção e evolução do sistema;
- Empregar hardware de baixo custo compatível com agricultura familiar.

---

# 🚜 Contexto

O AgroSensor foi desenvolvido considerando as necessidades da agricultura familiar presente no município de **Araçuaí** e em outras cidades do **Vale do Jequitinhonha**, região onde fatores climáticos influenciam diretamente a produtividade agrícola.

A proposta consiste em disponibilizar uma solução acessível, utilizando componentes eletrônicos de baixo custo e tecnologias amplamente difundidas, permitindo automatizar parte do monitoramento ambiental normalmente realizado de forma manual pelos produtores.

---

# 🏗 Arquitetura do Sistema

O sistema foi desenvolvido utilizando uma arquitetura em camadas composta por sistema embarcado, gateway de comunicação, backend e banco de dados.

```text
                Sensores Ambientais
                       │
                       ▼
              Arduino Mega 2560
                       │
        Comunicação Serial (USB)
                       │
                       ▼
                Gateway Serial
                       │
                 API REST (HTTP)
                       │
                       ▼
                 Backend Node.js
                       │
     Controllers → Services → Models
                       │
                 Prisma ORM
                       │
                       ▼
                  Banco SQLite
                       │
                       ▼
          Dashboard / Interface Web
                       │
                       ▼
             Notificações WhatsApp
```

---

# 🔄 Fluxo de Funcionamento

O funcionamento do AgroSensor ocorre conforme as etapas abaixo:

1. Os sensores realizam a leitura das variáveis ambientais.

2. O Arduino Mega processa essas leituras e identifica a plantação correspondente.

3. O Gateway recebe as informações pela porta serial.

4. O Gateway realiza validações básicas dos dados recebidos.

5. As leituras são encaminhadas para a API REST.

6. O Backend valida as informações utilizando schemas.

7. Os dados são processados pelas regras de negócio.

8. As leituras são armazenadas no banco de dados.

9. Caso algum limite configurado seja ultrapassado, o sistema gera automaticamente um alerta.

10. O alerta pode ser encaminhado ao produtor por meio do serviço de notificações via WhatsApp.

---

# ✨ Principais Funcionalidades

- Cadastro de usuários;
- Autenticação de usuários;
- Criptografia de senhas;
- Cadastro de plantações;
- Cadastro de sensores;
- Cadastro de dispositivos;
- Associação entre sensores e plantações;
- Recebimento automático das leituras ambientais;
- Armazenamento das leituras em banco de dados;
- Geração automática de alertas;
- Resolução de alertas;
- Notificações via WhatsApp;
- Recuperação de senha por e-mail;
- Status online/offline dos dispositivos;
- Exportação do histórico em CSV;
- API REST para gerenciamento completo do sistema;
- Arquitetura modular baseada em camadas;
- Validação automática dos dados recebidos;
- Comunicação entre Arduino e Backend utilizando Gateway Serial.

---

# 🛠 Tecnologias Utilizadas

## Hardware

- Arduino Mega 2560
- Sensor DHT22
- Sensor de Umidade do Solo HW-080
- Sensor LDR
- Comunicação Serial USB

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- SQLite
- JSON Web Token (JWT)
- bcrypt
- Zod

---

## Gateway

- Node.js
- TypeScript
- SerialPort
- Zod

---

## Banco de Dados

- SQLite
- Prisma ORM

---

## Controle de Versão

- Git
- GitHub

---

## Ferramentas de Desenvolvimento

- Visual Studio Code
- Arduino IDE
- Figma
- BrModelo
- Draw.io

  # 📂 Estrutura do Projeto

```text
AgroSensor
│
├── arduino/
│   └── main/
│       └── main.ino
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── schemas/
│   │   ├── utils/
│   │   ├── lib/
│   │   ├── env/
│   │   └── server.ts
│   └── package.json
│
├── gateway/
│   ├── src/
│   │   ├── env/
│   │   └── serial-gateway.ts
│   └── package.json
│
├── frontend/
│
├── design-ux-ui/
│
├── documentacao/
│   ├── diagramas/
│   ├── requisitos.md
│   ├── regras-negocio.md
│   ├── casos-de-uso.md
│   ├── modelagem-banco.md
│   ├── projeto.md
│   └── referencias.md
│
└── README.md
```

---

# 🧩 Organização da Arquitetura

O backend foi estruturado utilizando arquitetura modular, organizada por responsabilidades.

```text
Cliente
     │
     ▼
Routes
     │
     ▼
Controllers
     │
     ▼
Services
     │
     ▼
Models
     │
     ▼
Prisma ORM
     │
     ▼
SQLite
```

Essa organização proporciona:

- separação de responsabilidades;
- reutilização de código;
- facilidade de manutenção;
- maior legibilidade;
- escalabilidade da aplicação.

---

# 🔐 Segurança

O AgroSensor incorpora mecanismos voltados à segurança da aplicação.

Entre eles destacam-se:

- autenticação baseada em **JSON Web Token (JWT)**;
- armazenamento criptografado das senhas utilizando **bcrypt**;
- validação automática dos dados recebidos utilizando **Zod**;
- middleware de autenticação para proteção das rotas privadas;
- isolamento de plantações, leituras, alertas, sensores e dispositivos por usuário;
- middleware global para tratamento centralizado de erros.

Esses mecanismos contribuem para aumentar a confiabilidade da aplicação e reduzir riscos relacionados ao processamento de informações inválidas ou acessos não autorizados.

---

# 🗄 Banco de Dados

O sistema utiliza banco de dados relacional **SQLite**, acessado por meio do **Prisma ORM**.

As principais entidades implementadas são:

- Usuário
- Plantação
- Sensor
- Dispositivo
- Leitura
- Alerta
- PlantaçãoSensor

Essa modelagem permite:

- gerenciamento de múltiplas plantações;
- associação entre sensores e plantações;
- armazenamento histórico das leituras;
- geração automática de alertas;
- rastreabilidade das informações.

---

# 🌡 Sensores Monitorados

O sistema realiza o monitoramento das seguintes variáveis ambientais:

| Sensor | Variável Monitorada |
|---------|---------------------|
| DHT22 | Temperatura do ambiente |
| DHT22 | Umidade relativa do ar |
| HW-080 | Umidade do solo |
| LDR | Luminosidade |

---

# 📡 Gateway de Comunicação

O Gateway constitui a camada intermediária entre o sistema embarcado e o backend.

Suas responsabilidades incluem:

- estabelecer comunicação serial com o Arduino;
- receber as leituras ambientais;
- validar os dados recebidos;
- identificar a plantação correspondente;
- encaminhar as informações para a API REST.

A utilização dessa camada reduz o acoplamento entre hardware e software, permitindo que alterações em um dos componentes provoquem impacto mínimo sobre os demais módulos da aplicação.

---

# 🚀 Backend

O backend concentra toda a lógica de negócio do sistema.

Entre suas responsabilidades destacam-se:

- autenticação de usuários;
- gerenciamento das plantações;
- gerenciamento de sensores;
- gerenciamento dos dispositivos;
- armazenamento das leituras;
- processamento das regras de negócio;
- geração automática de alertas;
- integração com o serviço de notificações.

---

# 📲 Sistema de Notificações

Quando uma leitura ultrapassa os limites configurados para determinada plantação, o backend realiza automaticamente a geração de um alerta.

Os alertas podem ser enviados ao produtor por meio da integração com o serviço **CallMeBot**, utilizando o aplicativo **WhatsApp** como canal de comunicação.

Essa funcionalidade permite informar rapidamente situações críticas relacionadas às condições ambientais monitoradas.

---

# 🔄 API REST

A API disponibiliza endpoints para gerenciamento completo da aplicação.

Entre os principais recursos encontram-se:

- autenticação;
- usuários;
- plantações;
- sensores;
- dispositivos;
- associação entre plantações e sensores;
- leituras ambientais;
- alertas.

A API é montada em `/api` e usa JWT no cabeçalho `Authorization: Bearer <token>`. As exceções
públicas são cadastro, login, recuperação de senha, `POST /api/leituras` e
`POST /api/alertas/dispositivo-offline` (estes dois para o gateway).

Todas as operações seguem o padrão REST adotado durante o desenvolvimento do projeto.

---

# 📈 Escalabilidade

A arquitetura adotada foi projetada para permitir futuras expansões da aplicação.

Entre as possibilidades destacam-se:

- substituição do banco de dados SQLite por PostgreSQL;
- implantação em servidores Linux;
- execução em ambientes em nuvem;
- integração com novos sensores;
- utilização de múltiplos gateways;
- expansão para novas culturas agrícolas.

---

# 🧪 Testes

Não há test runner, linter, script de typecheck nem CI configurados no repositório. A verificação é
manual:

```bash
cd backend
npx tsc --noEmit
```

Além disso, sobem-se backend e frontend e testam-se os fluxos com `curl` e pelo navegador.

Os testes funcionais já cobriram autenticação, cadastro, plantações, sensores, dispositivos,
leituras, alertas, resolução de alertas, exportação CSV, comunicação Gateway/Backend e notificações.

---

# 🚀 Como Executar o Projeto

## Pré-requisitos

Antes de executar o projeto, certifique-se de possuir instalado:

- Node.js 24.16.0 (versão fixada em `backend/.nvmrc` e `gateway/.nvmrc`)
- npm
- Git
- Python 3 (para servir o frontend estático)
- Arduino IDE (opcional, apenas para gravar o firmware)
- Visual Studio Code (recomendado)

---

## Clonando o Repositório

```bash
git clone https://github.com/carolainux/integrador-ifnmg-equipe2.git
```

Entre na pasta do projeto:

```bash
cd integrador-ifnmg-equipe2
```

---

# ⚙️ Configuração do Backend

Acesse a pasta:

```bash
cd backend
```

Instale as dependências com a versão do Node fixada:

```bash
npm install
```

Não existe `backend/.env.exemplo` nesta branch; crie `backend/.env` manualmente. O contrato está em
`backend/src/env/index.ts`:

```bash
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="uma-string-aleatoria-com-32-caracteres-ou-mais"
CALLMEBOT_PHONE="5533999999999"
CALLMEBOT_APIKEY="sua-chave-callmebot"
PORT=3000

# Opcionais (descomente se for usar)
# BREVO_API_KEY="sua-chave-brevo"
# EMAIL_FROM="no-reply@exemplo.com"
FRONTEND_URL="http://localhost:8081"
```

Sem `BREVO_API_KEY` e `EMAIL_FROM`, o e-mail de recuperação de senha não é enviado; o backend apenas
registra um warning.

Aplique as migrações e gere o client do Prisma:

```bash
npx prisma migrate deploy
npx prisma generate
```

O `prisma generate` é obrigatório após um clone limpo; a saída fica em `backend/generated/prisma`.

Execute o servidor:

```bash
npm run dev
```

A API sobe em `http://localhost:3000/api`.

> **Seed destrutivo:** `npx prisma db seed` apaga todas as tabelas e recria um cenário de
> demonstração. Não rode contra o banco de trabalho. `npm run db-perf` também é destrutivo.

---

# 🖥 Configuração do Frontend

O frontend é estático, sem build e sem `package.json`. Em outro terminal:

```bash
cd frontend
python3 -m http.server 8081
```

Abra `http://127.0.0.1:8081/user/login.html`.

O `frontend/script.js` usa `http://<hostname>:3000/api` por padrão e aceita override em
`localStorage`:

```js
localStorage.setItem('agrosensor_api_base', 'http://localhost:3000/api');
```

---

# 📡 Configuração do Gateway

Em outro terminal:

```bash
cd gateway
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir do modelo:

```bash
cp .env.exemplo .env
```

Ajuste `SERIAL_PORT` para a porta do Arduino (`/dev/ttyUSB0` no Linux, `COM3` no Windows) e
`BACKEND_URL` se o backend não estiver em `http://localhost:3000/api/leituras`.

Inicie o Gateway:

```bash
npm start
```

O Gateway usa 115200 bauds e exige linhas com exatamente 5 campos:
`plantacao_id,umidade_solo,umidade_ar,temperatura,luminosidade`.

---

# 🔌 Configuração do Arduino

Abra o arquivo:

```text
arduino/main/main.ino
```

Utilizando a **Arduino IDE**, selecione:

- Placa: **Arduino Mega 2560**
- Porta Serial correspondente

Realize o upload do programa para a placa.

Após a inicialização, o Arduino começará a enviar automaticamente as leituras dos sensores para o
Gateway a cada 120 segundos.

Para testar sem hardware, renomeie `arduino/main/main.test` para `.ino` e grave esse sketch. O
`plantacao_id` é fixo no firmware e precisa existir no banco.

---

# 📚 Documentação

Toda a documentação produzida durante o desenvolvimento encontra-se disponível na pasta:

```text
documentacao/
```

Os principais documentos incluem:

- Projeto
- Requisitos
- Regras de Negócio
- Casos de Uso
- Modelagem do Banco de Dados
- Diagramas
- Referências Bibliográficas
- Atas de Reunião

---

# 📊 Diagramas

O projeto possui documentação completa de modelagem.

Entre os diagramas disponíveis destacam-se:

- Modelo Conceitual
- Modelo Lógico
- Arquitetura do Sistema
- Casos de Uso
- Diagrama de Classes
- Diagramas de Sequência

Todos os arquivos encontram-se em:

```text
documentacao/diagramas/
```

---

# 🎨 Protótipos

As interfaces do sistema foram desenvolvidas utilizando o **Figma**, contemplando o fluxo completo de interação do usuário com a aplicação.

Os protótipos representam a interface web responsável pelo gerenciamento das plantações, sensores, dispositivos, usuários e visualização das informações monitoradas.

---

# 🌎 Aplicação

O AgroSensor foi desenvolvido para integrar diferentes tecnologias em uma única solução.

Entre seus principais diferenciais destacam-se:

- utilização de hardware de baixo custo;
- arquitetura modular;
- integração entre sistema embarcado e aplicação web;
- processamento automático das leituras;
- persistência das informações;
- geração automática de alertas;
- suporte à agricultura familiar.

---

# 🖥 Frontend

O frontend está integrado à API e cobre as 20 telas/estados previstos nos protótipos. É HTML
estático com Tailwind via CDN e JavaScript centralizado em `frontend/script.js`.

- Entrada e autenticação: `frontend/inicial.html`, `frontend/user/login.html`,
  `frontend/user/cadastro.html`, `frontend/user/senha.html`, `frontend/user/redefinir-senha.html`
- Dashboard e conta: `frontend/dashboard/index.html`, `frontend/dashboard/inicial.html`,
  `frontend/dashboard/alertas.html`, `frontend/dashboard/configuracoes.html`,
  `frontend/dashboard/ajuda.html`, `frontend/dashboard/error.html`, `frontend/user/perfil.html`
- Plantações: `frontend/plantacao/plantacoes.html`, `frontend/plantacao/primeiraplantacao.html`,
  `frontend/plantacao/plantacao-nova.html`, `frontend/plantacao/plantacao-editar.html`,
  `frontend/plantacao/plantacao-detalhe.html`, `frontend/plantacao/plantacao-sucesso.html`
- Sensores e dispositivos: `frontend/sensores/sensores.html`,
  `frontend/dispositivos/dispositivos.html`

A sessão, o `fetch` autenticado, o redirecionamento em 401 e o badge de alertas não vistos ficam em
`frontend/script.js`. O clima usa Open-Meteo, com cache de 30 min e fallback para Araçuaí. A
verificação de WhatsApp ainda é simulada.

---

# 🔮 Trabalhos Futuros

- configuração de API por ambiente, CORS e HTTPS quando houver deploy;
- testes automatizados, lint e CI;
- validação de responsividade e usabilidade (QA);
- realização de testes em propriedades rurais;
- integração com novos sensores ambientais;
- suporte a múltiplos usuários simultâneos;
- migração para banco de dados PostgreSQL.

---

# 🤝 Contribuição

Este projeto foi desenvolvido com finalidade acadêmica.

Sugestões, melhorias e contribuições são bem-vindas por meio da abertura de **Issues** ou **Pull Requests**.

---

# 👥 Equipe

Projeto desenvolvido na disciplina de **Projeto Integrador** do Instituto Federal do Norte de Minas Gerais (IFNMG).

| Integrante | Função |
|------------|--------|
| **Carolaine Costa** | Product Owner (PO) |
| **Alex Alves Santos** | Backend Developer |
| **Jailson Santos da Silva** | Backend Developer |
| **Sandy Barbosa Fonseca** | UX/UI Designer e Frontend |
| **Cybelle Leandro Bittencourt** | Quality Assurance (QA) |

---

# 📖 Artigo Científico

O desenvolvimento do AgroSensor originou um artigo científico descrevendo a arquitetura proposta, a implementação da solução, os resultados obtidos e sua aplicação no contexto da agricultura familiar do Vale do Jequitinhonha.

---

# 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos e educacionais.

Todos os direitos referentes aos códigos, documentação e artefatos produzidos pertencem aos respectivos autores.

---

# ⭐ Considerações

O AgroSensor demonstra a viabilidade da utilização de tecnologias de Internet das Coisas no monitoramento agrícola por meio de uma solução composta por sistema embarcado, gateway de comunicação, backend modular e banco de dados relacional.

A arquitetura implementada evidencia como componentes de baixo custo podem ser integrados para automatizar a aquisição, transmissão, processamento e armazenamento de informações ambientais, contribuindo para o desenvolvimento de ferramentas de apoio à agricultura familiar.

---

<div align="center">

**AgroSensor**

Sistema Inteligente de Monitoramento Climático para Agricultura Familiar

Projeto Integrador • IFNMG

Vale do Jequitinhonha • Minas Gerais • Brasil

</div>
