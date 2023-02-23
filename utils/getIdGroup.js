const FB = require('fb');

FB.setAccessToken("EAAISx9tF55sBAHrRWGIuBvjYx1FzDPtv7eKpqkOsLFO8OxYYArhWS31L72NG2bTrrphOn5tXsNFA2ZB4YnzQVZBgXnoUWtjZA55uwrkxRZCSLDy8K2iKZCwF23545QRGg5dsCAefyoSbi3G2cFpIzNz9brEeB0ZCLXWjHviMghbXNSJkZAy7KUc");

const groupLink = 'https://www.facebook.com/groups/hackersbrasilhbb';

FB.api(
  '/',
  'get',
  { ids: groupLink, fields: 'id' },
  function (res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log(res)
    console.log('ID do grupo: ' + res[groupLink].id);
  }
);