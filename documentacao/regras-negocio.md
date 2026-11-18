# Regras de Negócio — AgroSensor

## Objetivo

Este documento descreve as principais regras de negócio implementadas no AgroSensor, estabelecendo as condições de funcionamento do sistema, o processamento das leituras ambientais e o gerenciamento das informações relacionadas aos usuários, plantações, sensores, dispositivos e alertas.

---

# Regras de Negócio

| Código | Regra |
|--------|-------|
| RN01 | Apenas usuários cadastrados podem acessar as funcionalidades protegidas da aplicação mediante autenticação. |
| RN02 | Cada usuário pode cadastrar uma ou mais plantações. |
| RN03 | Cada plantação pode possuir um ou mais sensores associados. |
| RN04 | Cada sensor deve estar associado a apenas uma plantação por vez. |
| RN05 | Para cada sensor associado a uma plantação, o usuário deve definir valores mínimos e máximos que servirão como referência para avaliação das leituras. |
| RN06 | O Gateway deve validar as informações recebidas do Arduino antes de encaminhá-las ao backend. |
| RN07 | Apenas leituras válidas podem ser armazenadas no banco de dados. |
| RN08 | Cada leitura recebida deve ser associada automaticamente à plantação correspondente. |
| RN09 | O sistema deve registrar automaticamente a data e o horário de cada leitura armazenada. |
| RN10 | Sempre que uma leitura ultrapassar os limites configurados para a plantação, o sistema deve gerar automaticamente um alerta. |
| RN11 | Os alertas gerados devem permanecer armazenados para consulta posterior. |
| RN12 | Quando configurado, o sistema deve enviar notificações via WhatsApp para alertas críticos utilizando a integração com o serviço CallMeBot. |
| RN13 | O backend deve validar os dados recebidos antes da execução das regras de negócio. |
| RN14 | As senhas dos usuários devem ser armazenadas exclusivamente de forma criptografada utilizando bcrypt. |
| RN15 | As operações protegidas da API somente podem ser executadas mediante autenticação utilizando JSON Web Token (JWT). |
| RN16 | O sistema deve manter separadas as responsabilidades entre controladores, serviços, modelos, rotas, middlewares e utilitários, conforme a arquitetura modular adotada. |
| RN17 | O histórico de leituras ambientais não deve ser alterado após seu armazenamento, garantindo a integridade das informações registradas. |
| RN18 | Cada usuário autenticado só pode acessar, alterar ou excluir suas próprias plantações, leituras, alertas e vínculos. Sensores e dispositivos livres podem ser compartilhados, mas os vinculados a uma plantação pertencem ao dono dela. |
| RN19 | Um alerta pode ser marcado como resolvido; alertas resolvidos não contam como ativos e não influenciam o status da plantação. |
| RN20 | O status de conexão de um dispositivo vinculado é derivado da última leitura da sua plantação; sem leitura nos últimos 10 minutos, o dispositivo é considerado offline. |

---

# Fluxo de Aplicação das Regras

As regras de negócio são executadas conforme o fluxo abaixo:

1. O Arduino realiza a leitura das variáveis ambientais.
2. O Gateway recebe as informações por comunicação serial.
3. O Gateway valida os dados recebidos.
4. As leituras são encaminhadas para a API REST.
5. O backend valida as informações utilizando os schemas da aplicação.
6. As regras de negócio são processadas pelos serviços.
7. As leituras são armazenadas no banco de dados.
8. Caso sejam identificadas condições críticas, o sistema gera automaticamente um alerta.
9. Quando configurado, o alerta é enviado ao usuário por meio da integração com o WhatsApp.
