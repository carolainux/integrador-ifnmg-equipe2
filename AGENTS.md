# AGENTS.md — AgroSensor

Sistema de monitoramento IoT (Projeto Integrador IFNMG). Documentação, identificadores de código e
mensagens ao usuário são **pt-BR**; use `snake_case` em colunas/IDs em vez de introduzir nomes em
inglês.

**Estado atual:** branch `integracao-frontend` incorporada ao `main` em `d7337a1` (frontend + API
integrados). `HANDOFF.md`, `PENDENCIAS.md` e `registro-testes-2026-11-13.md` descrevem este estado.
`exported-session-*.md` é histórico de outro checkout e serve só de contexto.

## Estrutura — projetos independentes, sem root package.json / workspaces

| Caminho | Conteúdo |
|---|---|
| `backend/` | API REST Express 5 + TypeScript + Prisma 7 + SQLite (adapter `better-sqlite3`). Toda a regra de negócio fica aqui. |
| `gateway/` | Ponte serial→HTTP: lê o Arduino e faz POST no backend. |
| `frontend/` | HTML estático + Tailwind via CDN; sem build nem `package.json`. `script.js` centraliza `fetch`, sessão e gráficos. |
| `arduino/main/` | `main.ino` (firmware real) e `main.test` (sketch que finge dados serial; renomear para `.ino` para gravar). |
| `documentacao/` | Requisitos, `regras-negocio.md` (RN01–RN17), casos de uso, fontes BrModelo, atas. |
| `design-ux-ui/` | `design-system/design-system.png` + 20 PNGs numerados em `prototipos/` = especificação da UI. |
| `agrosensorAPIControl/` | Submódulo vazio, não inicializado; sem relação com a API atual — ignorar. |
| `mise.toml`, `opencode.json`, `tui.json`, `README.md`, `HANDOFF.md`, `PENDENCIAS.md`, `registro-testes-*.md` | Arquivos locais/documentação na raiz, fora do código da aplicação. |

## Comandos

**Node fixado**: `.nvmrc` = 24.16.0 em `backend/` e `gateway/`; `.npmrc` com `engine-strict=true` e
`save-exact=true` (instala falha em outra major; não atualize versões sem necessidade).

```bash
# backend (porta 3000, tudo montado em /api)
cd backend && npm install
# criar backend/.env conforme backend/src/env/index.ts (ver abaixo)
npx prisma migrate deploy && npx prisma generate
npm run dev        # tsx watch --env-file=.env; npm start é a versão sem watch

# frontend (segundo terminal)
cd frontend && python3 -m http.server 8081
# abrir http://127.0.0.1:8081/user/login.html

# gateway (terceiro terminal)
cd gateway && cp .env.exemplo .env && npm install && npm start
```

- **Não existe `backend/.env.exemplo` nesta branch** (o `README.md` pode estar desatualizado nesse
  ponto); crie `backend/.env` à mão. O schema Zod em `backend/src/env/index.ts` é o contrato real:
  `DATABASE_URL` (`"file:./prisma/dev.db"`), `JWT_SECRET` (mín. 32), `CALLMEBOT_PHONE` (mín. 10),
  `CALLMEBOT_APIKEY` (mín. 7) e `PORT` (default `3000`). Opcionais: `BREVO_API_KEY`, `EMAIL_FROM`,
  `EMAIL_FROM_NAME` (default `AgroSensor`) e `FRONTEND_URL` (default `http://localhost:8080` — o
  frontend local roda em `8081`, então ajuste). Sem Brevo, o e-mail de recuperação só registra warning.
- Ambos os scripts `npm start`/`npm run dev` usam `--env-file=.env`; o `.env` precisa existir mesmo
  fora do modo watch. Os `.env` reais são ignorados pelo Git.
- **`prisma generate` é obrigatório após clone limpo**: a saída é `backend/generated/prisma`
  (relativo a `backend/prisma/schema.prisma`), ignorada pelo Git via `generated/`. Todos os imports
  usam `../../generated/prisma/client`; sem gerar, o servidor não sobe.
- Prisma 7: schema sem `url` no datasource; `backend/prisma.config.ts` carrega `dotenv/config` e lê
  `process.env.DATABASE_URL`. Portanto o `.env` deve existir **antes de qualquer comando prisma**.
- Seed: `npx prisma db seed` → `prisma/seed.ts`, que **apaga todas as tabelas** antes de inserir e
  ainda recria o estado antigo; não rode contra o banco de trabalho. `npm run db-perf` executa
  `prisma/seed-performance.ts`.
