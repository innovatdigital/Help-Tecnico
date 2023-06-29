const axios = require('axios');

// Configurações
const ACCESS_TOKEN = 'EAAHr78QAzgwBACy98BxZB5aRwkZCxMYffRCCqOvnOVxUS7FP14mlJVURessVIWhM08I3On4VfkDIwLJIVS1q2jk3aLJr8a0hEVu3WB4BTRZCN9vddwjfZA4CEznZAHo3BawLq2gfERDpTXF0SBGNtIntakJaGGVlUh6NPde6u4qCEPVT9dn8XQYpKMfkVvVUdyWSFKBhkpSfjUJCJ9ZCZBo6Giwb1KVHW3fHEn9YRs6XBszJzyA4BB1';  // Token de acesso da sua aplicação
const USER_ID = '114124414953036';  // ID do usuário para quem você deseja enviar a mensagem

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