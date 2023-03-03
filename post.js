const axios = require('axios');

const accessToken = 'EAAHr78QAzgwBAOmyQiOcoKyZCUMeSw16ZAC6nOQLpVClKmyLaVacHPkwC3EEW4tpBamx2v3WaxxcoiB3sVNOWaUrYG3vIw7kfdqOjDutNLIciwZBO1GsVBRIm4WF3ycq80xGuZCwKIxOcH3RH2LQPf0RagGyAJ8ojGIj7wZBZCzA1CHXc52M5F';

const formData = new FormData();
formData.append('message', 'Minha postagem com várias imagens');
formData.append('published', 'true');

const imagens = ['/public/img/site/dash.png', '/public/img/site/dash.png']; // array com os arquivos de imagem
for (let i = 0; i < imagens.length; i++) {
  formData.append(`file${i + 1}`, imagens[i]);
}

axios({
  method: 'post',
  url: 'https://graph.facebook.com/me/photos',
  data: formData,
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'multipart/form-data'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.log(error.response.data.error);
});