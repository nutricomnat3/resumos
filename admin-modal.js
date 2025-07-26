fetch('admin-modal.html')
  .then(res => res.text())
  .then(html => {
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);

    // Espera o modal ser adicionado ao DOM e só então adiciona o listener
    const form = document.querySelector('#adminForm');
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usuario = document.querySelector('#usuario').value.trim();
        const senha = document.querySelector('#senha').value.trim();
        const formaPagamento = document.querySelector('#formaPagamento').value;
        const valor = parseFloat(document.querySelector('#valor').value).toFixed(2);

        const dados = {
          usuario,
          senha,
          pass: "nutriComNat",
          pagamento: formaPagamento,
          total: valor,
          origem: "MANUAL"
        };
        form.reset();

        try {
          const resposta = await fetch('https://back-resumos-nutri-com-nat-theta.vercel.app/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
          });

          const resultado = await resposta.json();
          console.log("Resultado JSON da API:", resultado);

          if (resposta.ok && resultado.resposta === "OK") {
            alert("Pedido enviado com sucesso!");
            // const modal = bootstrap.Modal.getInstance(document.getElementById('adminModal'));
            // if (modal) modal.hide();
          } else {
            alert("Falha - " + resultado.resposta);
          }

        } catch (erro) {
          alert("Erro de conexão com o servidor. Tente novamente mais tarde.");
          console.error("Erro ao enviar pedido manual:", erro);
        }
      });
    }
  });
