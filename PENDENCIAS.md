# Pendências — AgroSensor

Atualizado em 17/11/2026.

Itens que ainda faltam além do que já foi integrado. A ordem é uma sugestão de prioridade,
não um bloqueio rígido.

## Alta prioridade

### 1. Configurar entrega real da recuperação de senha

O fluxo já está implementado de ponta a ponta; falta apenas o envio real do e-mail.

- Configurar em `backend/.env`:
  - `BREVO_API_KEY`
  - `EMAIL_FROM`
  - `FRONTEND_URL`
- `FRONTEND_URL` tem default `http://localhost:8080`, mas o frontend local está sendo
  servido em `http://localhost:8081`. Sem ajustar, o link do e-mail aponta para a porta errada.
- Sem `BREVO_API_KEY`/`EMAIL_FROM`, o backend apenas registra um warning e não envia nada
  (`backend/src/services/email.service.ts:11`).
- Bloqueio conhecido: o Brevo não estava enviando o SMS de verificação para criar a API key.
- Depois de configurar, testar o link completo: pedir recuperação, abrir o link e redefinir a senha.

## Média prioridade

### 7. Integração de clima

- As telas ainda mostram `26°C / Céu limpo` fixos em:
  - `frontend/dashboard/index.html:180`
  - `frontend/dashboard/ajuda.html:143`
  - `frontend/dashboard/alertas.html:148`
  - `frontend/dashboard/configuracoes.html:143`
- Decidir entre integrar um provedor (com chave/limite) ou remover o bloco.

## Baixa prioridade / infraestrutura

### 8. Configuração de API por ambiente

- `API_BASE` usa `location.hostname` e aceita override em
  `localStorage.agrosensor_api_base` (`frontend/script.js:20`), mas ainda não há
  configuração formal por ambiente nem proxy.
- Revisar CORS e HTTPS em produção.

### 9. Testes, lint e CI

- O repositório não tem test runner, linter, typecheck script nem CI.
- Hoje a verificação é manual: subir backend, testar com `curl` e abrir as páginas.
- Criar pelo menos um smoke test automatizado de login + leitura + alerta.

### 10. Alinhar seed e documentação

- O seed ainda recria o estado antigo (plantações antigas e dispositivos antigos).
- O banco atual foi ajustado manualmente; rodar `npx prisma db seed` desfaz esse estado.
- Atualizar o seed antes de usá-lo ou documentar que ele não representa o estado atual.
- `README.md` tem informações defasadas (frontend, `.env.exemplo`, status das telas).

## Corrigidos em 17/11/2026 (backlog)

### 3. Alertas com status/resolução — corrigido

- `Alerta.resolvido_em` + `PATCH /api/alertas/:id/resolver`.
- `GET /api/alertas/resumo/:plantacao_id` expõe `abertos`/`resolvidos`; `ultimo_alerta` e o status da
  plantação ignoram alertas resolvidos.
- A tela de alertas mostra o botão "Resolver" e destaca os resolvidos.

### 4. Configurações de dados — corrigido

- Exportação CSV via `GET /api/leituras/exportar` (autenticado, somente dados do usuário).
- Botão CSV em Configurações; select de retenção e botão PDF removidos.

### 6. Status online/offline de dispositivo — corrigido

- `GET /api/dispositivos` e `/api/dispositivos/:id` devolvem `online` e `ultima_comunicacao`
  derivados da última leitura da plantação (janela de 10 min).
- Badge Online/Offline aparece apenas em dispositivos vinculados; `status` continua sendo vínculo.

### 2. Proteger as rotas e isolar dados por usuário — corrigido

- `auth` agora é aplicado em plantações, leituras, alertas, sensores, dispositivos e vínculos.
- O dono é `Plantacao.usuario_id`; listagens e acessos diretos são filtrados pelo usuário do token.
- `GET /api/usuarios` retorna apenas o próprio usuário; `GET /api/usuarios/:id` só permite o próprio id.
- Sensores e dispositivos livres continuam como inventário compartilhado; os vinculados ficam
  restritos ao dono da plantação.
- **Exceções públicas para o gateway:** `POST /api/leituras` e
  `POST /api/alertas/dispositivo-offline`.
- Verificado com `npx tsc --noEmit` e teste de integração em banco temporário com dois usuários.

### 5. Sensores com dados reais de vínculo e última leitura — corrigido

- `GET /api/sensores` agora retorna a plantação vinculada (`plantacoes.plantacao.nome`) e a leitura
  mais recente da plantação (`plantacoes.plantacao.leituras[0]`).
- `frontend/sensores/sensores.html` usa esses dados em "Leitura atual", "Última leitura" e
  "Plantação"; após criar/editar, a lista é recarregada.

## Problemas relatados pela PO (13/11/2026) — corrigidos em 17/11/2026

Origem: `registro-testes-2026-11-13.md`, testes no PR #122 (commit `6fa5561`). Todos os itens deste
bloco foram confrontados com o código da branch `integracao-frontend` incorporada em `d7337a1`.

### 11. "Temp. máx." calculada sobre médias por intervalo (T8) — corrigido

- O detalhe da plantação mostrou 32,8 °C quando a leitura de teste era 38 °C.
- Causa: `buscarSerieGrafico` agregava com `AVG` por bucket e a tela fazia `Math.max(...temperatura)`
  sobre essa série.
- Correção: `LeituraModel.buscarMaxTemperatura` consulta `MAX(temperatura)` nas leituras brutas do
  período; `GET /api/leituras/plantacao/:plantacao_id` devolve `max_temperatura` e o frontend usa esse
  campo em `renderResumo`.

### 12. Sensor selecionado e descartado sem aviso (T3a) — corrigido

- No cadastro de plantação, selecionar o sensor e digitar os limites sem clicar em "Adicionar"
  criava a plantação com "0 Ativos", sem nenhum aviso.
- Correção: `plantacao-nova.html` e `plantacao-editar.html` exibem "Clique em Adicionar para incluir
  o sensor selecionado." e interrompem o submit quando o sensor aberto ainda não foi vinculado.

### 13. Mensagem técnica ao excluir dispositivo em uso (T5b) — corrigido

- A tela mostrava `Chave estrangeira inválida.` em caixa de alerta do navegador.
- Correção: `DispositivoController.deletar` verifica `dispositivo.plantacao` e retorna 409 com o nome
  da plantação vinculada; o erro aparece em `#excluir-erro`, fora de `alert()`.
- O fallback P2003 em `error-handler.ts` também passou a usar mensagem pt-BR.

### 14. Campos numéricos de limite mudam com a roda do mouse (T9) — corrigido

- Digitar 40 no limite crítico e girar a roda 2 vezes com o campo focado registrava 39,98.
- Correção: `onwheel="this.blur()"` nos quatro campos de limite de
  `frontend/plantacao/plantacao-nova.html` e `frontend/plantacao/plantacao-editar.html`; `step="0.01"`
  foi mantido para aceitar decimais.
