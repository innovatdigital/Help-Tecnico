const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const passport = require("passport")
const axios = require('axios');
const request = require('request')
const Historic = require('../models/Historic')
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;

const passportAuthInstagram = passport.use(new InstagramStrategy({
    clientID: '873936987022758',
    clientSecret: 'edca2da17e56d5e9c67e3f07003b421f',
    callbackURL: 'https://localhost:5500/platform/accounts/auth/instagram/callback',
    scope: ['user_profile', 'user_media']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken, profile)
    return done(null, profile);
  }
));


// Controller

const accounts = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    const accounts = []

    let count = 0
    let accountsRemaining = 0

    find.accountsFb.forEach(account => {
        accounts.push(account)
        count = count + 1
    })

    find.accountsIg.forEach(account => {
        accounts.push(account)
        count = count + 1
    })

    if (find.type_account == "Basico") {
        accountsRemaining = 5 - count
    } else if (find.type_account == "Pro") {
        accountsRemaining = 15 - count
    } else if (find.type_account == "Avançado") {
        accountsRemaining = "Contas ilimitadas"
    }

    res.render('layouts/accounts', {isAdmin: find.isAdmin, accounts: accounts, total_accounts: count, accountsRemaining: accountsRemaining, type_account: find.type_account, notifications: find.notifications.reverse().slice(0, 5)})
})

