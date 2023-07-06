const express = require('express')
const router = express.Router()
const multer  = require('multer');
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

// const {
//   authMiddleware,
// } = require('../middlewares/authMiddleware')

// const { 
//   dashboard,
//   logout
// } = require('../controllers/platformCtrl')

// const { 
//     account,
//     updateAccount,
//     newPassword,
//     notificationsEmail
// } = require('../controllers/accountCtrl')


// // Dashboard
// router.get("/", authMiddleware, dashboard)


// // Account
// router.get("/account", authMiddleware, account)
// router.post("/account/update", authMiddleware, updateAccount)
// router.post("/account/password", authMiddleware, newPassword)
// router.post("/account/notifications", authMiddleware, notificationsEmail)

// const storagePhoto = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/img/photos')
//   },
//   filename: function (req, file, cb) {
//     const extension = path.extname(file.originalname);
//     const randomNumber = Math.floor(Math.random() * 1000000000);
//     const filename = randomNumber.toString() + extension;
//     cb(null, filename);
//   }
// });

// const uploadPhoto = multer({ storage: storagePhoto });

// router.post('/config/upload', authMiddleware, uploadPhoto.single('image'), function (req, res, next) {
//   const filePath = path.join('./public/img/photos', req.file.filename);
//   const extension = path.extname(req.file.originalname);
//   const newRandomNumber = Math.floor(Math.random() * 1000000000);
//   const newFilename = uuidv4() + '-' + Date.now() + '-' + newRandomNumber.toString() + extension
//   fs.rename(filePath, path.join('./public/img/photos', newFilename), async function (err) {
//     if (err) {
//       return next(err);
//     }

//     const find = await User.findById(req.cookies._id)

//     if (find.photo.length != 0) {
//       fs.unlink(`./public/img/photos/${find.photo}`, (err) => {
//         if (err) {
//           res.sendStatus(500)
//         }
//       });
//     }
    
//     const update = await User.findByIdAndUpdate(req.cookies._id, {
//       photo: newFilename
//     })

//     res.send(newFilename);
//   });
// });



// // Logout
// router.get("/logout", logout)


module.exports = router