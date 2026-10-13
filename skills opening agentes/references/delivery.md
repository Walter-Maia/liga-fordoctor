# WordPress, verificação e GitHub

## Projeto portável

Mantenha fonte, assets, build, testes e instruções no repositório. Inclua dependências de desenvolvimento e comandos que funcionem num checkout novo; não deixe os testes dependerem de node_modules de outro projeto ou de um caminho absoluto de uma máquina. Não versione credenciais, node_modules, dumps de produção, cookies de navegador ou dados enviados no formulário. Separe referências originais pesadas do pacote publicado; inclua só os recursos usados no ZIP. Preserve a visibilidade do repositório escolhida pelo usuário.

## Plugin de campanha

Uma opção útil é plugin com shortcode e template isolado de página, sem trocar o tema. Isole CSS e scripts, carregue apenas nas páginas da campanha, escape URLs/atributos no PHP e versione assets para invalidar cache. Preserve dados em opções existentes ao substituir o plugin. Preview estático deve informar honestamente quando não envia formulário.

Em formulários reais, valide no servidor, nonce, consentimento, limites e duplicidade. Destinatário deve vir de configuração administrativa, nunca de um campo enviado pelo visitante. Proteja configurações com capabilities e Settings API. Não embuta senhas SMTP. Uma resposta positiva de wp_mail prova aceitação pelo transporte, não entrega na caixa de entrada: confirme o recebimento com o usuário quando testar e-mails.

## Atualização pelo painel

Confirme o domínio e plugin corretos; leia versão atual e configurações relevantes. Gere e confira o ZIP local antes de subir. Quando atualização estiver autorizada, use Plugins → Adicionar → Enviar plugin e selecione o ZIP. Compare nome, versão atual e nova antes de “Replace current with uploaded”. Atualize o plugin existente, sem desinstalá-lo nem apagar opções. Uma mensagem de demora não é falha definitiva: confira a lista de plugins antes de repetir.

No editor de blocos, templates PHP registrados por plugin podem não aparecer no seletor visual. Confira Páginas → Edição rápida → Template. O template de campanha da ForDoctor está disponível ali. Instalar um plugin não cria necessariamente uma página nem define a página inicial.

Ao controlar navegador externo, use a skill computer-use se disponível; para o navegador embutido do Orca, use orca-cli e o guia da versão instalada. Redescubra janelas e elementos após navegação: índices e handles não são persistentes. Confira a seleção de arquivo e o resultado de cada submissão. Não trate uma chamada de clique bem-sucedida como prova de instalação. Evite reenvios ambíguos e pare diante de um bloqueio concreto que dependa de autenticação ou ação do usuário.

## Página estática numa pasta do servidor (cPanel)

Quando a landing é HTML estático e o domínio já tem outro site (ex.: WordPress na raiz), publique numa **pasta nova** (ex.: `public_html/programa-digital/`), sem tocar nos arquivos existentes. Antes: confirme a raiz do domínio (`DomainInfo/domains_data`), liste a pasta e confira que o destino não existe (404). Envie só os arquivos referenciados pelo HTML e pelos `url()` do CSS, não a pasta de trabalho inteira. Na cópia publicada ajuste `canonical`, `og:url` e `og:image` para o novo caminho. No Git Bash, exporte `MSYS_NO_PATHCONV=1` antes de chamar a API: caminhos como `/home/conta` viram `C:/Program Files/Git/home/conta` e criam pastas erradas no servidor. Depois: compare o HTML no ar com o enviado, confira o código HTTP de cada arquivo, abra a página num navegador e confirme que o site antigo continua respondendo. Encerre a sessão do painel e apague cookies/tokens locais.

## GitHub Pages como prévia

Repositório público separado do projeto, só com `index.html` + `assets/` e `<meta name="robots" content="noindex, nofollow">` injetado na cópia. Mantenha versões anteriores em subpastas. Após o push, espere o build (`gh api repos/<dono>/<repo>/pages/builds/latest`) e confira a URL pública e os assets novos. Publicar na prévia, no repositório privado e no servidor são três operações distintas: faça só a que foi pedida.

## QA antes e depois

Verifique a renderização final em larguras pequenas, tablet, desktop e largas (por exemplo, 320, 390, 768, 1024, 1440, 1920). Cheque overflow, wraps, foco, âncoras, menu, formulário, simulador e acordeões. Inspecione screenshots: um teste de overflow não detecta uma imagem indevidamente visível. Cuidado com resets de maior especificidade, como .fdi svg, anulando display:none de novos componentes.

Use os testes relevantes existentes. Após upload, confirme versão de CSS/JS e DOM no site público e confira os controles alterados. Verifique opções de e-mail preservadas. Não dispare novos e-mails sem escopo de teste autorizado. Registre se mobile foi emulado, quais navegadores rodaram e quais fluxos dependem de confirmação humana.

## GitHub

Antes de commit/push, confira repositório remoto, branch, diferenças e arquivos preparados. Preserve histórico existente: faça fetch e integre mudanças em vez de force-push. Para repo vazio, crie main com o projeto revisado. Use git add seletivo e inspecione staged diff; nomes de arquivo não são uma auditoria de conteúdo. Ao usar gh para textos longos, prefira arquivo de corpo. Confirme commit remoto após push. Publicação no GitHub e atualização WordPress são operações separadas. Em repositório compartilhado com outra sessão, monte o commit em cima de `origin/main` sobrepondo só os arquivos do projeto; não versione clones git aninhados nem perfis de navegador, e procure tokens no diff preparado antes do push.
