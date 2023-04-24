const express = require('express')
const router = express.Router()
const axios = require('axios')
const cookie = require('cookie');
const multer  = require('multer');
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

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
    newUser,
    newUserPage,
    infoUser,
    updateUser,
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
    pagesList,
    access_token,
    postFacebook,
    postInstagram
} = require('../controllers/newPostCtrl')

const { 
    dashboard,
    allPosts,
    notifications,
    logout
} = require('../controllers/platformCtrl')

const { 
    config,
} = require('../controllers/configAccountCtrl')

const {
  tutorials
} = require('../controllers/tutorialsCtrl')

const { 
    comments,
    activeBot,
    disableBot
} = require('../controllers/commentsCtrl');

const {
    pages,
} = require('../controllers/pagesCtrl');

const {
    historic,
} = require('../controllers/historicCtrl');


// Dashboard
router.get("/", auth, dashboard)


// Posts
router.get("/all-posts", auth, allPosts)
router.get("/groups", auth, groups)
router.get("/accounts", auth, accounts)



// NewPost
router.get("/post_facebook/", auth, postFacebook)
router.get("/post_facebook/pages/:id", auth, pagesList)
router.get("/post_facebook/access/:id", auth, access_token)
router.get("/post_instagram/", auth, postInstagram)

router.post("/post_facebook/new", auth, PostFacebook)
router.post("/post_instagram/new", auth, postFacebook)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const randomNumber = Math.floor(Math.random() * 1000000000); // gera um número aleatório com até 9 dígitos
    const filename = randomNumber.toString() + extension; // concatena o número aleatório com a extensão do arquivo
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

router.post('/post/upload', auth, upload.single('image'), function (req, res, next) {
  const filePath = path.join('uploads', req.file.filename);
  const extension = path.extname(req.file.originalname);
  const newRandomNumber = Math.floor(Math.random() * 1000000000); // gera um novo número aleatório com até 9 dígitos
  const newFilename = uuidv4() + '-' + Date.now() + '-' + newRandomNumber.toString() + extension; // concatena o identificador único, o timestamp e o novo número aleatório com a extensão do arquivo
  fs.rename(filePath, path.join('uploads', newFilename), function (err) {
    if (err) {
      return next(err);
    }
    res.send(newFilename);
  });
});


// Groups
router.get("/groups", auth, groups)



// Historic
router.get("/historic", auth, historic)



// Notifications
router.get("/notifications", auth, notifications)



// Pages
router.get("/pages", auth, pages)



// Accounts
router.get("/accounts", auth, accounts)
router.delete("/accounts/delete/:id", auth, deleteAccount)
router.get('/accounts/auth/facebook', auth, (req, res) => {
  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = 'https://plubee.net/platform/accounts/auth/facebook/callback';
  const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=public_profile,email,pages_manage_posts,pages_show_list,publish_to_groups,pages_read_user_content,pages_manage_engagement,pages_read_engagement`;

  // Armazena o valor do cookie _id na sessão
  req.session._id = req.cookies._id;

  res.redirect(url);
});

router.get('/accounts/auth/facebook/callback', (req, res) => {

  // Verifique se há um código no parâmetro de consulta
  const code = req.query.code;
  if (!code) {
    return res.status(401).send('Não foi possível obter o código de autorização do Facebook.');
  }

  // Use o código para obter o token de acesso do Facebook
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = 'https://plubee.net/platform/accounts/auth/facebook/callback';
  const tokenUrl = `https://graph.facebook.com/v13.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${redirectUri}&code=${code}`;

  // Faça uma solicitação POST para obter o token de acesso
  axios.post(tokenUrl)
    .then(response => {
      const accessToken = response.data.access_token;
      // Faça uma solicitação GET para obter o perfil do usuário do Facebook usando o token de acesso
      const graphApiUrl = `https://graph.facebook.com/me?fields=id,name,email,picture.width(500).height(500)&access_token=${accessToken}`;
      axios.get(graphApiUrl)
        .then(async response => {
          const userData = response.data;
          await newAccountFb(req.session._id, accessToken, userData)
          await new Promise((resolve, reject) => {
            setTimeout(resolve, 12000);
          });
          const deleteSession = req.session.destroy
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

router.get('/accounts/auth/instagram', auth, (req, res) => {
    const redirect_uri = 'https://plubee.net/platform/accounts/auth/instagram/callback';
    const client_id = '873936987022758';
    const url = `https://api.instagram.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=user_profile,user_media`;
  
    res.redirect(url);
})
router.get('/accounts/auth/instagram/callback', auth, newAccountIg)



// Comments bot
router.get("/comments-automatic", auth, comments)
router.put("/comments-automatic/config/", auth, activeBot)
router.delete("/comments-automatic/delete/:id_post", auth, disableBot)



// Tutoriais da plataforma
router.get("/help", auth, tutorials)



// Configurações da conta
router.get("/config", auth, config)



// Logout
router.get("/logout", logout)



// Admin
router.get("/new_user", checkAdmin, newUserPage)
router.post("/new_user/save", checkAdmin, newUser)
router.get("/users", checkAdmin, users)
router.get("/users/:id", checkAdmin, infoUser)
router.get("/users/:id", checkAdmin, infoUser)
router.post("/users/update/:id", checkAdmin, updateUser)
router.get("/feedbacks", checkAdmin, feedbacks)
router.get("/plans", checkAdmin, plans)
router.get("/finance", checkAdmin, finance)
router.get("/email", checkAdmin, emails)
router.post("/plans/new-plan", checkAdmin, newPlan)
router.post("/users/new", checkAdmin, newUser)
router.post("/users/block/:id", checkAdmin, blockUser)
router.post("/users/unlock/:id", checkAdmin, unlockUser)
router.delete("/users/delete/:id", checkAdmin, deleteUser)

module.exports = router