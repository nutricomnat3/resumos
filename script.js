// script.js

let selectedResumos = [];

fetch("src/data/data.json")
  .then(response => response.json())
  .then(data => renderResumos(data.resumos));

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
        <p class="card-text">${resumo.description}</p>
        <p class="card-price">
          <span class="price-from">De: <s>R$ ${resumo.price_from.toFixed(2)}</s></span><br>
          <span class="price-to">Por: R$ ${resumo.price.toFixed(2)}</span>
        </p>
        <div class="form-check">
          <input class="form-check-input resumo-check" type="checkbox" value="${resumo.label}" data-price="${resumo.price}" id="${resumo.label}">
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
      selectedResumos.push({
        label: input.value,
        price: parseFloat(input.dataset.price)
      });
    }
  });

  document.getElementById("total").innerText = `R$ ${total.toFixed(2)}`;
}

function finalizarPedido() {
  if (selectedResumos.length === 0) {
    alert("Selecione pelo menos um resumo!");
    return;
  }

  let mensagem = "Olá! Gostaria de comprar os seguintes resumos:%0A";
  let total = 0;

  selectedResumos.forEach(resumo => {
    mensagem += `- ${resumo.title} (R$ ${resumo.price.toFixed(2)})%0A`;
    total += resumo.price;
  });

  mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;
  const numero = "5581995101122";
  const url = `https://wa.me/${numero}?text=${mensagem}`;

  window.open(url, '_blank');
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
