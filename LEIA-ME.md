# GEOEDUCA — Landing page

Página independente em HTML, CSS e JavaScript, baseada nos recursos do repositório `fonseca-felix/new-tcc`. O modelo mantém os valores aprovados: três faixas de R$ 2,00, R$ 1,50 e R$ 1,20 por aluno/mês. A imagem enviada é referência do método progressivo de cálculo, não uma nova tabela de preços. O mínimo mensal e os descontos anual e de lançamento foram mantidos. O simulador substitui os preços fixos anteriores de Professor e Escola. As solicitações de acesso e demonstração são encaminhadas por WhatsApp ou e-mail; a liberação e as condições são combinadas manualmente.

## Visualizar

Abra `index.html` no navegador. O globo utiliza Three.js; GSAP e ScrollTrigger sincronizam sua rotação com a rolagem. As bibliotecas e a textura estão incluídas no pacote. As fontes Space Grotesk e Inter estão incluídas localmente. A apresentação e as animações não precisam carregar recursos de outros sites.

Para uma prévia completa dos links e condições de hospedagem, sirva a pasta por HTTP. Por exemplo, com Python instalado:

```sh
python -m http.server 8080
```

Abra `http://localhost:8080`.

## Integrar ao projeto existente

Copie o conteúdo desta pasta para `frontend/landing/` do projeto. O login existente permanece em `frontend/index.html`. A landing ficará em `/landing/`.

O botão “Acessar plataforma” no cabeçalho usa `https://geoeduca-uh27.onrender.com/` diretamente em seu atributo `href`. Para alterar o endereço, atualize esse link marcado com `data-platform-link` em `index.html`. O JavaScript não reescreve o destino. A abertura e o final usam “Solicitar uma demonstração”, com formulário e alternativa de contato direto sem JavaScript.

Ao abrir o pacote isolado, os botões de acesso levam à plataforma online e precisam de conexão com a internet. A página não cria contas, não processa pagamentos nem modifica o sistema existente.

## Regras de cobrança e alteração dos preços

As regras ficam em `pricing.js`, no objeto `GEOEDUCA_PRICING`. Os cálculos usam centavos inteiros. Atualize esse objeto e os textos correspondentes em `index.html` ao mudar os valores (incluindo o exemplo inicial, as condições e as faixas).

- Primeiros 100 alunos: R$ 2,00 por aluno/mês.
- Do 101º ao 300º: R$ 1,50 por aluno/mês.
- Do 301º ao 1.000º: R$ 1,20 por aluno/mês.
- Cada tarifa incide apenas na quantidade da respectiva faixa. Não se aplica a tarifa da última faixa a todos os alunos. Acima de 1.000 alunos, o simulador apresenta proposta personalizada, sem inventar uma nova tarifa.
- Mínimo por contrato: R$ 29,90/mês, inclusive na promoção. Mínimo anual: R$ 299,00.
- Anual antecipado: 10 mensalidades regulares por 12 meses de acesso, com economia aproximada de 16,7%. O equivalente mensal é apenas comparativo.
- Lançamento: 10% nas três primeiras mensalidades, respeitando o mínimo de R$ 29,90. Depois retorna à mensalidade regular. A promoção é exclusiva do mensal, não acumula com o anual e precisa ser selecionada no simulador.
- Professores e escolas usam a mesma tabela. Professores participantes estão incluídos no contrato da escola. Um aluno é contado uma vez dentro do mesmo contrato, mesmo em várias turmas.
- No anual, a quantidade de alunos é definida no contrato. A política para alterar essa quantidade durante a vigência ainda precisa ser definida antes de implementar a contratação.

Exemplo de 300 alunos: 100 × R$ 2,00 + 200 × R$ 1,50 = R$ 500,00/mês; anual R$ 5.000,00 (equivalente a R$ 416,67/mês); lançamento R$ 450,00 nas três primeiras mensalidades e depois R$ 500,00/mês. A média regular é R$ 1,67 por aluno/mês, arredondada a duas casas decimais. Para 600 alunos: 100 × R$ 2,00 + 200 × R$ 1,50 + 300 × R$ 1,20 = R$ 860,00/mês.

