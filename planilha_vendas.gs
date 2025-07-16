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
  const SECRET_KEY = "nutriComNat@2025"; // 🔒 Altere por uma chave segura
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  if (!data.secret || data.secret !== SECRET_KEY) {
    return ContentService.createTextOutput("Acesso negado").setMimeType(ContentService.MimeType.TEXT);
  }

  sheet.appendRow([
    true,               // ✅ coluna do check
    new Date(),         // 📅 data e hora do pedido
    data.total || '',   // 💰 valor total
    data.pagamento || '', // 💳 forma de pagamento formatada
    'PENDENTE'          // ⏳ status inicial
  ]);

  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}
