// script.js

let selectedResumos = [];
let resumosData = [];

console.log("NutriComNat - V.20250716.4")

fetch("src/data/data.json")
  .then(response => response.json())
  .then(data => {
    resumosData = data.resumos; // <- armazena os dados
    renderResumos(data.resumos);
  });

function renderResumos(resumos) {
  const container = document.getElementById("resumos-list");
  resumos.forEach(resumo => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "card-resumo";
    card.innerHTML = `
      <img src="${resumo.image}" alt="${resumo.title}">
      <div class="card-body" style="background-color: ${resumo.color}">
        <h5 class="card-title">${resumo.title}</h5>
        <button class="btn btn-light btn-sm mb-2" onclick="abrirModal('${resumo.title}', \`${resumo.description}\`, ${resumo.price_from}, ${resumo.price})">
          Saber mais
        </button>
        <p class="card-price">
          <span class="price-from">De: <s>R$ ${resumo.price_from.toFixed(2)}</s></span><br>
          <span class="price-to">Por: R$ ${resumo.price.toFixed(2)}</span>
        </p>
        <div class="form-check">
          <input class="form-check-input resumo-check" type="checkbox" value="${resumo.label}" data-price="${resumo.price}" data-title="${resumo.title}" id="${resumo.label}">
          <label class="form-check-label" for="${resumo.label}">Selecionar</label>
        </div>
      </div>
    `;
    col.appendChild(card);
    container.appendChild(col);
  });

  document.querySelectorAll('.resumo-check').forEach(input => {
    input.addEventListener('change', updateTotal);
  });
}

function updateTotal() {
  const inputs = document.querySelectorAll('.resumo-check');
  let total = 0;
  selectedResumos = [];

  inputs.forEach(input => {
    if (input.checked) {
      total += parseFloat(input.dataset.price);
      // console.log(input.dataset)
      selectedResumos.push({
        label: input.value,
        title: input.dataset.title,
        price: parseFloat(input.dataset.price)
      });
    }
  });

  document.getElementById("total").innerText = `R$ ${total.toFixed(2)}`;
}