O simulador é informativo. Ele não implementa cobrança, controle de vagas, faturamento, cadastro de contratos ou aplicação real de promoções no backend. Sem JavaScript, permanece um exemplo estático de 300 alunos, com o campo de quantidade somente para leitura.

## Arquivos

- `index.html`: conteúdo, seções e navegação.
- `styles.css`: identidade visual e responsividade.
- `script.js`: menu móvel, formulário de solicitação, interface do simulador, fundo animado, Terra e interação dos botões.
- `motion.js`: entradas das seções e barra discreta de progresso sob o cabeçalho.
- `pricing.js`: faixas, mínimos, descontos e cálculo monetário em centavos.
- `theme.js`: restauração e alternância do modo claro/escuro.
- `layout.js`: ajuste de altura das seções e navegação por âncoras.
- `assets/copero.png`: imagem original do mascote fornecida pelo usuário, sem alteração.
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

A sintaxe do JavaScript, os recursos locais e os links internos foram conferidos. Os testes sem navegador cobrem as três faixas de preços, limites de faixa, exemplos, mínimos, anual, promoção, média por aluno e estados do simulador. A navegação considera a altura real do cabeçalho fixo, início, âncoras, detalhes expansíveis, histórico, foco e movimento reduzido. Testes estáticos e de DOM simulado não substituem a inspeção visual. A prévia local foi bloqueada pelo ambiente desta sessão: renderização, encaixe das seções, menu e scroll reais continuam pendentes para conferir no navegador antes de publicar.

## Atualização visual

- Removidos o card “Brasil em perspectiva” e o link do GitHub no rodapé.
- Em larguras acima de 850px, a abertura usa 100svh e as demais seções ocupam a área útil da tela abaixo do cabeçalho fixo (100svh menos a altura da header). Se um detalhe expandido, uma tela baixa ou a ampliação do texto fizer o conteúdo exceder essa altura, a seção cresce automaticamente para preservar a leitura. No celular, a altura continua natural.
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
- A bússola, a paleta, o conteúdo e os preços aprovados foram preservados. No notebook, as seções preenchem a tela disponível abaixo da navegação fixa; o conteúdo expandido pode ampliar a altura sem ser cortado.
- Antes de publicar, conferir no navegador: 320px, 375px, 768px, 1024px e 1366px; retrato e paisagem; zoom de 200%; navegação por Tab; menu com Escape; preços mensais e anuais; preferência de movimento reduzido.

## Alinhamento, navegação e modo escuro — 02/10/2026

- Em telas acima de 850px, a abertura usa 100svh e as demais seções usam 100svh menos a altura da header fixa. `layout.js` observa o tamanho do conteúdo e libera a altura quando necessário; não há recorte nem rolagem interna obrigatória para ler as seções.
- Links internos posicionam o início da seção escolhida imediatamente abaixo do cabeçalho fixo, usando sua altura real. O deslocamento acompanha o tamanho da header, inclusive no celular. O link de contratação abre as condições e posiciona o começo da seção de dúvidas. O link de início volta ao topo da abertura.
- A navegação considera links diretos com fragmento, histórico do navegador, carregamento de fontes, foco do teclado e preferência de movimento reduzido.
- A Terra continua girando com o scroll, sem fixação da abertura e sem espaçamento extra de pin.
- O simulador foi compactado; a composição do preço e a descrição dos perfis/faixas ficam em detalhes expansíveis. Todos os valores e descontos aprovados foram preservados.
- O botão de lua/sol no cabeçalho alterna os temas e informa a ação por rótulo acessível. A preferência é salva em `localStorage`, apenas neste navegador/origem. O modo claro é o padrão. Se o armazenamento estiver bloqueado, a alternância continua funcionando nesta visita.
- O tema é restaurado antes de carregar o CSS. Não há troca de identidade visual: azul, dourado e verde continuam presentes, com superfícies e texto ajustados para cada modo. O fundo animado também adapta o contraste.
- Refinados os cards, bordas, sombras e espaçamentos. O posicionamento das âncoras considera a navegação fixa.
- Verificados sintaxe, arquivos, âncoras, estados do tema e lógica de altura/navegação em DOM simulado. Os textos principais dos temas tiveram seus contrastes calculados. Os testes de preços continuaram passando. A inspeção visual real, o encaixe de cada seção em cada notebook e o scroll no navegador permanecem pendentes, pois a prévia foi bloqueada no ambiente.


