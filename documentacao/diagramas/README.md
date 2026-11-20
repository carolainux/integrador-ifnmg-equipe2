# Diagramas do Projeto — AgroSensor

## Objetivo

Esta pasta reúne os principais diagramas produzidos durante o desenvolvimento do AgroSensor, utilizados para documentar a arquitetura da solução, a modelagem do banco de dados e apoiar a implementação do sistema.

Os modelos apresentados representam a estrutura atualmente implementada no projeto.

> **Atualização em 20/11/2026:** as imagens `modelo_conceitual.png` e `modelo_logico.png` foram atualizadas para corresponder ao esquema do banco após a integração do frontend com a API (`backend/prisma/schema.prisma`). Foram incluídos, entre outros, a área, a unidade de área, o espaçamento e o tipo de cultura da plantação, a direção do alerta e o status do sensor, e os dados de recuperação de senha e as preferências de notificação do usuário.

---

# Diagramas Disponíveis

## Modelo Conceitual

Arquivo:

```text
modelo_conceitual.png
```

Representa as entidades do domínio do sistema, seus atributos e relacionamentos, descrevendo a estrutura dos dados em um nível conceitual, independentemente da implementação física do banco de dados.

Principais entidades representadas:

- Usuário
- Plantação
- Sensor
- Dispositivo
- Leitura
- Alerta

Também apresenta os relacionamentos entre essas entidades. A associação entre plantação e sensor aparece como o relacionamento **monitora**, com os atributos `limite_atencao` e `limite_critico`; no modelo lógico, ela corresponde à tabela `plantacao_sensor`.

A versão atual foi redesenhada em SVG (`modelo_conceitual.svg`), que pode ser aberto e editado no navegador ou em editores vetoriais.

---

## Modelo Lógico

Arquivo:

```text
modelo_logico.png
```

Representa a estrutura lógica utilizada na implementação do banco de dados, incluindo:

- tabelas;
- atributos;
- tipos de dados;
- chaves primárias;
- chaves estrangeiras;
- cardinalidades;
- relacionamentos.

Esse modelo corresponde à estrutura utilizada pelo Prisma ORM e ao banco de dados SQLite implementado no projeto.

---

# Arquivos do BrModelo

Além das imagens, também são disponibilizados os arquivos editáveis produzidos no BrModelo:

```text
modelo_conceitual.brM3
modelo_logico.brM3
```

Esses arquivos correspondem à versão de outubro de 2026, anterior à integração, e não incluem os campos acrescentados depois. Para a versão atual, consulte as imagens e o arquivo `modelo_conceitual.svg`.

---

# Ferramenta Utilizada

Os diagramas originais foram elaborados no software **BrModelo**. A versão atualizada do modelo conceitual foi redesenhada em SVG, mantendo a mesma notação (entidades, relacionamentos, cardinalidades e atributos).

---

# Organização da Pasta

```text
diagramas/
├── modelo_conceitual.brM3
├── modelo_conceitual.png
├── modelo_conceitual.svg
├── modelo_logico.brM3
├── modelo_logico.png
└── README.md
```
