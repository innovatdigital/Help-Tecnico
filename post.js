const axios = require('axios');
const FormData = require('form-data');

const groupID = '974183593548233'; // o ID do grupo que você deseja publicar
const accessToken = 'EAAHr78QAzgwBALCIPrJSLJwzgZCX0HlKADkWRrdBXBXOkuU0UwX6Rh6OiZCBYrCQA1GpBlgQCxhzL3iRL3YZAZB6RTlNi9p0XmDacsydE0lJIZC3VuUxYqlWjvzYTuFODb67ryNmzr7RDb4KX0CdZBB7UASJspfE2QOgCIGR6QAVIC1qlA1EUFFHek1mdoo9VqPUER5ULBlbJZAaBsms7PkC3RrZA2EZAalgZD'; // seu token de acesso

// conteúdo da postagem
const message = 'Minha postagem em grupo com uma imagem';
const imageUrl = 'https://res.cloudinary.com/dxpaf689x/image/upload/v1678381875/l6ywcmvyxctxhnoorihp.png'; // URL da imagem

// criar um objeto FormData para enviar a imagem
const formData = new FormData();
formData.append('file', imageUrl);

// fazer o upload da imagem para o Facebook
axios({
  method: 'post',
  url: `https://graph.facebook.com/${groupID}/photos`,
  data: formData,
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    ...formData.getHeaders()
  }
})
.then(response => {
  // obter o ID da imagem enviada
  const imageID = response.data.id;
  
  // criar a publicação no grupo
  const postUrl = `https://graph.facebook.com/${groupID}/feed`;
  const postData = {
    message: message,
    attached_media: [{ media_fbid: imageID }]
  };
  
  axios({
    method: 'post',
    url: postUrl,
    data: postData,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error.response.data.error);
  });
})
.catch(error => {
  console.log(error.response.data.error);
});