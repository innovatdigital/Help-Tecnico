const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const bcrypt = require('bcrypt');
const fbgraph = require('fbgraph');
const passport = require("passport")
const axios = require('axios');
const cookie = require('cookie');
const FacebookStrategy = require('passport-facebook').Strategy;

const passportAuth = passport.use(new FacebookStrategy({
    clientID: '540889994808844',
    clientSecret: 'e7230c9ca2b0de9243b344810e6a4196',
    callbackURL: 'https://localhost:5500/platform/accounts/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email'],
    scope: ['email', 'public_profile']
}, function(accessToken, refreshToken, profile, done) {
    // Lógica de verificação do usuário aqui
    const newAccount = newAccountFb(accessToken, refreshToken, profile, profile.photos[0].value)
    done(null);
}));

// Controller

const accounts = asyncHandler(async(req, res) => {
    const find = await User.findById({_id: req.cookies._id}).lean()

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
        accountsRemaining = 1 - count
    } else if (find.type_account == "Pro") {
        accountsRemaining = 5 - count
    } else if (find.type_account == "Avançado") {
        accountsRemaining = 10 - count
    }

    if (find.isAdmin == "true") {
        res.render('layouts/accounts', {isAdmin: true, accounts: accounts, total_accounts: count, accountsRemaining: accountsRemaining})
    } else {
        res.render('layouts/accounts', {isAdmin: false, accounts: accounts, total_accounts: count, accountsRemaining: accountsRemaining})
    }
})

async function newAccountFb(accessToken, refreshToken, profile, photo) {
    try {
        const findAccount = await User.findById({_id: "63f339ba64a838f6882aa2a8", accountsFb: Array})
        const count = findAccount.accountsFb.length

        const data = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(data);

        const accounts = []

        findAccount.accountsFb.forEach((account) => {
            accounts.push(account.name)
        })
        
        if (accounts.includes(profile.displayName)) {
            return "Conta já existente"
        } else {        
            axios.get(`https://graph.facebook.com/v12.0/me/groups?access_token=${accessToken}`)
            .then(response => {
              const groups = response.data.data;
              const groupIds = groups.map(group => group.id);
          
              const list = [];
          
              // Loop através dos IDs de grupo e buscar informações de cada grupo
              groupIds.forEach(group => {
                axios.get(`https://graph.facebook.com/v16.0/${group}?fields=name,description,cover&access_token=${accessToken}`)
                  .then(response => {
                    try {
                        list.push({name: response.data.name, description: response.data.description, image: response.data.cover.source, id: response.data.id});
                    } catch (err) {
                        list.push({name: response.data.name, description: response.data.description, id: response.data.id});
                    }
          
                    // Se a lista de grupos estiver completa, atualizar a conta do usuário
                    if (list.length === groupIds.length) {
                      User.findByIdAndUpdate("63f339ba64a838f6882aa2a8", {
                        $push: {
                          accountsFb: {
                            "id_account": profile.id,
                            "name": profile.displayName,
                            "platform": "Facebook",
                            "photo": photo,
                            "date": dataFormat,
                            "acess_token": accessToken,
                            "posts": [],
                            "groups": list
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
                  .catch(error => {
                    console.error(error);
                  })
                })
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
        const { id_user, photo, name, platform, username, password } = req.body
        const findAccount = await User.findById({_id: id_user, accountsIg: Array})
        const count = findAccount.accountsIg.length

        // Pedir para o usuário desativar autenticação de dois fatores
        
        if (count == 0) {
            const encryptUsername = bcrypt.hash(username, 10)
            const encryptPassword = bcrypt.hash(password, 10)

            const newAccount = await User.findByIdAndUpdate({_id: id_user}, {
                $push: {
                    accountsIg: {
                        "id_account": count + 1,
                        "photo": photo,
                        "name": name,
                        "platform": platform,
                        "date": Date.now(),
                        "username": encryptUsername,
                        "password": encryptPassword,
                        "posts": []
                    }
                }
            },
            {
                new: true,
            });
            
            res.send("Conta inserida com sucesso.")

        } else {
            const accounts = []

            findAccount.accountsIg.forEach((account) => {
                accounts.push(account.username)
            })
            
            if (accounts.includes(username)) {
                res.send("Conta já existente.")
            } else {
                const errors = []

                const newAccount = await User.findByIdAndUpdate({_id: id_user}, {
                    $push: {
                        accountsIg: {
                            "id_account": count + 1,
                            "photo": photo,
                            "name": name,
                            "platform": platform,
                            "date": Date.now(),
                            "username": username,
                            "password": password
                        }
                    }
                },
                {
                    new: true,
                });
                
                res.send("Conta inserida com sucesso.")            
            }
        }
    
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
                    accountsFb: {
                        "id_account": id_account.id,
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
    passportAuth
}