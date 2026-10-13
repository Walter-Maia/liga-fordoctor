# 13 — Estética "terminal/dossiê" (Bureau Nine)

**O que é:** mais direção de arte do que efeito. Dark quase preto, monospace, seções numeradas em romano, labels técnicos, sensação de documento confidencial.
**Visto em:** https://bureaunine.com/

## Receita visual
```css
:root {
  --fundo: #070708;        /* preto do Bureau Nine */
  --texto: #e8e8e6;
  --texto-fraco: #6b6b70;
  --linha: rgba(255,255,255,0.08);
}
body { background: var(--fundo); color: var(--texto); }
.mono { font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
        font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
        color: var(--texto-fraco); }
.separador { border: 0; border-top: 1px solid var(--linha); }
```

## Padrões de conteúdo
- Seções: `SECTION I — SYSTEMS`, `SECTION II — INTELLIGENCE`... (numeração romana + travessão).
- Bloco de "status" em pares label/valor monospace:
```html
<dl class="status mono">
  <div><dt>NODE</dt><dd>EDGE · ONLINE</dd></div>
  <div><dt>SESSION</dt><dd>—</dd></div>
  <div><dt>CONTACT</dt><dd>BY REQUEST</dd></div>
</dl>
```
- Pouquíssimo texto, tom seco ("Replies within one working day. Nothing is shared.").

## Micro-efeitos que combinam
- Texto "digitando" ou revelado caractere a caractere (stagger 0.02 por letra).
- Cursor piscando `▍` após labels.
- Hover em links: sublinhado que cresce da esquerda (background-size 0%→100%).
- NADA de cores saturadas ou imagens grandes — o mistério é o estilo.
