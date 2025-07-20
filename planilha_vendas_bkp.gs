function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;

  // Ajuste a coluna da checkbox (ex: coluna A) e a coluna onde quer registrar data/hora (ex: coluna B)
  if (range.getColumn() == 1 && range.getValue() === true) {
    var timestampCell = sheet.getRange(range.getRow(), 2);
    if (!timestampCell.getValue()) {
      timestampCell.setValue(new Date());
    }
  }

  // Se desmarcar a caixa, limpa a data/hora
  if (range.getColumn() == 1 && range.getValue() === false) {
    var timestampCell = sheet.getRange(range.getRow(), 2);
    timestampCell.clearContent();
  }
}

function doPost(e) {
  const SECRET_KEY = "nutriComNat@2025";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vendas");
  const data = JSON.parse(e.postData.contents);

  if (!data.secret || data.secret !== SECRET_KEY) {
    return ContentService.createTextOutput("Acesso negado").setMimeType(ContentService.MimeType.TEXT);
  }

  const valorFormatado = Number(data.total).toFixed(2).replace('.', ',');

  // Define a partir de qual linha o script deve começar a procurar
  const primeiraLinhaDeDados = 3;
  const totalLinhas = sheet.getLastRow();

  let linhaDestino = null;

  for (let i = primeiraLinhaDeDados; i <= totalLinhas + 1; i++) {
    const valorColunaB = sheet.getRange(i, 2).getValue(); // Coluna B (Data/Hora)
    const valorColunaC = sheet.getRange(i, 3).getValue(); // Coluna C (Valor)

    if (!valorColunaB && !valorColunaC) {
      linhaDestino = i;
      break;
    }
  }

  if (linhaDestino === null) {
    return ContentService.createTextOutput("Não foi possível encontrar uma linha vazia").setMimeType(ContentService.MimeType.TEXT);
  }

  sheet.getRange(linhaDestino, 1, 1, 6).setValues([[
    true,
    new Date(),
    valorFormatado,
    data.pagamento || '',
    "PENDENTE",
    "WEBHOOK"
  ]]);

  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const SECRET_KEY = "nutriComNat@2025";
  const USUARIO_CORRETO = "admin";
  const SENHA_CORRETA = "1234";

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vendas");
  const data = JSON.parse(e.postData.contents);

  if (!data.secret || data.secret !== SECRET_KEY) {
    return ContentService.createTextOutput("Acesso negado").setMimeType(ContentService.MimeType.TEXT);
  }

  let status = "PENDENTE";

  if (data.origem === "MANUAL") {
    if (data.usuario !== USUARIO_CORRETO || data.senha !== SENHA_CORRETA) {
      return ContentService.createTextOutput("Dados inválidos").setMimeType(ContentService.MimeType.TEXT);
    }
    status = "PAGO";
  }

  const dataAtual = new Date();
  const valor = parseFloat(data.total.toString().replace(",", ".")).toFixed(2).replace(".", ",");

  const ultimaLinha = sheet.getLastRow();
  let proximaLinha = ultimaLinha + 1;

  for (let i = 3; i <= ultimaLinha; i++) {
    const dataCell = sheet.getRange(i, 2).getValue();
    const valorCell = sheet.getRange(i, 3).getValue();
    if (!dataCell && !valorCell) {
      proximaLinha = i;
      break;
    }
  }

  sheet.getRange(proximaLinha, 2).setValue(dataAtual);
  sheet.getRange(proximaLinha, 3).setValue(valor);
  sheet.getRange(proximaLinha, 5).setValue(status);
  sheet.getRange(proximaLinha, 4).setValue(data.pagamento);

  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}