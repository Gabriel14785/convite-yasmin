# Convite Yasmin 15 anos — Noite Estrelada

Convite digital interativo com confirmação de presença e dashboard administrativo.

## Como rodar local

Basta abrir o `index.html` no navegador (duplo clique) — não precisa de servidor.

Para testar o dashboard: abra `dashboard.html` e entre com a senha `yasmin15`.

## Música de fundo

Coloque um arquivo MP3 chamado `musica.mp3` dentro da pasta `assets/`.

```
convite/
└── assets/
    └── musica.mp3   ← coloque aqui
```

A música começa a tocar automaticamente quando o envelope é aberto. Um botão flutuante
no canto inferior direito permite pausar/retomar.

Se o arquivo não existir, o botão ainda aparece mas não toca nada (sem erro).

## Estrutura

```
convite/
├── index.html          ← convite principal
├── dashboard.html      ← painel de confirmações (senha: yasmin15)
├── assets/
│   └── foto-yasmin.jpg
├── css/
│   └── style.css
├── js/
│   ├── app.js          ← lógica do convite
│   └── dashboard.js    ← lógica do dashboard
├── apps-script.gs      ← código do Google Apps Script (backend opcional)
└── README.md
```

## Funcionalidades

- Envelope com animação de abertura
- Foto da aniversariante
- Contagem regressiva em tempo real
- Local com link do Google Maps + QR Code
- Dress code com paleta de cores
- Sugestões de presente + botão de copiar PIX
- Formulário de confirmação de presença
- Dashboard com lista, busca e exportação CSV
- 100% responsivo (mobile-first)

## Paleta

- Azul marinho `#0B1A3A`
- Azul médio `#1E3A6F`
- Azul claro `#5B7FBF`
- Prata claro `#C9D4E8`
- Off-white `#E8EEF7`

## Configurar backend (Google Sheets) — opcional

Sem backend, as confirmações são salvas apenas no `localStorage` do navegador (só funciona no mesmo dispositivo).

Para ter confirmações centralizadas que funcionam em qualquer dispositivo:

1. Crie uma planilha em https://sheets.google.com
2. Adicione cabeçalhos na linha 1: `nome | telefone | mensagem | data`
3. Menu **Extensões → Apps Script**
4. Apague o conteúdo e cole o código de `apps-script.gs`
5. **Implantar → Nova implantação → Aplicativo da Web**
   - Executar como: Eu
   - Quem tem acesso: Qualquer pessoa
6. Copie a URL gerada
7. No `index.html` ou `dashboard.html`, abra o DevTools (F12) e rode:
   ```js
   localStorage.setItem('scriptUrl', 'SUA_URL_AQUI');
   localStorage.setItem('adminToken', 'yasmin15');
   ```
8. Recarregue a página

## Senha do dashboard

Padrão: `yasmin15`

Para trocar, edite a constante `DASHBOARD_PASSWORD` em `js/dashboard.js` e `ADMIN_TOKEN` em `apps-script.gs` (se usar backend).

## Personalizar

Edite `js/app.js` na seção `CONFIG`:

```js
const CONFIG = {
  eventDate: new Date('2026-10-04T18:00:00'),
  pixKey: '44792995809',
  scriptUrl: ''
};
```

## Hospedagem gratuita (depois)

- **Vercel**: `npx vercel` na pasta do projeto
- **Netlify**: arrastar a pasta em https://app.netlify.com/drop
- **GitHub Pages**: push pro GitHub e ativar Pages

Todos funcionam direto, sem build.
