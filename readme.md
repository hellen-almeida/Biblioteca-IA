# Biblioteca Inteligente com IA

Projeto pessoal de **Análise de Dados e Inteligência Artificial** desenvolvido para transformar uma biblioteca organizada em planilhas em uma solução mais prática de pesquisa, análise e consulta.

O projeto evoluiu desde a auditoria e preparação da base até a criação de um **dashboard interativo**, um **assistente especializado no Gemini** e um **MVP web desenvolvido no Google AI Studio**.

---

## Sobre o projeto

A consulta e a análise das informações da biblioteca eram realizadas principalmente por planilhas, tornando a pesquisa de livros, a recuperação de informações e a análise das métricas de leitura mais manuais.

O objetivo do projeto foi desenvolver uma solução capaz de:

* organizar melhor os dados da biblioteca;
* facilitar pesquisas e consultas;
* visualizar métricas do acervo e do histórico de leituras;
* utilizar inteligência artificial para responder perguntas sobre os dados;
* reconhecer quando uma informação não está disponível, sem preenchê-la por suposição.

---

## Jornada do projeto

O desenvolvimento seguiu um fluxo incremental:

**Base original → Auditoria → Limpeza e padronização → Análise exploratória → Dashboard → Assistente especializado → Definição do MVP → Desenvolvimento e validação do MVP**

Durante o processo, a base original foi preservada para rastreabilidade e os dados ausentes foram tratados explicitamente como informação não disponível.

---

## Principais números

### Acervo atual

* **325** livros cadastrados
* **119** lidos
* **190** não lidos
* **13** abandonados
* **2** lendo
* **1** relendo

### Histórico de leituras

* **275** registros históricos
* **2021 e 2025:** 35 leituras em cada ano
* **2026:** 28 leituras registradas até o momento da validação

> Acervo atual e histórico de leituras são tratados como universos separados.

---

## 1. Dashboard

Foi desenvolvido um dashboard para análise visual do acervo e do histórico de leituras.

Entre os recursos implementados estão:

* indicadores do acervo;
* filtros independentes para estante e histórico;
* leituras por ano;
* métricas históricas;
* análise de formatos e origens quando disponíveis;
* indicadores que respondem aos filtros aplicados.

### Principais cuidados

* separação entre coleção atual e histórico;
* tratamento específico de datas com confiabilidade limitada;
* manutenção de indicadores fixos e indicadores sensíveis aos filtros;
* ausência de preenchimento por inferência.

---

## 2. Bibliotecária da Hellen

Foi criada uma Gem personalizada no Google Gemini chamada **Bibliotecária da Hellen**.

O assistente foi configurado para consultar as fontes validadas do projeto e responder perguntas sobre:

* livros presentes no acervo;
* autores;
* editoras;
* status de leitura;
* histórico de leituras;
* métricas disponíveis.

### Regras principais

* utilizar apenas as fontes fornecidas;
* não inventar atributos ausentes;
* separar acervo e histórico;
* sinalizar conflitos ou ausência de informação;
* respeitar as limitações registradas no projeto.

### Validação

Foram aplicadas **8 perguntas de teste**.

**Resultado: 8/8 testes aprovados.**

Entre os testes:

* total de livros no acervo;
* quantidade de lidos e não lidos;
* histórico de leituras;
* ano recorde;
* livros de Agatha Christie;
* livros com status lendo/relendo;
* pergunta sobre gênero literário ausente;
* pergunta sobre quantidade de páginas ausente.

---

## 3. MVP — Minha Estante IA

O MVP web **Minha Estante IA** foi desenvolvido no **Google AI Studio**.

O objetivo foi criar uma interface simples para consulta e análise dos dados da biblioteca.

### Estrutura

O MVP possui quatro áreas principais:

#### Visão Geral

Exibe os principais KPIs do acervo.

#### Biblioteca

Permite:

* pesquisar livros;
* filtrar por autor;
* filtrar por editora;
* filtrar por status;
* filtrar por ano;
* visualizar os registros correspondentes.

#### Histórico e Análises

Permite consultar:

* histórico de leituras;
* filtros por ano;
* autores;
* formatos;
* origens;
* status históricos;
* principais métricas.

