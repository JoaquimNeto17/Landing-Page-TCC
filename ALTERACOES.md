# GEOEDUCA — alterações de 04/10/2026

Pacote de revisão: somente os arquivos alterados ou criados nesta rodada. Copie-os mantendo os caminhos abaixo. Não houve publicação automática.

| Arquivo | Trechos alterados/criados |
| --- | --- |
| `index.html` | `<head>`: título, descrição sobre geografia do Brasil, canonical, Open Graph, Twitter Card e nova versão de cache apenas de CSS/script. Favicon existente mantido. |
| `index.html` | `#navigation`: acesso envolvido em `.platform-access`, microtexto `#platform-loading-note` e `aria-describedby`. Mesmo destino da plataforma. |
| `index.html` | `#inicio .hero-description`: descrição especifica geografia do Brasil. `.validation-band` inserida imediatamente após o hero, sem criar uma nova seção de tela inteira. |
| `index.html` | `#recursos .teacher-layout`: nova `.platform-gallery.teacher-gallery`, abas Criação de quiz/Resultados da turma, links Ver imagem completa e placeholders. Cards existentes preservados. |
| `index.html` | `#projeto .large-copy`: substituição somente do primeiro parágrafo pelo texto fornecido. Segundo parágrafo e Conhecer os recursos preservados. |
| `index.html` | `#precos`: descrição resumida; `.billing-row` contém só o seletor; promoção, regras, economia, explicação dinâmica, nota e composição movidas para `.pricing-rules`. `.quote-details` passa de segundo accordion para bloco dentro do primeiro. Estimativa e botão permanecem fora. IDs/data attributes da precificação preservados. |
| `index.html` | `#explorar .closing-note` e rodapé: mensagem fornecida; `.footer-legal` com Privacidade e Termos. |
| `styles.css` | Bloco final “Validação, painel do professor e documentos”: faixa e separadores; acesso/aviso; adaptação da `.teacher-layout`; espaçamento dos elementos movidos no preço; CTA/links legais; layout das páginas legais; adaptações em 1100/700px e notebooks de até 850px de altura. Apenas variáveis existentes. Nenhum bloco `:root` alterado. |
| `script.js` | Primeiro módulo: galeria inicializada por `querySelectorAll`, com estado separado para cada instância; guarda para ausência de controles; rótulo definido por `data-gallery-label`. Mesmos teclados e animação GSAP. |
| `script.js` | Módulo novo antes das solicitações: oculta o aviso fora de `.onrender.com` e remove `aria-describedby`. |
| `script.js` | Fundo ambiente: removida somente a cor e a instrução de desenho dos pontos circulares. Linhas/rolagem/animações permanecem. Nenhuma alteração no módulo de cálculo ou nas mensagens de contratação. |
| `privacidade.html` | Página nova, tema existente, dados/finalidades, responsáveis, acesso/ranking, menores, armazenamento/segurança, retenção, direitos/contato, preferências e fontes oficiais. Informações não confirmadas marcadas `[PREENCHER]`. |
| `termos.html` | Página nova, tema existente, finalidade, acesso manual, menores, uso responsável, contratação, disponibilidade/suporte, conteúdo e encerramento. Condições não fornecidas marcadas `[PREENCHER]`. |
| `assets/og-geoeduca.png` | Imagem nova de compartilhamento, 1200 × 630, tipografia e cores da identidade existente. |
| `assets/screenshots/professor-quiz.png` | Placeholder novo de 1600 × 900, explicitamente identificado como provisório. |
| `assets/screenshots/professor-resultados.png` | Placeholder novo de 1600 × 900, explicitamente identificado como provisório. |
| `LEIA-ME.md` | Seção final desta rodada: instalação, substituição de prints, campos legais, migração do domínio e verificações. |
| `ALTERACOES.md` | Este registro de revisão. |

## Preservado

Valores e lógica de `pricing.js`, faixas/mínimos/promoção/anual; formulário e contatos; header fixa, menu e âncoras; Terra, Copero e cursor; imagens do aluno; `motion.js`, `theme.js` e `layout.js`; paleta e variáveis CSS existentes. O fundo mantém as linhas sem pontos circulares.

