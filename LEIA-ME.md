# GEOEDUCA — Landing page

Página independente em HTML, CSS e JavaScript, baseada nos recursos do repositório `fonseca-felix/new-tcc`. A cobrança por aluno, os descontos progressivos, o mínimo mensal e a promoção de lançamento foram aprovados em 02/10/2026. O simulador substitui os preços fixos anteriores de Professor e Escola. A contratação online permanece indisponível.

## Visualizar

Abra `index.html` no navegador. O globo utiliza Three.js; GSAP e ScrollTrigger sincronizam sua rotação com a rolagem. As bibliotecas e a textura estão incluídas no pacote. As fontes Space Grotesk e Inter estão incluídas localmente. A apresentação e as animações não precisam carregar recursos de outros sites.

Para uma prévia completa dos links e condições de hospedagem, sirva a pasta por HTTP. Por exemplo, com Python instalado:

```sh
python -m http.server 8080
```

Abra `http://localhost:8080`.

## Integrar ao projeto existente

Copie o conteúdo desta pasta para `frontend/landing/` do projeto. O login existente permanece em `frontend/index.html`. A landing ficará em `/landing/`.

Os botões de acesso usam `../index.html`, que corresponde ao login existente quando a página está nessa pasta. Para outra organização ou um domínio diferente, altere `platformUrl` no início de `script.js` e os três `href` de acesso em `index.html` (mantém o acesso funcional mesmo sem JavaScript).

Ao abrir o pacote isolado, o link da plataforma ainda não terá o login disponível. A página não cria contas, não processa pagamentos nem modifica o sistema existente.

## Regras de cobrança e alteração dos preços

As regras ficam em `pricing.js`, no objeto `GEOEDUCA_PRICING`. Os cálculos usam centavos inteiros. Atualize esse objeto e os textos correspondentes em `index.html` ao mudar os valores (incluindo o exemplo inicial, as condições e as faixas).

- Primeiros 100 alunos: R$ 2,00 por aluno/mês.
- Do 101º ao 300º: R$ 1,50 por aluno/mês.
- Do 301º ao 1.000º: R$ 1,20 por aluno/mês.
- Cada tarifa incide apenas na quantidade da respectiva faixa. Acima de 1.000 alunos, não se extrapola a fórmula: a interface apresenta proposta personalizada.
- Mínimo por contrato: R$ 29,90/mês, inclusive na promoção. Mínimo anual: R$ 299,00.
- Anual antecipado: 10 mensalidades regulares por 12 meses de acesso, com economia aproximada de 16,7%. O equivalente mensal é apenas comparativo.
- Lançamento: 10% nas três primeiras mensalidades, respeitando o mínimo de R$ 29,90. Depois retorna à mensalidade regular. A promoção é exclusiva do mensal, não acumula com o anual e precisa ser selecionada no simulador.
- Professores e escolas usam a mesma tabela. Professores participantes estão incluídos no contrato da escola. Um aluno é contado uma vez dentro do mesmo contrato, mesmo em várias turmas.
- No anual, a quantidade de alunos é definida no contrato. A política para alterar essa quantidade durante a vigência ainda precisa ser definida antes de implementar a contratação.

Exemplo de 300 alunos: 100 × R$ 2,00 + 200 × R$ 1,50 = R$ 500,00/mês; anual R$ 5.000,00 (equivalente a R$ 416,67/mês); lançamento R$ 450,00 nas três primeiras mensalidades e depois R$ 500,00/mês.

O simulador é informativo. Ele não implementa cobrança, controle de vagas, faturamento, cadastro de contratos ou aplicação real de promoções no backend. Sem JavaScript, permanece um exemplo estático de 300 alunos, com o campo de quantidade somente para leitura.

## Arquivos

- `index.html`: conteúdo, seções e navegação.
- `styles.css`: identidade visual e responsividade.
- `script.js`: menu móvel, configuração de acesso, interface do simulador e animações.
- `pricing.js`: faixas, mínimos, descontos e cálculo monetário em centavos.
- `theme.js`: restauração e alternância do modo claro/escuro.
- `layout.js`: ajuste de altura das seções e navegação por âncoras.
- `assets/earth.jpg`: textura do planeta e alternativa quando WebGL não está disponível.
- `assets/earth-data.js`: a mesma textura incorporada para funcionar também ao abrir o HTML diretamente.
- `assets/fonts/`: fontes variáveis Inter e Space Grotesk com suas licenças.
- `assets/vendor/`: Three.js r160, GSAP 3.12.5 e ScrollTrigger 3.12.5.
- `assets/favicon.svg`: ícone do site.
- `assets/cursor-compass.svg`: cursor de bússola minimalista aprovado (24 × 32 px; ponto de clique em 2,2).
- `CREDITOS.md`: fontes e licenças das dependências.

## Comportamento e acessibilidade

A Terra acompanha a rolagem da abertura, sem fixar a seção ou criar uma distância extra de scroll. A navegação segue livremente em todos os dispositivos. Subir a página reverte a rotação. A preferência de movimento reduzido remove a rotação e as animações de entrada. A navegação funciona por teclado e o conteúdo permanece disponível sem JavaScript. O globo depende de suporte a WebGL; quando indisponível, é usada uma imagem estática.

Nenhum valor, limite comercial, depoimento ou número de clientes foi inventado. As regras comerciais aprovadas são apresentadas na landing; a cobrança por aluno ainda precisa ser integrada ao sistema para contratação real.

## Verificações desta entrega

