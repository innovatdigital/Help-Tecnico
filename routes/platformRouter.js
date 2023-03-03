const express = require('express')
const router = express.Router()
const axios = require('axios')

const {
    checkTypeAccount
} = require('../middlewares/newAccountFB')

const {
    checkAdmin,
} = require('../middlewares/admin')

const {
    auth,
} = require('../middlewares/checkLogin')

const { 
    feedbacks,
    users,
    blockUser,
    unlockUser,
    deleteUser,
    plans,
    newPlan,
    finance,
    emails
} = require('../controllers/adminCtrl')

const { 
    accounts,
    newAccountFb,
    newAccountIg,
    deleteAccount,
    passportAuthFacebook,
    passportAuthInstagram
} = require('../controllers/accountsCtrl')

const { 
    groups,
} = require('../controllers/groupsCtrl')

const {
    PostFacebook,
    postFacebook,
    postInstagram
} = require('../controllers/newPostCtrl')

const { 
    dashboard,
    allPosts,
    logout
} = require('../controllers/platformCtrl')

const { 
    config,
} = require('../controllers/configAccountCtrl')

const { 
    comments,
    activeBot,
    disableBot
} = require('../controllers/commentsCtrl');

const {
    pages,
} = require('../controllers/pagesCtrl');



// Dashboard
router.get("/", auth, dashboard)



// Posts
router.get("/all-posts", auth, allPosts)
router.get("/groups", auth, groups)
router.get("/accounts", auth, accounts)



// NewPost
router.get("/post_facebook/", postFacebook)
router.get("/post_instagram/", postInstagram)

router.post("/post_facebook/new", PostFacebook)
router.post("/post_instagram/new", postFacebook)



// Groups
router.get("/groups", auth, groups)



// Pages
router.get("/pages", auth, pages)



// Accounts
router.get("/accounts", auth, accounts)
router.delete("/accounts/delete/:id", auth, deleteAccount)
router.get('/accounts/auth/facebook', (req, res) => {
    const appId = '540889994808844';
    const redirectUri = 'https://localhost:5500/platform/accounts/auth/facebook/callback';
    const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=email`;
  
    res.redirect(url);
});

router.get('/accounts/auth/facebook/callback', (req, res) => {
  // Verifique se há um código no parâmetro de consulta
  const code = req.query.code;
  if (!code) {
    return res.status(401).send('Não foi possível obter o código de autorização do Facebook.');
  }

  // Use o código para obter o token de acesso do Facebook
  const appId = '540889994808844';
  const appSecret = '8f14320ee467d63b94aa48dc439734f7';
  const redirectUri = 'https://localhost:5500/platform/accounts/auth/facebook/callback';
  const tokenUrl = `https://graph.facebook.com/v13.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${redirectUri}&code=${code}`;

  // Faça uma solicitação POST para obter o token de acesso
  axios.post(tokenUrl)
    .then(response => {
      const accessToken = response.data.access_token;
      // Faça uma solicitação GET para obter o perfil do usuário do Facebook usando o token de acesso
      const graphApiUrl = `https://graph.facebook.com/me?fields=id,name,email,picture.width(500).height(500)&access_token=${accessToken}`;
      axios.get(graphApiUrl)
        .then(response => {
          const userData = response.data;
          newAccountFb(req.cookies._id, accessToken, userData)
          res.redirect('/platform/accounts');
        })
        .catch(error => {
          console.error(error);
          res.status(500).send('Não foi possível obter o perfil do usuário do Facebook.');
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Não foi possível obter o token de acesso do Facebook.');
    });
});

router.get('/accounts/auth/instagram', (req, res) => {
    const redirect_uri = 'https://localhost:5500/platform/accounts/auth/instagram/callback';
    const client_id = '873936987022758';
    const url = `https://api.instagram.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=user_profile,user_media`;
  
    res.redirect(url);
})
router.get('/accounts/auth/instagram/callback', newAccountIg)



// Comments bot
router.get("/comments-automatic", auth, comments)
router.put("/comments-automatic/config/", activeBot)
router.delete("/comments-automatic/delete/:id_post", disableBot)



// Configurações da conta
router.get("/config", auth, config)



// Logout
router.get("/logout", logout)



// Admin
router.get("/feedbacks", checkAdmin, feedbacks)
router.get("/users", checkAdmin, users)
router.get("/plans", checkAdmin, plans)
router.get("/finance", checkAdmin, finance)
router.get("/email", checkAdmin, emails)
router.post("/plans/new-plan", checkAdmin, newPlan)
router.post("/users/block/:id", blockUser)
router.post("/users/unlock/:id", unlockUser)
router.delete("/users/delete/:id", deleteUser)

module.exports = router