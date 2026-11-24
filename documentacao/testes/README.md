# 🧪 Registros de testes — AgroSensor

Esta pasta reúne os registros dos testes feitos pela equipe no Projeto Integrador II: procedimentos, resultados, problemas encontrados e as evidências que sustentam o que está descrito no artigo e no README do projeto.

Todos os testes foram **manuais**, em **ambiente local** (computador da equipe, Windows). O sistema **ainda não foi testado em campo nem com agricultores**.

## Testes registrados

| Data | Teste | Resultado | Registro |
|---|---|---|---|
| 13/11/2026 | Casos de teste da interface integrada, sem o Arduino | Fluxo principal funcionou; 4 problemas encontrados, corrigidos depois | [01-casos-de-teste-interface.md](01-casos-de-teste-interface.md) |
| 19 e 20/11/2026 | Ensaio com o kit de sensores em vasos de plantas | 18 h 05 min de funcionamento contínuo; 370 leituras e 237 alertas gravados | [02-ensaio-kit-sensores.md](02-ensaio-kit-sensores.md) |
| 20/11/2026 | Reteste das correções do PR #130 | 11 verificações aprovadas, 9 observações | [03-reteste-correcoes-pr130.md](03-reteste-correcoes-pr130.md) |
| 24/11/2026 | Recuperação de senha (RF21) | Aprovada após duas correções (PR #137) | [04-recuperacao-senha.md](04-recuperacao-senha.md) |

Os testes do Projeto Integrador I (geração de alertas, registro no banco e envio por WhatsApp) estão descritos no artigo daquela etapa.

## Dados brutos

| Arquivo | Conteúdo |
|---|---|
| [`dados/leituras-ensaio-19-20-11-2026.csv`](dados/leituras-ensaio-19-20-11-2026.csv) | As 370 leituras do ensaio, exportadas pelo próprio sistema. Horários em UTC (no Brasil, subtraia 3 horas). Umidade do solo e luminosidade estão na escala de 0 a 100 do firmware, sem calibração |
| [`dados/gateway-ensaio.log`](dados/gateway-ensaio.log) | Registro do *gateway* durante o ensaio: 371 linhas recebidas, 370 gravadas, desconexão e reconexão do cabo |
| [`dados/reteste-rota-protegida.txt`](dados/reteste-rota-protegida.txt) | Resposta da API a uma requisição sem *token* (401) |
| [`dados/reteste-rota-gateway-publica.txt`](dados/reteste-rota-gateway-publica.txt) | Resposta da rota usada pelo *gateway*, que continua sem exigir *token* |

## O que ainda não foi testado

- Envio do e-mail de recuperação de senha pelo Resend (o teste usou o link exibido no terminal da API).
- Aviso de dispositivo *offline* por WhatsApp.
- Notificações por WhatsApp na versão integrada.
- Correção do descarte de leituras pelo *gateway* (PR #129) com o kit físico; ela foi verificada apenas com uma porta serial simulada.
- Responsividade em aparelhos reais (foi verificada por emulação no navegador).
- Uso em campo e por agricultores.

## Sobre as evidências

As capturas desta pasta foram escolhidas entre as evidências da equipe. Para proteger dados pessoais, **não** foram publicados os arquivos do banco de dados (que guardam e-mails, telefones e senhas criptografadas), capturas com e-mail ou telefone e fotos do local do ensaio. A barra do navegador foi recortada das capturas de tela.
