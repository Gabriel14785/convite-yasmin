/**
 * GOOGLE APPS SCRIPT — Convite Yasmin 15 anos
 *
 * INSTRUÇÕES DE INSTALAÇÃO (2 min):
 *
 * 1. Crie uma Google Planilha em https://sheets.google.com
 *    - Dê um nome: "Confirmações - Yasmin 15"
 *    - Na primeira linha, coloque os cabeçalhos:
 *      A1: nome | B1: telefone | C1: mensagem | D1: data
 *
 * 2. No menu da planilha: Extensões → Apps Script
 *    - Apague o conteúdo padrão
 *    - Cole TODO este código
 *    - Salve (Ctrl+S)
 *
 * 3. Implantar → Nova implantação
 *    - Tipo: "Aplicativo da Web"
 *    - Executar como: "Eu" (seu email)
 *    - Quem tem acesso: "Qualquer pessoa"
 *    - Clique em "Implantar"
 *    - Copie a URL gerada (algo como https://script.google.com/macros/s/XXXXX/exec)
 *
 * 4. Volte no convite (index.html), abra o DevTools (F12) e rode:
 *      localStorage.setItem('scriptUrl', 'https://script.google.com/macros/s/XXXXX/exec');
 *      localStorage.setItem('adminToken', 'yasmin15');
 *    (Recarregue a página depois)
 *
 * 5. No dashboard.html, faça login com a senha: yasmin15
 */

const ADMIN_TOKEN = 'yasmin15';
const SHEET_NAME = 'Confirmações';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
                  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      data.nome || '',
      data.telefone || '',
      data.mensagem || '',
      new Date()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  const token = e.parameter.token;

  if (action === 'list') {
    if (token !== ADMIN_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
                  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const rows = sheet.getDataRange().getValues();

    // Pula cabeçalho
    const confirmations = rows.slice(1).map(row => ({
      nome: row[0],
      telefone: row[1],
      mensagem: row[2],
      data: row[3] instanceof Date ? row[3].toISOString() : row[3]
    }));

    return ContentService
      .createTextOutput(JSON.stringify({ confirmations }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ message: 'Convite Yasmin 15 - API ativa' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Opcional: cria o cabeçalho automaticamente na primeira execução
 */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  sheet.getRange('A1:D1').setValues([['nome', 'telefone', 'mensagem', 'data']]);
  sheet.getRange('A1:D1').setFontWeight('bold');
  sheet.autoResizeColumns(1, 4);

  Logger.log('Planilha configurada com sucesso!');
}