## Percurso e animações — 02/10/2026

- Abertura com “Conhecer a plataforma” e link secundário “Ver preços”. Removidos a trilha lateral, o card fixo de simulação, os benefícios repetidos da abertura e as chamadas extras para simular na seção de recursos e no projeto.
- A barra fina sob o cabeçalho indica a posição da leitura depois dos primeiros 80px de rolagem. Não há sobreposição de cards fixos ao conteúdo.
- GSAP/ScrollTrigger mantêm entradas suaves de títulos, recursos, jogos, etapas, projeto, preços, dúvidas e Copero. A Terra continua girando com o scroll e os cards aparecem suavemente durante a rolagem. Retirados a rotação dos ícones e o diagrama extra de coordenadas.
- A preferência de movimento reduzido mantém entradas, Terra e fundos estáticos. Não há fixação de seções nem distâncias extras de scroll. O conteúdo permanece disponível sem JavaScript.
- Sem rastreamento, analytics ou novas promessas comerciais. A inspeção visual real continua pendente porque a prévia local foi bloqueada pelo ambiente.


## Header fixa, cálculo por faixas e Copero — 02/10/2026

- Header fixa com fundo azul de contraste consistente. A linha horizontal de progresso fica na sua borda inferior. Removida a barra extra no topo para evitar duplicação.
- O menu continua navegando por âncoras; o início da seção fica abaixo da header, sem título coberto. O link de início sempre volta a zero. No notebook, as demais seções passam a preencher a área útil sob a header; conteúdo longo ou detalhes abertos continuam expandindo a seção.
- Mantidos os dois temas, a Terra, o cursor, o fundo animado, as animações GSAP, a promoção mensal de lançamento de 10% por três meses, o anual de dez mensalidades e o mínimo de R$ 29,90/mês.
- Três faixas calculadas em todos os estados do simulador, exemplo inicial de 300 alunos, composição com três linhas e média equivalente por aluno. A média exibida é arredondada; o total contratado continua sendo o valor calculado pelas faixas.
- Copero apresentado na seção de jogos, com a imagem original e o texto aprovado sobre a capivara e a fauna brasileira. Entrada GSAP leve, desativada quando há preferência de movimento reduzido. A imagem original é preservada; o retrato usa uma moldura circular branca nos dois temas.
- A página continua informativa. Não foram implementados contratação, envio de formulário ou checkout.


## Correção da interpretação da referência — 02/10/2026

Restaurados os valores aprovados e os intervalos originais. A referência enviada orienta o método progressivo: cobrar separadamente os alunos de cada faixa e somar os subtotais. A header fixa, o Copero, os temas e as animações foram preservados. A atualização visual dessa etapa incluiu `index.html`, `styles.css`, `motion.js` e `LEIA-ME.md`, para substituir na mesma pasta da landing. Os arquivos de preços e os assets da última entrega corrigida continuam válidos.


## Retorno ao estilo mais simples — 02/10/2026

Mantida a base visual anterior com azul, dourado, verde, modos claro/escuro, header fixa, Copero e globo. Removidos os elementos adicionais de navegação e conversão que ocupavam a tela. Restauradas as margens originais do conteúdo. Os valores continuam R$ 2,00 / R$ 1,50 / R$ 1,20 nas três faixas aprovadas, com mínimo mensal, anual e promoção preservados. Foram conferidos os links e a ausência de referências à trilha e ao card removidos; a barra de progresso e as animações continuam funcionando com a preferência de movimento reduzido respeitada.


## Barra lateral, texto e cards — 02/10/2026

