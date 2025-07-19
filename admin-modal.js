document.addEventListener('DOMContentLoaded', () => {
  // Aguarda o modal ser carregado no DOM
  const adminForm = document.querySelector('#adminForm');

  if (adminForm) {
    adminForm.addEventListener('submit', async (event) => {
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

      try {
        const resposta = await fetch('https://back-resumos-nutri-com-nat.vercel.app/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        console.log("Resposta do servidor:", resultado);

        setTimeout(() => {
            console.log("Tempo limite de 10 segundos atingido.");
        }, 10000);

        if (resposta.ok && resultado.status === "ok") {
          alert("Pedido enviado com sucesso!");
          adminForm.reset();
          const modal = bootstrap.Modal.getInstance(document.getElementById('adminModal'));
          modal.hide();
        } else {
          alert("Erro ao enviar: " + (resultado.detalhe || "Verifique os dados e tente novamente."));
        }

      } catch (erro) {
        alert("Erro de conexão com o servidor. Tente novamente mais tarde.");
        console.error("Erro ao enviar pedido manual:", erro);
      }
    });
  }
});
