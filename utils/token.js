const fbgraph = require('fbgraph');
const request = require('request');
const fb = require('fb');

const validToken = async (token) => {
  return new Promise((resolve, reject) => {
    fbgraph.get("debug_token", { input_token: token, access_token: token }, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res.data.is_valid);
      }
    });
  });
};

async function extendAccessToken(app_id, app_secret, accessToken) {
  return new Promise((resolve, reject) => {
    fb.api('oauth/access_token', {
      client_id: app_id,
      client_secret: app_secret,
      grant_type: 'fb_exchange_token',
      fb_exchange_token: accessToken
    }, (res) => {
      if(!res || res.error) {
        return reject(!res ? 'Error occurred' : res.error);
      }

      const extendedAccessToken = res.access_token;
      const expiresIn = res.expires_in;

      resolve({ extendedAccessToken, expiresIn });
    });
  });
}

module.exports = {
  validToken,
  extendAccessToken
}