- Barra de rolagem nativa com largura fina e cores próprias para os temas claro/escuro. São usadas propriedades CSS padrão, com regras WebKit como alternativa. A aparência final depende do navegador e do sistema operacional; não há substituição do scroll nativo ou captura da roda do mouse.
- Retirados os slogans repetidos na abertura, palavras decorativas grandes dos jogos, rodapés de categoria repetidos, selo do projeto e o painel de recursos que repetia os quatro itens da seção. O projeto e a FAQ de contratação foram resumidos. As condições comerciais completas continuam nos detalhes do simulador.
- Quatro recursos organizados em cards com duas colunas (uma até 700px). Os três jogos mantêm títulos, descrições e ícones; usam a mesma superfície e recebem cor apenas no detalhe superior/ícone. Recursos, etapas, FAQ, mascote e simulador compartilham tokens de borda, raio e superfície.
- Tema escuro com cards azul-escuros uniformes, texto claro, descrições em cinza claro e acentos dourados/verdes/azuis com contraste. Evitados fundos de jogos com tonalidades e textos incompatíveis. A imagem original do Copero fica em uma moldura circular branca.
- Mantidos a header fixa, as âncoras abaixo dela, os dois temas salvos, a Terra girando, as entradas GSAP e os valores aprovados de R$ 2,00 / R$ 1,50 / R$ 1,20. Sem trilha lateral ou card flutuante de simulação.
- Atualização limitada a `index.html`, `styles.css`, `motion.js` e `LEIA-ME.md`; não é necessário substituir preços, imagens, fontes ou bibliotecas. Conferidos referências locais, links, estrutura dos cards, cores e lógica das animações sem navegador. A prévia permanece bloqueada: aparência, barra nativa e espaçamentos reais ainda precisam de inspeção no navegador.


## Links de acesso à plataforma — 02/10/2026

Os botões do cabeçalho e da abertura abrem https://geoeduca-uh27.onrender.com/. Os links de recursos, preços, simulação e condições continuam apontando para suas seções. Esta atualização contém apenas `index.html`, `script.js` e `LEIA-ME.md`, para substituir na mesma pasta da landing.


## Acesso direto e cache — 02/10/2026

Removida a reescrita dos links pelo JavaScript. O destino dos dois botões de acesso fica no HTML. A referência de `script.js` inclui uma versão na URL para evitar reutilizar a configuração antiga após a substituição dos arquivos. Substitua juntos `index.html`, `script.js` e `LEIA-ME.md` e recarregue a página com Ctrl+F5.

O endereço da plataforma e `/index.html` responderam com HTTP 200 na conferência desta atualização. O aviso do Three.js vem de `console.warn` na distribuição antiga incluída; não é uma exceção e não cancela a navegação dos links. A biblioteca permanece intacta nesta correção. A hipótese de cache depende dos arquivos efetivamente servidos na hospedagem; o clique na versão publicada ainda precisa ser conferido no navegador.


## Contratação assistida — 03/10/2026

O resultado do simulador usa “Solicitar acesso”; o final usa “Solicitar uma demonstração”. Ambos abrem um formulário compacto com nome, e-mail, perfil (professor/escola) e quantidade de alunos. A quantidade é obrigatória para acesso e opcional para demonstração. O cabeçalho continua com o link direto da plataforma. O formulário respeita os modos claro/escuro e possui layout de uma coluna no celular.

“Continuar no WhatsApp” abre uma mensagem para +55 (15) 99681-7066. “Usar e-mail” abre o aplicativo de e-mail com destino joaquim.neto.senai@gmail.com, assunto e mensagem preparados. Nome, e-mail, perfil, alunos e estimativa são incluídos. A estimativa utiliza as mesmas regras de `pricing.js`, com mensal/anual e promoção selecionados no simulador. A quantidade pode ser ajustada no formulário; o orçamento é recalculado. Acima de 1.000 alunos, a mensagem pede proposta personalizada, sem atribuir uma tarifa. Ao pedir uma demonstração sem informar quantidade, o plano fica a combinar.

O visitante precisa revisar e enviar a mensagem no aplicativo. A página não confirma envio, não armazena esses dados em banco nem os envia em segundo plano, não cria contas, não cobra e não libera acesso automaticamente. O aplicativo de e-mail precisa estar configurado para usar mailto. Sem JavaScript ou sem suporte ao diálogo, os botões levam diretamente ao WhatsApp com mensagem genérica; o e-mail também fica disponível na FAQ. Nenhuma solicitação real foi enviada durante os testes.

Substitua juntos `index.html`, `styles.css`, `script.js` e `LEIA-ME.md`. HTML e referências de CSS/script incluem as alterações; recarregue com Ctrl+F5. As regras de preço e os demais assets permanecem válidos. Sintaxe, campos, links, mensagens e estados de orçamento são verificados em testes sem navegador. A aparência e o clique na versão publicada precisam ser conferidos no navegador.


