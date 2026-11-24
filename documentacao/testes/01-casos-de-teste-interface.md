# 01 — Casos de teste da interface integrada

| Item | Registro |
|---|---|
| Data | 13/11/2026 |
| Versão testada | Integração do *frontend* com a API (PR #122, commit `6fa5561`) |
| Ambiente | Computador da equipe (Windows, Git Bash); API em `localhost:3000`; interface servida com `http-server` em `localhost:8080`; banco SQLite criado pelas migrações e preenchido com os dados de demonstração (`seed`) |
| Leituras | **Sem o Arduino.** As leituras foram enviadas com `curl` para `POST /api/leituras`, no mesmo formato JSON produzido pelo *gateway* |
| Objetivo | Verificar se a interface integrada consulta, grava e exibe os dados pela API e se os alertas aparecem quando um limite é ultrapassado |

## Casos executados

A numeração é a mesma do Quadro 3 do artigo.

| Caso | Verificação | Resultado | Situação |
|---|---|---|---|
| 1 | Sair e tentar abrir uma página interna sem *login* | Redirecionado para o *login* | ✅ Aprovado |
| 2 | *Login* com senha incorreta | Acesso negado, com a mensagem “E-mail ou senha inválidos” | ✅ Aprovado |
| 3 | Cadastro de plantação com sensor e dispositivo | Plantação criada. Na primeira tentativa, o sensor escolhido foi descartado sem aviso, porque não foi incluído pelo botão “Adicionar”; refeito com o botão, a plantação ficou com o sensor | ⚠️ Problema de usabilidade |
| 4 | Recarregar a lista de plantações (F5) | Dados mantidos | ✅ Aprovado |
| 5 | Excluir sensor, plantação e dispositivo | Exclusões feitas. A exclusão de um dispositivo ainda vinculado foi bloqueada, como esperado, mas com a mensagem técnica “Chave estrangeira inválida.” | ⚠️ Mensagem inadequada |
| 6 | Enviar uma leitura (27,5 °C; ar 60%; solo 45; luz 70) | Valores exibidos no painel e no detalhe da plantação | ✅ Aprovado |
| 7 | Enviar 38 °C para um limite de atenção de 35 °C | Alerta de atenção registrado, contado no painel e listado na tela de Alertas, com os filtros corretos | ✅ Aprovado |
| 8 | Conferir o resumo do gráfico depois dos casos 6 e 7 | “Temp. máx.” mostrou 32,8 °C, e não 38 °C: o máximo era calculado sobre as médias de cada intervalo do gráfico, e não sobre as leituras | ❌ Erro de cálculo |
| 9 | Digitar 40 no limite crítico e girar a roda do *mouse* com o campo selecionado | O valor mudou para 39,98 | ⚠️ Problema de usabilidade |

## Problemas encontrados

1. **Caso 8:** máximo do resumo do gráfico calculado sobre as médias por intervalo.
2. **Caso 3:** sensor selecionado e não adicionado é descartado sem aviso.
3. **Caso 5:** mensagem técnica ao tentar excluir um dispositivo em uso.
4. **Caso 9:** campos numéricos de limite mudam com a roda do *mouse*. Merece atenção porque o valor alterado sem intenção é justamente o que define quando um alerta é disparado.

Os quatro foram corrigidos no PR #130 e **não se repetiram no reteste de 20/11/2026** ([03-reteste-correcoes-pr130.md](03-reteste-correcoes-pr130.md)). O erro do caso 8 também apareceu com dados reais no ensaio de 19/11 (máximo exibido de 27,8 °C para uma leitura de 27,9 °C).

## Não testado nesta sessão

- Envio de WhatsApp: os dados do CallMeBot no `.env` eram fictícios; o alerta é gravado mesmo quando o envio falha.
- Recuperação de senha por e-mail.
- Fluxo com o Arduino e o *gateway* (feito no ensaio de 19 e 20/11).
