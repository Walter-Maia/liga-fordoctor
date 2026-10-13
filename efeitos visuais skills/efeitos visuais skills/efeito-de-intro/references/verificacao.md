# Verificação: provar que a intro está certa

Uma captura parada não prova animação. Verifique **quadros congelados em instantes do roteiro** e **o comportamento em tempo real**.

## 1. Quadros congelados

```bash
# na raiz do site
python -m http.server 4321 --bind 127.0.0.1
# em outro terminal, de qualquer pasta (a saída vai para ./quadros)
node "efeitos visuais skills/efeito-de-intro/scripts/capturar-quadros.js" minha-intro http://127.0.0.1:4321/index.html 0.2,0.6,1.0,1.3,1.6,1.9,2.2,2.4
node ".../capturar-quadros.js" minha-intro-mobile http://127.0.0.1:4321/index.html 0.5,1.5,2.4 390x844
```

Escolha instantes que caiam **no meio** de cada evento do roteiro e um no fim. **Abra a folha de contato e olhe.** Compare com o roteiro e com [../referencias-visuais/](../referencias-visuais/). Confira:
- cada evento aparece no instante previsto e na ordem certa;
- o último quadro é idêntico ao logo oficial (cores, proporção, nada cortado pelo viewBox);
- nenhum traço "some" por ser fino demais, principalmente em 390 px e 320 px;
- palavra do logo não gira nem distorce;
- nada da página aparece por baixo antes da dissolução.

## 2. Tempo real (sem congelar)

Carregue a página em uma aba visível e registre (por CDP, Playwright ou à mão):

| Caso | Esperado |
|---|---|
| Primeira visita | intro toca inteira; overlay removido do DOM ao fim; `html` sem `intro-active`/`intro-leaving`; hero visível |
| Esc / Tab / roda / toque / clique no meio | página liberada na hora, sem rolar; overlay sai em ~0,3 s; clique não atravessa para um link |
| URL com `#secao` | sem intro, página já na seção |
| `prefers-reduced-motion: reduce` | sem intro, sem nada oculto |
| JS bloqueado ou com erro | cobertura some sozinha (failsafe ~5 s); sem JS nenhuma cobertura |
| Aba aberta em segundo plano | sem intro ao voltar |
| Segunda visita (se "uma vez por sessão") | sem intro |
| Celular com CPU 4× | sem travadas visíveis; se o script chegar depois de 3 s, a intro não monta |
| Console | sem erros; nenhum listener/timer restante depois do fim |

O template desta skill foi verificado assim em 24/09/2026: fim natural (overlay removido, hero opacidade 1), Esc aos 0,9 s, segunda visita e movimento reduzido.

## 3. O que relatar

Roteiro final (tabela), arquivos alterados, folha de quadros gerada, casos da tabela acima que foram testados e os que **não** foram. Diga explicitamente que a análise foi por quadros e sonda, não assistindo como pessoa, quando for o caso.
