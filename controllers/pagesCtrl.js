const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const request = require('request')
const axios = require('axios')

const pages = asyncHandler(async(req, res) => {
    const user = await User.findById({_id: req.cookies._id})
    
    let totalPages = 0

    user.accountsFb.forEach((item) => {
        totalPages += item.pages.length
    })

    res.render('layouts/pages', { isAdmin: user.isAdmin, pages: user.accountsFb, notifications: user.notifications.reverse().slice(0, 5), photo: user.photo, accounts: user.accountsFb, totalPages: totalPages, name_user: user.name })
})

const importPages = asyncHandler(async(req, res) => {
    const id_account = req.params.id_account

    const user = await User.findById(req.cookies._id)

    const account = user.accountsFb.find(account => account.id_account == id_account)

    const accessToken = account.access_token

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
        
            User.findOneAndUpdate({ _id: req.cookies._id, "accountsFb.id_account": id_account }, {
                $set: {
                  "accountsFb.$.pages": pages_user
                }
              }, {
                new: true
            })
            .then(result => {
                res.sendStatus(200)
            })
            .catch(error => {
                console.error(error);
                res.sendStatus(500)
            });
        })
        .catch(error => {
            console.error(error);
            res.sendStatus(500)
        });
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = 
{   pages,
    importPages
}