A sintaxe do JavaScript, a existência dos arquivos e os links internos foram conferidos; respostas HTTP dos recursos foram verificadas na entrega anterior. Nesta atualização, os cálculos de todas as quantidades de 1 a 1.000 alunos, os limites de faixa, os mínimos, a promoção e a alternância mensal/anual foram verificados sem navegador. Os estados de quantidade inválida, proposta personalizada e retorno à simulação também foram conferidos em uma simulação do DOM. Na revisão de responsividade, foram conferidas as regras de layout para larguras de 320px a 1920px, as medidas dos textos principais com as fontes locais e a lógica do menu e de seus estados de foco. Esses testes estáticos e de lógica não substituem a inspeção visual. A renderização, o scroll e o menu não puderam ser testados no navegador desta sessão porque o ambiente bloqueou a prévia local. Recomenda-se conferir esses comportamentos no seu navegador antes de publicar.

## Atualização visual

- Removidos o card “Brasil em perspectiva” e o link do GitHub no rodapé.
- Em larguras acima de 850px, as nove seções usam a mesma altura de uma tela (100svh). Se um detalhe expandido, uma tela baixa ou a ampliação do texto fizer o conteúdo exceder essa altura, a seção cresce automaticamente para preservar a leitura. No celular, a altura continua natural.
- Cursor aprovado: bússola minimalista, com metade dourada, metade clara e pivô central. O clique acontece na ponta superior. Usa o cursor nativo do navegador, sem atraso de acompanhamento, apenas em telas maiores que 850px com mouse preciso. Os efeitos GSAP permanecem nos elementos da página.
- Botões com leve acompanhamento do mouse e animações adicionais nos recursos, jogos e etapas. A navegação por teclado continua disponível.
- Cobrança por aluno com faixas progressivas, mínimo mensal, seleção mensal/anual, promoção de lançamento e detalhamento do cálculo por faixa. Controles acessíveis ao teclado.
- Fundo de linhas e pontos animados em todas as seções; processamento limitado a 30 quadros por segundo nas seções visíveis e a 20 em telas de até 850px ou com toque. A resolução dos fundos tem um limite para reduzir o uso de memória em seções longas. Pausa quando a página está em segundo plano. Na preferência de movimento reduzido, o fundo permanece estático.
- Os botões de contratação mostram as condições disponíveis; não há checkout ou pagamento implementado.

## Revisão de responsividade

- Menu recolhido em telas de até 1100px, com alvos de toque de pelo menos 44px, rolagem interna em telas baixas e fechamento com Escape. O foco acompanha a mudança entre os layouts. Sem JavaScript, os links de navegação ficam visíveis.
- Até 850px, a Terra aparece abaixo do texto; recursos, projeto e dúvidas também passam para uma coluna. A Terra continua acompanhando o scroll sem prender a abertura.
- Os jogos usam três colunas no notebook (acima de 850px), duas entre 701px e 850px e uma até 700px. Os controles e o resultado do simulador passam para uma coluna até 850px. As etapas ficam em uma coluna até 480px.
- Tipografia, espaçamentos, botões e valores ajustados para telas pequenas. Os valores anuais permanecem inteiros na mesma linha. Foram contempladas as áreas seguras de aparelhos com recortes na tela e a mudança de orientação.
- A bússola, a paleta, o conteúdo e os preços aprovados foram preservados. No notebook, a altura de uma tela por seção permite alinhamento uniforme; o conteúdo expandido pode ampliar a altura sem ser cortado.
- Antes de publicar, conferir no navegador: 320px, 375px, 768px, 1024px e 1366px; retrato e paisagem; zoom de 200%; navegação por Tab; menu com Escape; preços mensais e anuais; preferência de movimento reduzido.

## Alinhamento, navegação e modo escuro — 02/10/2026

- As seções recebem altura uniforme de 100svh em telas acima de 850px. `layout.js` observa o tamanho do conteúdo e libera a altura quando necessário; não há recorte nem rolagem interna obrigatória para ler as seções.
- Retirados os deslocamentos de 100px/20px nas âncoras. Links internos chegam ao início da seção escolhida. O link de contratação abre as condições e posiciona o começo da seção de dúvidas. O link de início volta ao topo da abertura.
- A navegação considera links diretos com fragmento, histórico do navegador, carregamento de fontes, foco do teclado e preferência de movimento reduzido.
- A Terra continua girando com o scroll, sem fixação da abertura e sem espaçamento extra de pin.
- O simulador foi compactado; a composição do preço e a descrição dos perfis/faixas ficam em detalhes expansíveis. Todos os valores e descontos aprovados foram preservados.
- O botão de lua/sol no cabeçalho alterna os temas e informa a ação por rótulo acessível. A preferência é salva em `localStorage`, apenas neste navegador/origem. O modo claro é o padrão. Se o armazenamento estiver bloqueado, a alternância continua funcionando nesta visita.
- O tema é restaurado antes de carregar o CSS. Não há troca de identidade visual: azul, dourado e verde continuam presentes, com superfícies e texto ajustados para cada modo. O fundo animado também adapta o contraste.
- Refinados os cards, bordas, sombras e espaçamentos. A captura enviada pelo usuário foi usada para identificar o deslocamento da seção anterior.
- Verificados sintaxe, arquivos, âncoras, estados do tema e lógica de altura/navegação em DOM simulado. Os textos principais dos temas tiveram seus contrastes calculados. Os testes de preços continuaram passando. A inspeção visual real, o encaixe de cada seção em cada notebook e o scroll no navegador permanecem pendentes, pois a prévia foi bloqueada no ambiente.
