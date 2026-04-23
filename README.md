# SenkoSEO

SenkoSEO e um app web estatico para estruturar o processo de criacao de rich content/PDP a partir de ficha tecnica, regras do projeto e referencias confiaveis.

## O que esta versao faz

- organiza os dados do produto
- gera uma estrategia base com justificativas
- recomenda uma sequencia de blocos reutilizaveis
- cria guias de copy e prompts de imagem por bloco
- monta um HTML/CSS inicial para voce editar e publicar
- salva o projeto no `localStorage`

## O que foi removido por nao fazer sentido na V1

- dependencia de varias IAs disputando a mesma tarefa
- promessa de design perfeito sem revisao humana
- pesquisa aberta demais em qualquer fonte da internet
- geracao totalmente "magica" sem explicar decisoes

## Estrutura

- `index.html`: interface principal
- `src/styles.css`: estilo da aplicacao
- `src/app.js`: logica do fluxo e geracao base

## Como usar

1. Abra `index.html` no navegador.
2. Preencha o produto, ficha tecnica, regras e fontes confiaveis.
3. Clique em `Gerar estrategia base`.
4. Revise a paleta, riscos e narrativa sugerida.
5. Ajuste os blocos na etapa `Blocos`.
6. Gere os guias de copy e imagem.
7. Gere o HTML/CSS final e refine antes de publicar.

## Proximos passos recomendados

- conectar um backend/proxy para chamadas reais de IA
- adicionar exportacao de projeto em JSON
- permitir edicao refinada por bloco
- integrar preview em iframe da pagina gerada
