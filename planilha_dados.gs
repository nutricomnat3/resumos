function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚙️ Utilitários')
    .addItem('📦 Gerar JSON', 'gerarJSON')
    .addToUi();
}


function onEdit(e) {
  var range = e.range;
  var checkboxCol = 8; // Coluna H

  if (range.getColumn() === checkboxCol) {
    if (e.value === "TRUE") {
      // Quando checkbox é marcada, executa a função de criar o JSON
      gerarJSON();
    }
  }
}

function gerarJSON() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dados = planilha.getDataRange().getValues();
  const cabecalhos = dados[0];
  const resumos = [];

  for (let i = 1; i < dados.length; i++) {
    const linha = dados[i];
    if (linha.every(celula => celula === "")) continue;

    const resumo = {};
    for (let j = 0; j < cabecalhos.length; j++) {
      const chaveOriginal = cabecalhos[j];
      const chave = normalizarChave(chaveOriginal);
      let valor = linha[j];

      if (chave === "image" && valor) {
        valor = "src/media/resumos/" + valor;
      }

      // ✅ Conversão para número nos campos de preço
      if ((chave === "price_from" || chave === "price_to") && typeof valor === "string") {
        valor = Number(valor.replace(/[^\d,.-]/g, "").replace(",", "."));
      }

      resumo[chave] = valor;
}

    if (resumo.title) {
      const label = "resumo-" + removerAcentos(resumo.title.toLowerCase().replace(/\s+/g, "-"));
      resumo.label = label;
    }

    resumos.push(resumo);
  }

  const json = JSON.stringify({ resumos }, null, 4);
  const blob = Utilities.newBlob(json, "application/json", "data.json");

  const pasta = criarOuBuscarPasta(["nat", "nutriComNat"]);

  // Remove o "data.json" anterior, se existir
  const arquivosExistentes = pasta.getFilesByName("data.json");
  while (arquivosExistentes.hasNext()) {
    const arquivo = arquivosExistentes.next();
    arquivo.setTrashed(true); // ou .delete() se quiser excluir permanentemente
  }

  pasta.createFile(blob);
  SpreadsheetApp.getUi().alert("✅ JSON gerado com sucesso!");
}

function normalizarChave(chave) {
  const mapa = {
    'Título': 'title',
    'Descrição': 'description',
    'Preço De': 'price_from',
    'Preço Por': 'price',
    'Categoria': 'category',
    'Cor': 'color',
    'Imagem': 'image'
  };
  chave = chave.trim().replace(/\u200B/g, '');
  return mapa[chave] || chave.toLowerCase();
}

function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function criarOuBuscarPasta(caminho) {
  let pastaAtual = DriveApp.getRootFolder();
  caminho.forEach(nome => {
    const pastas = pastaAtual.getFoldersByName(nome);
    if (pastas.hasNext()) {
      pastaAtual = pastas.next();
    } else {
      pastaAtual = pastaAtual.createFolder(nome);
    }
  });
  return pastaAtual;
}
