const { IgApiClient } = require('instagram-private-api');
const Images = require('../models/Images');
const express = require('express')
const passport = require("passport")
const FacebookStrategy = require('passport-facebook').Strategy;
const multer = require('multer');
const router = express.Router()

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
    passportAuth,
} = require('../controllers/accountsCtrl')

const { 
    groups,
    groupsFilter
} = require('../controllers/groupsCtrl')

const {
    postFacebook,
    postInstagram
} = require('../controllers/newPostCtrl')

const { 
    dashboard,
    allPosts
} = require('../controllers/platformCtrl')

const { 
    config,
} = require('../controllers/configAccountCtrl')

const { 
    comments,
    activeBot,
    disableBot
} = require('../controllers/commentsCtrl');

// Dashboard
router.get("/", auth, dashboard)

// Posts
router.get("/all-posts", auth, allPosts)
router.get("/groups", auth, groups)
router.get("/accounts", auth, accounts)

// NewPost
router.get("/post_facebook/", postFacebook)
router.get("/post_instagram/", postInstagram)
// router.get("/post_instagram/", postFacebook)
// router.post("/post_facebook/new", postFacebook)
// router.post("/post_instagram/new", postFacebook)

// Groups
router.get("/groups", auth, groups)
router.get("/groups/:id_account", auth, groupsFilter)

// Accounts
router.get("/accounts", auth, accounts)
router.delete("/accounts/delete/:id", auth, deleteAccount)
router.get('/accounts/auth/facebook', passportAuth.authenticate('facebook'));
router.get('/accounts/auth/facebook/callback', passportAuth.authenticate('facebook', {
    successRedirect: '/platform/accounts',
    failureRedirect: '/platform/accounts'
}));
router.post("/accounts/new/ig", checkTypeAccount, newAccountIg)

// Comments bot
router.get("/comments-automatic", auth, comments)
router.put("/comments-automatic/config/", activeBot)
router.delete("/comments-automatic/delete/:id_post", disableBot)

// Configurações da conta
router.get("/config", auth, config)

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