#### Pergunte à Minha Estante

Permite realizar consultas em linguagem natural sobre os dados disponíveis.

Exemplos:

> Quantos livros de Agatha Christie eu tenho?

**Resultado validado:** 7 livros.

> Qual foi o ano em que eu mais li?

**Resultado validado:** 2021 e 2025, com 35 leituras cada.

> Quantas páginas eu li em 2026?

**Resultado:** a aplicação reconhece que o número de páginas não está registrado na base e não inventa uma resposta.

---

## Validação do MVP

Os testes funcionais incluíram:

* consulta por autor;
* consulta por status;
* métricas do histórico;
* filtros;
* limpeza dos filtros;
* tratamento de informações ausentes;
* separação entre acervo e histórico;
* consultas em linguagem natural.

Exemplos de resultados:

| Teste                 | Resultado                 |
| --------------------- | ------------------------- |
| Agatha Christie       | 7 livros                  |
| Lendo                 | 2 livros                  |
| Relendo               | 1 livro                   |
| Histórico completo    | 275 registros             |
| Filtro de 2025        | 35 registros              |
| Ano recorde           | 2021 e 2025               |
| Gênero literário      | Informação não disponível |
| Quantidade de páginas | Informação não disponível |

---

## Princípio de qualidade dos dados

Um dos principais critérios do projeto foi evitar que a IA completasse informações inexistentes.

> **Informação ausente é tratada como ausência, não como oportunidade para inferência.**

Exemplos:

* gênero literário não registrado → não inferir;
* quantidade de páginas não registrada → não estimar;
* campos vazios → tratar como informação não disponível, salvo regra documentada;
* datas artificiais em `01/01/AAAA` → utilizar apenas para análise anual quando aplicável.

---

## Tecnologias e ferramentas

### Análise e processamento

* Python
* Google Colab
* Power BI
* Planilhas

### Inteligência Artificial

* ChatGPT
* Google Gemini
* Google Gem
* Google AI Studio
* Claude

### Organização, pesquisa e validação

* NotebookLM
* Manus

### Documentação e apresentação

* Gamma

---

## Entregas finais

O projeto resultou em três soluções principais:

### Dashboard interativo

Visualização e análise do acervo e histórico de leituras.

### Bibliotecária da Hellen

Assistente especializado em consultas baseadas nas fontes validadas.

### Minha Estante IA

MVP web para pesquisa, filtros, análise e interação em linguagem natural.

---

## Materiais de apresentação

* [Apresentação final do projeto](docs/Biblioteca_Inteligente_IA_Apresentacao_Final.pdf)
* [One-page executivo final](docs/Biblioteca_Inteligente_IA_OnePage_Final.pdf)

---

## Estrutura sugerida do repositório

```text
biblioteca-inteligente-ia/
│
├── README.md
│
├── docs/
│   ├── Biblioteca_Inteligente_IA_Apresentacao_Final.pdf
│   ├── Biblioteca_Inteligente_IA_OnePage_Final.pdf
│   ├── Etapa_9_Assistente_Especializado.pdf
│   ├── Etapa_10_Requisitos_MVP.pdf
│   └── Etapa_11_MVP.pdf
│
├── images/
│   ├── dashboard/
│   ├── gem/
│   └── mvp/
│
├── data/
│   └── README.md
│
└── src/
    └── codigo-do-mvp/
```

---

## Observações sobre os dados

Este é um projeto pessoal baseado em uma biblioteca real.

Por privacidade e organização do portfólio, a publicação dos arquivos de dados brutos deve ser avaliada separadamente.

O repositório pode apresentar os resultados, métricas, documentação e código sem necessariamente disponibilizar toda a base original.

---

## Resultado final

O projeto transformou uma base pessoal de livros em uma solução integrada de dados e IA para **pesquisa, análise e consulta de uma biblioteca real**.

Ao longo do desenvolvimento foram aplicados conceitos de:

* qualidade e preparação de dados;
* análise exploratória;
* visualização de dados;
* definição e validação de métricas;
* IA generativa;
* engenharia de prompts;
* validação de respostas;
* definição de requisitos;
* prototipação;
* construção e teste de MVP.