## Refinamento visual e conversão — 03/10/2026

A abertura agora oferece “Solicitar uma demonstração”, mantendo “Ver preços” e o acesso direto da header. Refinados o equilíbrio entre título e Terra no notebook, o espaçamento da abertura, alinhamentos/tipografia dos cards e contraste da estimativa. O botão “Solicitar acesso” fica imediatamente depois do orçamento; a composição do preço continua acessível abaixo.

O formulário apresenta três etapas curtas — solicitação, conversa e combinação do acesso — e um resumo separado das condições. Campos, botões e textos foram ajustados para celular e para os dois temas. A FAQ explica demonstração, liberação manual e definição do início da cobrança durante o contato. Não foram inventados prazo, período gratuito ou confirmação de envio. As entradas GSAP ficaram mais curtas; movimento reduzido, navegação, preços e contatos seguem preservados.

A proposta inicial de galeria ficou aguardando capturas reais nesta etapa. A atualização seguinte, descrita abaixo, utiliza Jogos, Ranking e Jogo da Bandeira da área do aluno, conforme os três prints enviados.

Arquivos desta etapa: `index.html`, `styles.css`, `script.js`, `motion.js` e `LEIA-ME.md`. Substitua os cinco na pasta da landing e recarregue com Ctrl+F5. O pacote inclui também o formulário da etapa anterior, caso ela ainda não tenha sido publicada. Sintaxe, mensagens, preços e comportamento da navegação são conferidos sem navegador; a inspeção visual real e o clique nos aplicativos na publicação permanecem pendentes.


## Galeria real da área do aluno — 03/10/2026

Incluídas as três capturas fornecidas: Jogos, Ranking e Jogo da Bandeira. Elas aparecem na seção de jogos, ao lado dos cards no notebook e acima deles nas telas menores. A moldura identifica a área do aluno; os prints não são apresentados como telas de turmas ou resultados do professor. As imagens PNG são cópias integrais dos arquivos enviados, sem alterar os pixels, as informações ou o conteúdo.

A seleção é manual, com abas acessíveis por clique, setas esquerda/direita, Home e End. O foco segue a aba selecionada; apenas seu painel fica visível. “Ver imagem completa” abre o PNG original em outra guia. A troca tem uma entrada GSAP curta, retirada na preferência de movimento reduzido. Não há rotação automática. Sem JavaScript, os três prints aparecem em sequência e os controles de abas ficam ocultos.

Em notebooks de até 850px de altura, o enquadramento usa uma imagem inteira de até 240px de altura e mantém a opção de abrir o tamanho original. No celular, a galeria usa a largura disponível e os cards ficam abaixo. Se o conteúdo ultrapassar a área útil da tela, o ajuste existente permite que a seção cresça, preservando todo o conteúdo. As imagens permanecem com suas cores originais nos dois temas; a moldura, abas e legendas acompanham o tema.

Arquivos desta entrega: `index.html`, `styles.css`, `script.js`, `motion.js`, `LEIA-ME.md` e a nova pasta `assets/screenshots/` com `jogos.png`, `ranking.png` e `bandeiras.png`. Substitua os arquivos e copie a pasta mantendo essa estrutura. Os valores, contatos, formulários, Terra e Copero continuam preservados. As imagens e as interações foram conferidas em testes estáticos/DOM simulado. A inspeção visual no navegador da publicação continua pendente.

## Validação, privacidade e painel do professor — 04/10/2026

Copie os arquivos do pacote `GEOEDUCA_Ajustes_Validacao_Privacidade.zip` para a pasta principal da landing, mantendo a estrutura de `assets/`. A lista exata dos arquivos e dos trechos está em `ALTERACOES.md`. Não é necessário substituir os arquivos de preços, animação, tema ou imagens da área do aluno.

A faixa logo após o hero informa o teste no SESI CEE 399, nas turmas do 6º e 9º ano, com cerca de 70 alunos, conforme os dados fornecidos. O parágrafo principal do projeto, a mensagem do CTA final e o rodapé foram atualizados. A apresentação e os metadados agora especificam geografia do Brasil. A imagem de compartilhamento está em `assets/og-geoeduca.png`, com 1200 × 630 pixels. O favicon existente foi mantido.

