const FB = require('fb');

FB.setAccessToken("EAAISx9tF55sBAHrRWGIuBvjYx1FzDPtv7eKpqkOsLFO8OxYYArhWS31L72NG2bTrrphOn5tXsNFA2ZB4YnzQVZBgXnoUWtjZA55uwrkxRZCSLDy8K2iKZCwF23545QRGg5dsCAefyoSbi3G2cFpIzNz9brEeB0ZCLXWjHviMghbXNSJkZAy7KUc");

FB.api(
    '/122252490561446/comments',
    'get',
    {},
    function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
  
      res.data.forEach(function(comment) {w
        FB.api(
          '/' + comment.id + '/comments',
          'post',
          { message: 'Obrigado por seu comentário!' },
          function (res) {
            if (!res || res.error) {
              console.log(!res ? 'error occurred' : res.error);
              return;
            }
            console.log('Resposta publicada com sucesso!');
          }
        );
      });
    }
  );