- Gateway `npm start` é `tsx watch --env-file=.env` e precisa de hardware serial real.
  `SERIAL_PORT` default `/dev/ttyUSB0`, mas `gateway/.env.exemplo` vem com `COM3` (Windows);
  `BACKEND_URL` default `http://localhost:3000/api/leituras`, `SERIAL_BAUD` default `115200`.

## Arquitetura do backend

Camadas rígidas, um conjunto de arquivos por entidade em `backend/src/`:

```
routes → controllers → services → models → Prisma
```

- **models** são o único lugar que toca o Prisma, sempre via `src/lib/prisma.ts`. Controllers e
  services não consultam diretamente.
- Cada entidade tem `X.route.ts`, `X.controller.ts`, `X.service.ts`, `X.model.ts` mais schemas Zod em
  `src/schemas/index.ts`; registre o router em `src/routes/index.route.ts`. Schemas de auth ficam em
  `src/schemas/auth.schema.ts`.
- Estilo de export é objeto literal: `export const LeituraModel = { ... }`,
  `export const LeituraController = { ... }`. Controllers usam `parseId(req, 'param')`
  (`src/utils/parse-id.ts`); services usam `findOrThrow(model, id, ...)` (`src/utils/find-or-throw.ts`).
- Erros: services/middlewares fazem `throw` / `next(Object.assign(new Error('msg'), { status }))`;
  `src/middlewares/error-handler.ts` traduz `P2002/P2003/P2014/P2025` para mensagens pt-BR.
  **Toda resposta de erro é `{ erro: "..." }`.** Sucesso é inconsistente de propósito: criar/atualizar
  retorna `{ mensagem, dados }`, leituras retornam o modelo cru.
- `validate(schema)` substitui `req.body` pelo resultado parseado; `auth` preenche
  `req.usuario = { id }` (type augmentation em `src/@types/express.d.ts`).
- **Auth por rota, com isolamento por dono.** Plantações, leituras, alertas, sensores, dispositivos e
  vínculos usam `auth`; o dono é `Plantacao.usuario_id` e os helpers ficam em `src/utils/authz.ts`.
  Exceções públicas para o gateway: `POST /api/leituras` e `POST /api/alertas/dispositivo-offline`.
  Cadastro (`POST /api/usuarios`), login e recuperação de senha também são públicos. Listagens de
  plantações/leituras/alertas são filtradas pelo usuário do token; sensores e dispositivos livres são
  inventário compartilhado, mas os vinculados só aparecem para o dono da plantação. `GET /api/usuarios`
  retorna apenas o próprio usuário. Não presuma que uma rota nova está protegida.
- `POST /api/auth/esqueci-senha` / `/redefinir-senha`: token SHA-256 no banco, 30 min, uso único e
  cooldown de 30 s; envio por Brevo REST em `src/services/email.service.ts` (sem nova dependência).
- Rotas aninhadas (`/usuario/:usuario_id`, `/dashboard/:plantacao_id`) aparecem depois de um `/:id`
  em vários routers; o Express casa apenas um segmento, então funciona, mas use prefixos distintos
  ao adicionar rotas aninhadas.
- Fluxo de ingestão: `POST /api/leituras` → `LeituraService.criar` mantém só os campos cujo sensor
  está vinculado à plantação via `plantacao_sensor` (os demais viram `undefined`), persiste e chama
  `AlertaService.gerarAlertasParaLeitura`, que compara cada valor com
  `plantacao_sensor.limite_atencao`/`limite_critico` usando `sensor.direcao` (`ACIMA`/`ABAIXO`) e envia
  CallMeBot WhatsApp por alerta criado.
- Preferências `notif_temperatura`, `notif_umidade_solo`, `notif_umidade_ar`, `notif_luminosidade` e
  `notif_sensor_offline` em `Usuario` (padrão `true`): alertas continuam sendo gravados; a preferência
  só suprime o WhatsApp. O endpoint de dispositivo offline respeita `notif_sensor_offline`.
- `status` de dispositivo/sensor significa **vinculado**, não conectividade: criar vínculo marca
  `true`, desvincular marca `false`; excluir plantação libera dispositivos **e sensores**.
- `GET /api/dispositivos` e `/api/dispositivos/:id` também devolvem `online`/`ultima_comunicacao`,
  derivados da última leitura da plantação (`LIMITE_ONLINE_MS` = 10 min em
  `backend/src/controllers/dispositivo.controller.ts`). O badge Online/Offline aparece só para
  dispositivos vinculados; `status` continua sendo vínculo.