O painel do professor reutiliza a galeria com abas manuais. Substitua `assets/screenshots/professor-quiz.png` e `assets/screenshots/professor-resultados.png` pelas capturas reais. Os arquivos provisórios mostram claramente que são espaços reservados. Quando substituir, ajuste também os atributos `width`, `height`, `alt`, as legendas “Captura em preparação” e o `aria-label` da galeria no HTML para descrever as telas reais. Sem JavaScript, as duas imagens aparecem em sequência.

O simulador mantém quantidade, período, estimativa e Solicitar acesso visíveis. Promoção, explicações de descontos, composição e condições foram reunidas no accordion fechado “Perfis, faixas e descontos”. Os IDs e elementos atualizados pelo script foram preservados. `pricing.js` não foi alterado.

Os links do rodapé abrem `privacidade.html` e `termos.html`, que utilizam a mesma folha de estilos e o tema existente, sem carregar o script da landing ou animações. Preencha e confirme todos os campos `[PREENCHER]` antes de tratar os documentos como versões finais. São rascunhos com informações operacionais pendentes, não uma declaração de conformidade implementada no backend. O conteúdo aborda dados de alunos, finalidade, acesso, ranking, menores, armazenamento, retenção, direitos e contato. Referências de revisão: LGPD e orientação da ANPD, indicadas na política.

O aviso junto ao acesso da header permanece para links cujo hostname termina em `.onrender.com`. Ao mudar o `href` para o domínio próprio, o script oculta o aviso e remove sua associação `aria-describedby`. Para o funcionamento sem JavaScript, retire também o `<small id="platform-loading-note">` e o `aria-describedby` do link ao migrar. Atualize o texto correspondente nos Termos. Os endereços canonical, og:url e das imagens de compartilhamento usam a publicação atual `https://geoeduca-theta.vercel.app/`; altere-os também nas páginas legais quando houver domínio próprio.

Verificados: sintaxe do JavaScript; 4.000 cenários de preço; formulários sem envio real; galerias independentes, teclado e movimento reduzido em DOM simulado; aviso Render/domínio próprio; links, âncoras, ARIA, tamanhos de imagem e metadados. Todos os blocos originais `:root` e os bytes de `pricing.js` foram comparados e preservados. O novo CSS usa somente variáveis existentes. O fundo conserva as linhas animadas e deixa de desenhar os pontos circulares. A conferência visual em navegador da publicação permanece pendente.

## Preenchimento dos documentos para a fase de TCC — 04/10/2026

Substitua somente `privacidade.html`, `termos.html`, `LEIA-ME.md` e `ALTERACOES.md` pelo pacote `GEOEDUCA_Documentos_TCC.zip`. Esta atualização complementa o pacote visual anterior; utiliza o mesmo `styles.css` já enviado.

Preenchidos os dados confirmados: contato `joaquim.neto.senai@gmail.com`, abrangência de todas as escolas participantes dos testes, projeto de TCC sem contratação comercial atual e continuidade futura indefinida, cadastro/recuperação organizados pelo professor, Firebase atual em transição para Supabase Pro, frontend/backend da plataforma no Render e atividades inseridas pelos professores. A landing permanece na Vercel. Os preços foram contextualizados apenas nos Termos como proposta para eventual continuidade, sem alterar o simulador ou seus valores.

A equipe responsável pelo projeto foi identificada como Joaquim, Pietro, Félix e Luiz. A definição das responsabilidades de cada integrante e das instituições no tratamento dos dados continua pendente. A informação de que o projeto está em testes não foi convertida em declaração de autorização dos responsáveis ou da escola. O texto sobre imagens não afirma licença livre, pois o projeto informou que não possui licenças para elas.