## Antes de considerar os documentos finais

Preencha os campos dos responsáveis, e-mail, escola, base legal, armazenamento, permissões/visibilidade do ranking e retenção, assim como as condições comerciais dos Termos. O fato de criar estas páginas não modifica os tratamentos e controles reais da plataforma.

## Verificação

Sintaxe, 4.000 cenários de preço, formulários sem envio real, duas galerias independentes/teclado/movimento reduzido e aviso por hostname em DOM simulado; links/âncoras/ARIA e imagens/metadados; variáveis originais e arquivo de preço comparados. Conferência visual no navegador da publicação pendente.

# Preenchimento conforme respostas — 04/10/2026

Esta rodada altera somente quatro arquivos:

| Arquivo | Trechos |
| --- | --- |
| `privacidade.html` | Descrição e aviso inicial: TCC em testes. Abertura: abrangência de todas as escolas participantes e data do rascunho. Seção 1: nome do projeto, e-mail e papéis pendentes. Seção 2: inventário informado e dados adicionais encontrados no código. Seção 3: perfis informados, restrição por turma pendente de verificação e ranking na área do aluno. Seção 4: autorização de menores permanece pendente. Seção 5: Firebase atual, transição ao Supabase Pro, Render, Vercel, segurança e mensagens. Seção 6: exclusão do cadastro, alcance e retenção pendentes. Seção 7: contato preenchido. Seção 8: armazenamento local observado e registros técnicos pendentes. |
| `termos.html` | Descrição/aviso/abertura: TCC em testes para escolas participantes. Seção 1: projeto/e-mail. Seção 2: professor organiza cadastro e recuperação. Seção 3: autorização permanece pendente. Seção 5: ausência de contratação atual, valores como proposta futura, continuidade indefinida. Seção 6: contato e horário pendente. Seção 7: atividades dos professores e licenças de imagens não comprovadas. Seção 8: exclusão, encerramento e comunicação pendentes. |
| `LEIA-ME.md` | Nova seção explicando dados preenchidos, instalação, revisão do código e pendências. |
| `ALTERACOES.md` | Este registro, com fontes e diferenças identificadas. |

## Informações preenchidas

- Projeto GEOEDUCA, em fase final de testes como TCC; nenhuma contratação comercial atual foi declarada.
- E-mail confirmado: `joaquim.neto.senai@gmail.com`.
- Documentos abrangem escolas participantes, não apenas o SESI CEE 399.
- Dados pedagógicos informados: nome, RM e desempenho. O código também registra autenticação, identificação da turma e data de cadastro.
- Professor organiza cadastro/recuperação e pode excluir o cadastro do aluno; o administrador acompanha a plataforma.
- Firebase utilizado atualmente; Supabase Pro em transição, sem afirmar migração concluída. Plataforma frontend/backend no Render; landing na Vercel.
- Continuidade após o curso ainda indefinida. Condições comerciais futuras não foram inventadas.
- Atividades inseridas pelos professores. Não foi assumida permissão ou licença para imagens de terceiros.

## Revisão técnica pontual e pendências

A leitura é do repositório público, não uma confirmação da versão implantada ou um teste com dados reais. O backend não foi modificado.

1. **Senha legível além do hash:** em `backend/src/routes/alunos.js`, criação/edição guardam `senhaVisivel`; listagens devolvem esse campo. O hash bcrypt não elimina essa cópia. Conferir e corrigir a versão implantada antes de afirmar guarda exclusiva de senha protegida.
2. **Restrição por turma:** as listagens e a exclusão consultadas exigem perfil professor, mas não verificam que a turma/aluno pertença ao professor solicitante. A exclusão tem o mesmo ponto de revisão. A política registra a regra de uso informada, sem declarar a proteção como comprovada.
3. **Ranking para alunos:** a rota `/ranking/turma` e os arquivos da área do aluno consultados exibem nomes/pontuações da turma. Confirmar se estão ativos e a eventual opção global da escola; não afirmar que apenas professor/administrador visualiza toda pontuação.
4. **Exclusão relacionada:** a rotina consultada exclui o documento do aluno. Não foi confirmada a remoção de resultados, respostas, backups ou dados locais. O prazo de retenção dos cadastros ativos e o destino dos dados no fim do curso ainda precisam ser definidos.
5. **Responsabilidade e menores:** o nome do projeto não identifica sozinho a pessoa ou entidade que decide sobre os dados. A fase de testes não confirma a existência de autorização da escola ou responsáveis. Campos continuam pendentes.
6. **Imagens:** ausência de licença informada não foi convertida em autorização de uso. Confirmar origem e permissões.

