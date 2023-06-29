const axios = require('axios');

// Configurações
const ACCESS_TOKEN = 'EAAHr78QAzgwBAFOZB8U6uO633bp3kuiU0a3m5evpDKHgdMkYhW6p4fQ2tpZCVbE0e1QkrTZC41Arms14Y2nHeTP3KnBZBtrzgWI3Pvn4zJXla4U4k3LAUG4PtaehYWrHrfcZAwnZBlviTSNq2wZCrug78AvyXbhQiuaW8fVBrGZCNrOaoSmrPYMUw5nWCS84K5FFFcbyP3eTinQRpo8E3s0ZAurARBFZCDg1h3HrIcvYuoFTtZAa0gwm8pX';  // Token de acesso da sua aplicação
const USER_ID = '2204320113087639';  // ID do usuário para quem você deseja enviar a mensagem

// Corpo da mensagem
const messageBody = {
  recipient: {
    id: USER_ID
  },
  message: {
    text: 'Olá! Esta é uma mensagem privada enviada através do script.'
  }
};

// Enviar mensagem privada
axios.post(`https://graph.facebook.com/v12.0/114124414953036/messages?access_token=${ACCESS_TOKEN}`, messageBody)
  .then(response => {
    console.log('Mensagem enviada com sucesso!');
  })
  .catch(error => {
    console.error('Erro ao enviar a mensagem:', error.response.data.error);
});