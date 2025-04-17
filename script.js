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
    // col.className = "col-6";

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
  let total = 0;
  const agora = new Date();
  const hora = agora.getHours();

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

  mensagem = `${saudacao}`;
  mensagem += `%0A`;
  mensagem += `%0A`;
  mensagem += `Gostaria de comprar os seguintes resumos:`;
  mensagem += `%0A`;
  
  selectedResumos.forEach(resumo => {
    mensagem += `- *${resumo.title}* - R$ ${resumo.price.toFixed(2)}`;
    mensagem += `%0A`;
    total += resumo.price;
    
  });
  
  mensagem += `%0A`;
  mensagem += `Total: R$ ${total.toFixed(2)}`;
  mensagem += `%0A`;
  mensagem += `%0A`;
  mensagem += `Ficou interessado, e já quer fazer o pedido?`;
  mensagem += `%0A`;
  mensagem += `Envie a mensagem *"Quero fazer o pedido"*`;
  mensagem += `%0A`;
  mensagem += `que enviarei a chave Pix`;
  
  console.log(mensagem)
  alert(mensagem)

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