Foi feita leitura pontual do repositório `fonseca-felix/new-tcc`, sem acesso a dados de alunos, sem chamadas autenticadas à plataforma, sem envio de mensagens e sem alterações no backend. O cadastro inclui credenciais, turma e data. A rota `backend/src/routes/alunos.js` guarda `senhaVisivel` junto ao hash; lista alunos para professores sem verificar a propriedade da turma nos trechos consultados; expõe ranking da turma para o perfil aluno; e a exclusão consultada apaga o documento do aluno sem confirmar remoção dos resultados relacionados. `frontend/js/auth.js` guarda sessão/usuário localmente; a área de jogos também utiliza armazenamento local. Esses pontos divergem de parte das respostas e estão registrados em `ALTERACOES.md`, para conferir a versão de fato implantada e corrigir a implementação. Não foi emitida declaração de conformidade nem garantia de exclusão integral.

Pendências: definição das responsabilidades da equipe e das instituições, bases e autorizações dos testes com menores, visibilidade real do ranking, correções de credenciais/permissões, alcance da exclusão, prazo de retenção e fim do TCC, regiões/transferências/backups/logs, horário de suporte e permissões de imagens/materiais. Os campos `[PREENCHER]` correspondentes permanecem nos documentos. Links, âncoras, ARIA, contato e integridade dos arquivos foram conferidos; o restante da landing permanece igual à rodada anterior.


## Identificação da equipe responsável — 04/10/2026

Incluídos Joaquim, Pietro, Félix e Luiz na seção 1 das páginas de Privacidade e Termos, conforme os nomes fornecidos. O e-mail permanece o confirmado anteriormente. Não foram inventados sobrenomes, dados de identificação nem atribuições individuais. Os demais campos pendentes continuam sinalizados. O pacote `GEOEDUCA_Documentos_Responsaveis.zip` contém somente `privacidade.html`, `termos.html`, `LEIA-ME.md` e `ALTERACOES.md`; substitua esses quatro arquivos.


## Informações complementares dos testes — 04/10/2026

Preenchidos: autorização e acompanhamento da professora de geografia Jesiane no SESI CEE 399; gestão/atendimento pela equipe GEOEDUCA; redefinição de senha pelo professor; RM, nome e sala como dados de cadastro informados; ranking com nomes de colegas; São Paulo como região de armazenamento informada; imagens de bancos gratuitos. Foram registradas as informações de período anual e exclusão dos dados associados, mantendo explícitas as verificações necessárias.

“Anualmente” ainda não define se a retenção termina no fim do ano letivo ou após 12 meses do cadastro, nem se ocorre exclusão, renovação ou revisão. A autorização da professora foi registrada como fornecida, sem afirmar autorização dos pais/responsáveis. “Bancos gratuitos” não identifica os bancos, licenças e créditos de cada imagem. A região São Paulo precisa ser conferida nas configurações dos serviços/backups. As diferenças de inventário, pontuações no ranking e exclusão integral identificadas no código continuam marcadas para verificação na versão dos testes.

Esta rodada modifica somente `privacidade.html`, `termos.html`, `LEIA-ME.md` e `ALTERACOES.md`, no pacote `GEOEDUCA_Documentos_Testes.zip`. Usa a mesma folha de estilos já entregue. Não houve alteração no backend, nas regras de preço ou no visual da landing.


## Esclarecimentos sobre retenção, autorização e imagens — 04/10/2026

Esta atualização substitui as informações anteriores sobre período anual e bancos de imagens genéricos. O prazo de retenção permanece indefinido: não foi assumido fim do ano letivo, 12 meses, exclusão automática ou guarda permanente. A equipe confirmou que a autorização da professora Jesiane não foi registrada e que são utilizados dados dos alunos participantes dos testes; não foram apresentados registro institucional ou confirmação do procedimento com pais/responsáveis.

O Codante foi informado como fonte das bandeiras; o endereço do recurso, sua licença e eventuais créditos ainda precisam ser confirmados. A fonte das imagens de biomas ainda não foi definida. Nenhuma permissão de uso foi presumida.

Substitua apenas `privacidade.html`, `termos.html`, `LEIA-ME.md` e `ALTERACOES.md` desta entrega. Os campos relacionados a decisões ainda não tomadas e a verificações técnicas continuam como `[PREENCHER]`. O restante da landing, incluindo layout, paleta, preços, scripts e imagens, não foi alterado.


## Respostas operacionais incorporadas — 04/10/2026