- `Alerta.resolvido_em` + `PATCH /api/alertas/:id/resolver`; `GET /api/alertas/resumo/:plantacao_id`
  devolve `abertos`/`resolvidos` e `ultimo_alerta` só considera não resolvidos. O status da plantação
  ignora alertas resolvidos.
- `POST /api/alertas/dispositivo-offline` recebe `{ plantacao_id, mensagem }` e só encaminha ao
  WhatsApp — o gateway chama após 25 min de silêncio na serial (`timeoutOfflineMs` =
  `1_500_000` em `gateway/src/serial-gateway.ts`; o comentário "TEST: 20_000" está desatualizado).
- `GET /api/leituras/exportar` (auth) devolve CSV com o histórico do usuário autenticado; Configurações
  oferece só CSV (retenção e PDF foram removidos).
- Leituras: `GET /api/leituras/dashboard/:plantacao_id` devolve `ultima` (`null` se não houver),
  médias e contadores; `GET /api/leituras/plantacao/:plantacao_id?periodo=24h|7d|30d|90d|180d|365d&limite=20`
  devolve histórico paginado e série agregada por bucket (`AVG`). O máximo exibido na tela é calculado
  sobre essa série — ver pendência 11.
- IDs são UUID (`z.uuid()`). Tabelas em snake_case via `@@map`, modelos PascalCase, enums com valores
  pt-BR (`tipoSensor.umidade_ar` → "Umidade do Ar"). `Plantacao.tipo` usa `tipoCultura` (com
  `Morango` e `Cereja`); área/espaçamento são opcionais. Há 24 migrações aplicadas — crie uma nova
  pasta timestamped em `backend/prisma/migrations/` e nunca edite uma migration já aplicada.

## Contrato serial

`arduino/main/main.ino` imprime uma linha CSV terminada em CRLF a cada 120 s a 115200:

```
plantacao_id,umidade_solo,umidade_ar,temperatura,luminosidade
```

O gateway exige **exatamente 5 campos, sem `NaN` e com ID não vazio**; descarta o resto em silêncio.
Trocar a ordem das colunas quebra `processarDadosArduino` em `gateway/src/serial-gateway.ts` e
`criarLeituraSchema`. O `plantacao_id` está fixo no sketch e precisa ser uma plantação real.

`serial-gateway.ts` tem um dedupe deliberately hack (`ultimaLinhaProcessada`) para um bug de linha
duplicada no `ReadlineParser` do serialport v13 — não remova sem validar no hardware.

## Frontend

- **Sem build, sem bundler, sem npm.** Sirva `frontend/` com `python3 -m http.server 8081`; Tailwind
  vem de CDN por página e Chart.js + `apiFetch` ficam em `frontend/script.js`.
- Há ~20 páginas HTML em `user/`, `dashboard/`, `plantacao/`, `sensores/`, `dispositivos/`, além de
  `inicial.html` e `dashboard/error.html`. Cada página referencia `../script.js`, `../style.css` e
  `../assets/...`; mantenha esses `../` corretos ao mover arquivos.
- `API_BASE` usa `location.hostname:3000/api` com override em `localStorage.agrosensor_api_base`
  (`frontend/script.js:20`); sessão, logout, 401 e badge de alertas não vistos são centralizados no
  mesmo arquivo. Cache-busting `?v=20261113` nas páginas que carregam o script.
- Status da plantação é derivado do alerta mais recente **não resolvido**. Clima (`26°C / Céu limpo`)
  e verificação de WhatsApp ainda são simulados; exportação CSV e badge Online/Offline já usam a API —
  ver `PENDENCIAS.md`.
- Os 20 PNGs em `design-ux-ui/prototipos/` continuam sendo a referência visual.

## Verificação

`package.json` de backend/gateway não tem scripts de teste, lint, typecheck nem CI. Verificação é
manual: `npx tsc --noEmit` (TypeScript já é devDependency), `node --check` em scripts inline,
subir o backend e testar endpoints com `curl`. Smoke test: `npx prisma migrate deploy` +
`POST /api/auth/login` — **não rode o seed** contra o banco de trabalho.

## Documentação

Mudança em regra de negócio deve atualizar `documentacao/regras-negocio.md` (códigos RN são
referenciados pelo time), `requisitos.md` e os fontes `.brM3` em `documentacao/diagramas/` na mesma
alteração. `documentacao/atas-reuniao.md` registra decisões do time. `HANDOFF.md` é registro de
sessão, `PENDENCIAS.md` é o backlog (inclui os problemas relatados pela PO) e
`registro-testes-2026-11-13.md` é o relatório de testes; `TODO.md` foi removido por duplicar o backlog.