function finalizarPedido() {
  let saudacao;
  let mensagem = "";
  let produtos = "";
  let total = 0;
  const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked')?.value || "não informado";
  const agora = new Date();
  const hora = agora.getHours();

  console.log("Start event GA4");
  gtag('event', 'clique_finalizar_pedido', {
    'event_category': 'pedido',
    'event_label': 'Botão Finalizar Pedido',
    'value': 1
  });
  console.log("End event GA4");

  let qtdParcelas = 1;
  if (formaPagamento === "Cartão de Crédito") {
    const inputParcelas = document.getElementById("qtdParcelas");
    if (inputParcelas) {
      qtdParcelas = parseInt(inputParcelas.value);
    }
  }


  if (selectedResumos.length === 0) {
    alert("Selecione pelo menos um resumo!");
    return;
  }

  if (hora >= 5 && hora < 12) {
    saudacao = "Bom dia!";
  } else if (hora >= 12 && hora < 18) {
    saudacao = "Boa tarde!";
  } else {
    saudacao = "Boa noite!";
  }

  selectedResumos.forEach(resumo => {
    produtos += `- *${resumo.title}* - R$ ${resumo.price.toFixed(2)}`;
    produtos += `%0A`;
    total += resumo.price;
    
  });


  console.log("Start save to Google Sheets");


  // fetch('https://back-resumos-nutri-com-nat.vercel.app/', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     total: total.toFixed(2),
  //     pagamento: formaPagamento === "Cartão de Crédito" ? "CREDITO (LINK)" : "PIX",
  //     pass: "nutriComNat"
  //   }),
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // });

  fetch('https://back-resumos-nutri-com-nat.vercel.app/', {
    method: 'POST',
    body: JSON.stringify({
      total: total.toFixed(2),
      pagamento: formaPagamento === "Cartão de Crédito" ? "CREDITO (LINK)" : "PIX",
      pass: "nutriComNat"
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())  // ou .json() se a API retorna JSON
  .then(data => {
    console.log("Resposta da API:", data);
  })
  .catch(error => {
    console.error("Erro ao enviar requisição:", error);
  });




  console.log("End save to Google Sheets");

  mensagem = `${saudacao}`;
  mensagem += `%0A`;
  mensagem += `%0A`;
  mensagem += `Gostaria de comprar os seguintes resumos ♥:`;
  mensagem += `%0A`;
  mensagem += produtos;
  mensagem += `%0A`;
  mensagem += `Total: R$ ${total.toFixed(2)}`;
  mensagem += `%0A`;
  mensagem += `%0A`;
  if (formaPagamento === "Cartão de Crédito") {
    mensagem += `Forma de pagamento escolhida: *${formaPagamento}* (${qtdParcelas}x)`;
    // mensagem += `Número de parcelas: *${qtdParcelas}x*`;
  } else {
    mensagem += `Forma de pagamento escolhida: *${formaPagamento}*`;
  }
  mensagem += `%0A`;
  mensagem += `%0A`;
  mensagem += `Minhas redes sociais ♥:`;
  mensagem += `%0A`;
  mensagem += `*Instagram:* instagram.com/natalyamirandanutri`;
  mensagem += `%0A`;
  mensagem += `*TikTok:* tiktok.com/@nutricomnat`;
  
  const numero = "5581995101122";
  const url = `https://api.whatsapp.com/send?phone=${numero}&text=${mensagem}`;
  console.log(mensagem)
  console.log(url)

  // window.open(url, '_blank');
  // window.location.href = url;

  setTimeout(() => {
    window.location.href = url;
  }, 500); // aguarda 500 para garantir que o GA4 envie o evento
}



// Mostrar botão flutuante ao rolar
window.addEventListener('scroll', function () {
  const btn = document.getElementById('finalizar-pedido');
  if (btn) {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }
});



// Filtro ao digitar na barra de pesquisa
document.getElementById('search-input').addEventListener('input', function (e) {
  const searchValue = e.target.value.toLowerCase();
  const cards = document.querySelectorAll('#resumos-list .card-resumo');

  cards.forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    // const description = card.querySelector('.card-text').textContent.toLowerCase();
    const visible = title.includes(searchValue);
    card.parentElement.style.display = visible ? 'block' : 'none';
  });
});



function abrirModal(titulo, descricao, precoDe, precoPor) {
  const modalTitle = document.getElementById("resumoModalLabel");
  const modalContent = document.getElementById("resumoModalContent");

  modalTitle.innerText = titulo;
  modalContent.innerHTML = `
    <p><strong>Descrição:</strong> ${descricao}</p>
    <p><strong>De:</strong> R$ ${precoDe.toFixed(2)}</p>
    <p><strong>Por:</strong> R$ ${precoPor.toFixed(2)}</p>
  `;

  const modal = new bootstrap.Modal(document.getElementById('resumoModal'));
  modal.show();
}

function mostrarResumoPedido() {
  if (selectedResumos.length === 0) {
    alert("Selecione pelo menos um resumo!");
    return;
  }

  const modalTitle = document.getElementById("resumoResumoLabel");
  const modalBody = document.getElementById("resumoResumoContent");

  let totalDe = 0;
  let totalPor = 0;
  // let html = "<ul class='list-unstyled'>";
  let html = `
    <div class="alert alert-warning text-start" role="alert">
      ⚠️ Se estiver usando o navegador do Instagram e o WhatsApp não abrir, clique nos três pontinhos na parte superior e selecione <strong>"Abrir no navegador"</strong>.
    </div>
    <ul class='list-unstyled'>
  `;

  selectedResumos.forEach(resumo => {
    const resumoInfo = resumosData.find(r => r.label === resumo.label);
    if (resumoInfo) {
      totalDe += resumoInfo.price_from;
      totalPor += resumoInfo.price;
      html += `<li><strong>${resumo.title}</strong>: <s>R$ ${resumoInfo.price_from.toFixed(2)}</s> → R$ ${resumoInfo.price.toFixed(2)}</li>`;
    }
  });

  html += "</ul>";

  const desconto = totalDe - totalPor;

  html += `<p class="mt-3"><strong>Desconto:</strong> R$ ${desconto.toFixed(2)}</p>`;
  html += `<p><strong>Total:</strong> R$ ${totalPor.toFixed(2)}</p>`;
  html += `
    <div class="mt-3">
      <label><strong>Forma de Pagamento:</strong></label><br>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="formaPagamento" id="pagamentoPix" value="Pix" checked>
        <label class="form-check-label-payment" for="pagamentoPix">Pix</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="formaPagamento" id="pagamentoCartao" value="Cartão de Crédito">
        <label class="form-check-label-payment" for="pagamentoCartao">Cartão de Crédito (Link de pagamento)</label>
      </div>
    </div>
  `;

  html += `
    <div class="mt-3" id="parcelas-container" style="display: none;">
      <label for="qtdParcelas"><strong>Quantidade de Parcelas:</strong> <span id="valorParcelas">1</span>x</label>
      <input type="range" class="form-range" min="1" max="10" value="1" id="qtdParcelas">
    </div>
  `;


  html += `<p>Ambas formas de pagamento, são através do Whatsapp</p>`
  html += `<div class="d-flex justify-content-end gap-3 mt-4">
    <button class="btn btn-secondary" data-bs-dismiss="modal">Sair</button>
    <button class="btn btn-success" onclick="finalizarPedido()">Finalizar Pedido no WhatsApp</button>
  </div>`;

  modalTitle.innerText = "Resumo do Pedido";
  modalBody.innerHTML = html;

  const modal = new bootstrap.Modal(document.getElementById('resumoResumoModal'));
  modal.show();

  setTimeout(() => {
    const radios = document.querySelectorAll('input[name="formaPagamento"]');
    const containerParcelas = document.getElementById("parcelas-container");
    const inputParcelas = document.getElementById("qtdParcelas");
    const spanValor = document.getElementById("valorParcelas");

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === "Cartão de Crédito" && radio.checked) {
          containerParcelas.style.display = "block";
        } else if (radio.value === "Pix" && radio.checked) {
          containerParcelas.style.display = "none";
        }
      });
    });

    inputParcelas.addEventListener("input", () => {
      spanValor.textContent = inputParcelas.value;
    });
  }, 100);

}