Esta rodada prevalece sobre os registros históricos anteriores de retenção e fontes de imagens. Os professores cadastram e alteram os dados. A equipe confirmou que não há procedimento de autorização/comunicação com pais ou responsáveis; a autorização não registrada de Jesiane continua descrita sem afirmar regularização institucional. Papéis decisórios e base legal precisam ser definidos com a escola.

O destino dos dados de testes agora está definido: exclusão quando a plataforma estiver pronta, também confirmada no encerramento do TCC. Isso foi registrado como decisão, sem afirmar que existe exclusão automatizada ou completa. Faltam critério/data de conclusão, procedimento, execução, responsáveis, comunicação e alcance em backups/dados locais. A guarda das mensagens de WhatsApp/e-mail continua indefinida e não foi incluída automaticamente no destino dos dados de testes.

O professor confere RM/nome ao redefinir senha, e a equipe utiliza informações confirmadas pela escola para pedidos sobre dados. Não foi assumido que conhecer RM/nome comprova identidade; os procedimentos de verificação continuam pendentes de documentação, inclusive para solicitações diretas do titular/responsável. O professor analisa uso indevido e o encaminha à equipe docente da escola. Atendimento e manutenção permanecem no contexto acadêmico, sem horários ou disponibilidade inventados.

Fonte das bandeiras: https://docs.apis.codante.io/bandeiras-dos-estados . A documentação consultada identifica Pierre Lapalu como criador e aponta para https://github.com/pierrelapalu/icones-bandeiras-br-uf , com CC0 1.0 Universal no arquivo LICENSE. Os Termos registram a origem e a licença desse conjunto, sem estendê-la a outras imagens. Os biomas foram encontrados via Google; a declaração de ausência de direitos autorais não foi convertida em licença confirmada. Registrar origem, autor, licença e créditos de cada imagem. Orientação do Google: https://support.google.com/websearch/answer/29508?hl=pt-BR . A autorização de materiais dos professores foi registrada como prevista; seu alcance e conteúdos de terceiros ainda precisam ser documentados.

Substitua somente os quatro arquivos de `GEOEDUCA_Documentos_Testes.zip`: `privacidade.html`, `termos.html`, `LEIA-ME.md` e `ALTERACOES.md`. Nenhum script, CSS, preço ou asset foi alterado. Os campos técnicos pendentes não foram preenchidos com suposições. A fase de TCC não foi tratada como prova de dispensa de análise: a LGPD, art. 4º, II, b, mantém a aplicação dos arts. 7º e 11 para fins exclusivamente acadêmicos. Referência: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm .


## Versão simplificada para o TCC — 04/10/2026

A Política de Privacidade e os Termos foram reorganizados em linguagem curta para o contexto acadêmico atual. Esta versão substitui os rascunhos públicos com questionários e campos `[PREENCHER]` descritos nos registros históricos acima. Os pontos indefinidos são apresentados como informações ainda não definidas, sem promessas ou condições empresariais inventadas.

Substitua apenas `privacidade.html`, `termos.html`, `LEIA-ME.md` e `ALTERACOES.md`. O HTML externo das páginas legais, tema, classes e estilos foram preservados. A landing principal, formulário, preços, scripts, CSS e imagens não foram alterados. O simulador continua tratado nos Termos como proposta futura, sem contratação na fase de testes.

A publicação dos textos não resolve três pontos concretos do projeto: alinhamento com a escola sobre dados de menores, identificação das licenças das imagens de biomas e revisão técnica de credenciais/acessos/exclusão. A revisão anterior do repositório encontrou `senhaVisivel` com senha em texto, rotas de alunos sem filtro de titularidade por professor e exclusão somente do documento de cadastro; não foram corrigidas nesta entrega nem confirmadas na versão publicada. Não se declara conformidade, segurança completa ou exclusão integral. A região São Paulo, logs, métricas e backups ainda não foram verificados; o texto público não apresenta esses detalhes como confirmados.

Referências utilizadas permanecem nos documentos: LGPD, documentação do Codante e licença CC0 do conjunto original, e orientação do Google para conferir a licença das imagens. O contexto de TCC não foi convertido em declaração de dispensa automática de cuidados com dados ou direitos de terceiros. Sem novo questionário: o que depende de decisão ou implementação continua informado de forma simples.
