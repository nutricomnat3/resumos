fetch("https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbwkba73AWXeUp9B6bwzPNt6MjXvZZ9U9JsILa1ty9j29QCmvb2OljiVgkw5RO1ADyShng/exec", {
  method: 'POST',
  body: JSON.stringify({
    total: "49.90",
    pagamento: "PIX",
    secret: "nutriComNat@2025"
  }),
  headers: {
    'Content-Type': 'application/json'
  }
}).then(res => res.text()).then(console.log).catch(console.error);