async function newAccountFb(id_user, accessToken, profile) {
    try {
        const requestUrl = `https://graph.facebook.com/v16.0/me/accounts?access_token=${accessToken}`;
        let pages = ""

        request(requestUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                pages = JSON.parse(body).data;
            } else {
                console.log('Erro ao importar conta.')
            }
        });    

        const findAccount = await User.findById({_id: id_user, accountsFb: Array})
        const count = findAccount.accountsFb.length

        const data = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(data);

        const accounts = []

        findAccount.accountsFb.forEach((account) => {
            accounts.push(account.name)
        })
        
        if (accounts.includes(profile.name)) {
            return "Conta já existente"
        } else {
            axios.get(`https://graph.facebook.com/v16.0/me/groups?access_token=${accessToken}&fields=privacy,name,icon,description,id`)
            .then(async response => {
              const groups = response.data.data;
              const groupIds = groups
                .map(group => group.id);
          
              const list = [];

              const pages_user = []
              const comments = []

              for (const page of pages) {
                  try {
                      const response = await axios.get(`https://graph.facebook.com/v16.0/${page.id}/picture?redirect=false&type=large&access_token=${page.access_token}`);
                      const pageImage = response.data.data.url;
      
                      const postResponse = await axios.get(`https://graph.facebook.com/v16.0/${page.id}/posts`, {
                          params: {
                              fields: 'comments',
                              access_token: page.access_token,
                              limit: 20
                          }
                      });
                      postResponse.data.data.forEach(post => {
                          if (post.comments?.data) {
                              comments.push(...post.comments.data);
                          }
                      });
      
                      pages_user.push({name: page.name, id_page: page.id, access_token: page.access_token, image: pageImage});
                  } catch (err) {
                      pages_user.push({name: page.name, id_page: page.id, access_token: page.access_token});
                  }
              }
          
              // Loop através dos IDs de grupo e buscar informações de cada grupo]
              if (groups.length > 0) {
                groups.forEach(async group => {
                    axios.get(`https://graph.facebook.com/v16.0/${group.id}?fields=name,description,cover&access_token=${accessToken}`)
                    .then(response => {
                        if (response.data.hasOwnProperty("cover")) {
                            list.push({name: response.data.name, description: response.data.description, image: response.data.cover.source, id: response.data.id, account_name: profile.name, id_account: profile.id, account_photo: profile.picture.data.url})
                        } else {
                            list.push({name: response.data.name, id: response.data.id, account_name: profile.name, id_account: profile.id, account_photo: profile.picture.data.url});
                        }
        
                        if (list.length === groupIds.length) {
                            list.forEach(async group => {
                                const saveGroup = await User.findByIdAndUpdate(id_user, {
                                    $push: {
                                        groups: {
                                            "name": group.name,
                                            "id": group.id,
                                            "image": group.hasOwnProperty("image") ? group.image : "",
                                            "description": group.description,
                                            "account_name": group.account_name,
                                            "id_account": group.id_account,
                                            "account_photo": group.account_photo
                                        }
                                    }
                                })
                            })

                            User.findByIdAndUpdate(id_user, {
                                $push: {
                                    accountsFb: {
                                        "id_account": profile.id,
                                        "name": profile.name,
                                        "platform": "Facebook",
                                        "photo": profile.picture.data.url,
                                        "date": dataFormat,
                                        "access_token": accessToken,
                                        "posts": [],
                                        "pages": pages_user,
                                    },

                                    historic: {
                                        "action": "Nova conta adicionada.",
                                        "subtitle": profile.name,
                                        "date": dataFormat,
                                        "type": "account"
                                    }
                                }
                            }, {
                                new: true
                            })
                            .then(result => {
                            })
                            .catch(error => {
                                console.error(error);
                            });
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
                })
              } else {
                User.findByIdAndUpdate(id_user, {
                    $push: {
                        accountsFb: {
                            "id_account": profile.id,
                            "name": profile.name,
                            "platform": "Facebook",
                            "photo": profile.picture.data.url,
                            "date": dataFormat,
                            "access_token": accessToken,
                            "posts": [],
                            "pages": pages_user,
                        },

                        historic: {
                            "action": "Nova conta adicionada.",
                            "subtitle": profile.name,
                            "date": dataFormat,
                            "type": "account"
                        }
                    }
                }, {
                    new: true
                })
                .then(result => {
                    const find = User.findById(id_user)
                    // const historic = Historic.create({"action": `Nova conta adicionada: ${profile.name}`, "name": find.name, "id_user": find._id, "date": dataFormat})
                })
                .catch(error => {
                    console.error(error);
                });
              }
            })
            .catch(error => {
              console.error(error);
            });
        }

    } catch (err) {
        console.log(err)
        return "Erro ao inserir conta"
    }
}

const newAccountIg = asyncHandler(async(req, res) => {
    try {        
        const redirect_uri = 'https://localhost:5500/platform/accounts/auth/instagram/callback';
        const client_id = '873936987022758';
        const client_secret = 'edca2da17e56d5e9c67e3f07003b421f';
        const code = req.query.code;
      
        const url = `https://api.instagram.com/oauth/access_token`;
      
        const options = {
          method: 'POST',
          url: url,
          form: {
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: redirect_uri,
            code: code,
            grant_type: 'authorization_code'
          }
        };
      
        request(options, (error, response, body) => {
          if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
            return;
          }
      
          const json = JSON.parse(body);
      
          const access_token = json.access_token;
          const user_url = `https://graph.instagram.com/me?fields=id,username&access_token=${access_token}`;
          
          request(user_url, async(error, response, body) => {
            if (error) {
              console.error(error);
              res.status(500).send('Internal Server Error');
              return;
            }
            
            const user_data = JSON.parse(body);
          
            const findAccount = await User.findById({_id: "63f339ba64a838f6882aa2a8", accountsIg: Array})
            const count = findAccount.accountsIg.length
    
            const data = Date.now();
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formater = new Intl.DateTimeFormat('pt-BR', options);
            const dataFormat = formater.format(data);
    
            const accounts = []
    
            findAccount.accountsIg.forEach((account) => {
                accounts.push(account.name)
            })
            
            if (accounts.includes(user_data.username)) {
                return "Conta já existente"
            } else {
                User.findByIdAndUpdate("63f339ba64a838f6882aa2a8", {
                    $push: {
                        accountsIg: {
                            "id_account": user_data.id,
                            "name": user_data.username,
                            "platform": "Instagram",
                            "photo": "/img/platform/instagram.png",
                            "date": dataFormat,
                            "access_token": access_token,
                        }
                    }
                }, {
                    new: true
                })
                .then(result => {
                    console.log("Conta inserida com sucesso");
                })
                .catch(error => {
                    console.error(error);
                });
            }
          })
        })
    } catch (err) {
        res.send(err)
    }
})

const deleteAccount = asyncHandler(async(req, res) => {
    try {
        const id_account = req.params

        if (req.body.platform === "Facebook") {
            const deleteAccount = await User.findByIdAndUpdate({_id: req.cookies._id}, {
                $pull: {
                    groups: {
                        "id_account": id_account.id
                    },

                    accountsFb: {
                        "id_account": id_account.id
                    }
                }
            })

            res.send(deleteAccount)
        } else if (req.body.platform === "Instagram") {
            const deleteAccount = await User.findByIdAndUpdate({_id: req.cookies._id}, {
                $pull: {
                    accountsIg: {
                        "id_account": id_account.id,
                    }
                }
            })

            res.send(deleteAccount)
        }
    } catch (err) {
        res.send(err)
    }
})

module.exports = 
{   accounts,
    newAccountFb,
    newAccountIg,
    deleteAccount,
    passportAuthInstagram
}