Fontes consultadas nesta rodada:

- [Rotas de alunos](https://github.com/fonseca-felix/new-tcc/blob/main/backend/src/routes/alunos.js): cadastro, listagens, ranking e exclusão.
- [Servidor](https://github.com/fonseca-felix/new-tcc/blob/main/backend/server.js): montagem das rotas de alunos.
- [Autenticação](https://github.com/fonseca-felix/new-tcc/blob/main/backend/src/controllers/authController.js) e [middleware](https://github.com/fonseca-felix/new-tcc/blob/main/backend/src/middleware/auth.js): login, hash e token.
- [Sessão no navegador](https://github.com/fonseca-felix/new-tcc/blob/main/frontend/js/auth.js).
- [Dashboard do aluno](https://github.com/fonseca-felix/new-tcc/blob/main/frontend/js/aluno/dashboard.js) e [jogos](https://github.com/fonseca-felix/new-tcc/blob/main/frontend/js/aluno/jogos.js): ranking e dados locais.

## Verificação desta rodada

Conferidos links locais, âncoras, referências ARIA, contato preenchido e dados de fase acadêmica. Comparação de hashes confirma que HTML da landing, CSS, scripts, preços, animações e assets não mudaram. Os dois documentos continuam rascunhos com pendências explícitas.


# Equipe responsável identificada — 04/10/2026

- `privacidade.html`, seção 1: acrescentado “Equipe responsável: Joaquim, Pietro, Félix e Luiz” e retirado o campo pendente que solicitava o nome do responsável.
- `termos.html`, seção 1: a mesma identificação, retirando o campo pendente de nome.
- `LEIA-ME.md`: atualizada a situação da identificação da equipe e registrada esta rodada.
- `ALTERACOES.md`: este registro de revisão.

Contato, estilos, links, fase de TCC e demais textos preservados. Continuam pendentes as atribuições no tratamento dos dados, autorizações de testes com menores, retenção, licenças de imagens e verificações técnicas já registradas. Não foram atribuídos papéis individuais ou adicionados nomes completos que não foram fornecidos.


# Informações complementares fornecidas — 04/10/2026

| Arquivo | Trechos modificados nesta rodada |
| --- | --- |
| `privacidade.html` | Seção 1: equipe administra dados/atende contato e professor redefine senhas. Seção 2: RM/nome/sala como cadastro informado, preservando a verificação de dados técnicos e desempenho. Seção 3: equipe como administração e nomes de colegas no ranking, com diferença de pontuações pendente. Seção 4: Jesiane e SESI CEE 399. Seção 5: São Paulo informado, confirmação de regiões por serviço pendente. Seção 6: exclusão completa informada versus alcance técnico não comprovado; período anual aguardando definição exata. Seção 7: equipe atende e professor redefine senha. |
| `termos.html` | Seção 2: redefinição de senha pelo professor e verificação de identidade pendente. Seção 3: autorização/acompanhamento de Jesiane no SESI CEE 399, sem assumir autorização de responsáveis. Seção 6: suporte do professor e contato com equipe. Seção 7: origem em bancos gratuitos, bancos/licenças/créditos ainda pendentes. |
| `LEIA-ME.md` | Nova seção com informações fornecidas e limites das confirmações. |
| `ALTERACOES.md` | Este registro. |

A informação de retenção anual não foi convertida em prazo de 12 meses, ano letivo ou exclusão automática. As respostas sobre exclusão/ranking/inventário e região foram incorporadas como informações da equipe, mantendo a verificação necessária quando o código ou configurações não as comprovam. Não houve alteração de nomes, contato, layout, CSS, scripts, preços ou assets. Conferidos links, âncoras, ARIA e integridade do pacote.


## Esclarecimentos finais informados — 04/10/2026

| Arquivo | Trechos alterados nesta rodada |
| --- | --- |
| `privacidade.html` | Seção 4: autorização da professora Jesiane informada, mas não registrada; dados dos alunos participantes dos testes e documentação/procedimento institucional pendentes. Seção 6: prazo de retenção ainda indefinido, substituindo a referência anterior a período anual. |
| `termos.html` | Seção 3: autorização não registrada e documentação/procedimento com responsáveis pendentes. Seção 7: Codante como fonte informada das bandeiras e fonte de biomas indefinida; endereço, licenças e créditos ainda pendentes. |
| `LEIA-ME.md` | Nova orientação de instalação e distinção entre informações confirmadas e decisões/permissões pendentes. |
| `ALTERACOES.md` | Registro desta rodada com a lista exata de arquivos e trechos. |

Não foram alterados os demais arquivos. Conferidos links locais, referências ARIA, integridade dos pacotes e comparação dos arquivos preservados. Não houve nova verificação de backend ou teste visual em navegador nesta rodada.


## Respostas às 12 perguntas — 04/10/2026

| Arquivo | Trechos alterados nesta rodada |
| --- | --- |
| `privacidade.html` | Seção 1: cadastro/alterações pelos professores; papéis decisórios e base legal pendentes. Seção 4: ausência informada de procedimento com pais/responsáveis. Seção 5: prazo das mensagens indefinido. Seção 6: decisão de excluir dados de testes quando pronta e no encerramento do TCC; execução e alcance pendentes. Seção 7: informações confirmadas pela escola e RM/nome na redefinição; documentação de identidade ainda pendente. |
| `termos.html` | Seção 2: alterações pelos professores e conferência de RM/nome. Seção 3: ausência informada de procedimento com pais/responsáveis. Seção 4: análise de uso indevido pelo professor e encaminhamento à equipe docente. Seção 6: atendimento acadêmico, horários e avisos indefinidos. Seção 7: autorização prevista dos professores; links do Codante, autor e CC0 do conjunto original; biomas encontrados no Google com fontes/licenças pendentes. Seção 8: destino de exclusão definido, procedimento e comunicação pendentes. |
| `LEIA-ME.md` | Orientações de instalação, fatos preenchidos, limites das respostas e referências de revisão. |
| `ALTERACOES.md` | Registro desta rodada. |

Verificação restrita aos textos, links locais, âncoras, referências ARIA, integridade do pacote e preservação dos demais arquivos. Fontes públicas consultadas: documentação do Codante, repositório/licença do autor, orientação do Google e LGPD. Não foi efetuada nova auditoria de backend nem conferência visual em navegador.


## Simplificação para o contexto de TCC — 04/10/2026

Esta rodada substitui os rascunhos públicos anteriores.

| Arquivo | Trechos alterados nesta rodada |
| --- | --- |
| `privacidade.html` | Meta description e conteúdo entre o aviso inicial e o fim do artigo: sete tópicos curtos sobre equipe/contato, dados, acesso, testes com alunos, armazenamento, exclusão e pedidos. Retirados questionários, marcadores de preenchimento e linguagem excessivamente formal. Informações indefinidas e controles em revisão continuam explícitos. |
| `termos.html` | Meta description e conteúdo entre o aviso inicial e o fim do artigo: seis tópicos sobre participação, professores/alunos, uso, funcionamento, materiais/imagens e encerramento. Retiradas condições de estrutura empresarial e perguntas; fase acadêmica e ausência de contratação atual mantidas. |
| `LEIA-ME.md` | Orientação para substituir os quatro arquivos, validade da versão atual frente ao histórico e registro interno dos três pontos concretos ainda não resolvidos. |
| `ALTERACOES.md` | Registro desta simplificação e lista exata de trechos. |

Cabeçalho, rodapé, IDs, classes, modo claro/escuro e demais arquivos preservados. Conferidos links locais, âncoras, ARIA, redução do texto e integridade dos pacotes. Não houve mudança de backend nem inspeção visual em navegador.
