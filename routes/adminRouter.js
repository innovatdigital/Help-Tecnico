const express = require('express')
const router = express.Router()
const multer  = require('multer');
const path = require('path')
const Admin = require('../models/Admin')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const {
  authMiddleware,
  isAdmin
} = require('../middlewares/authMiddleware')

const {
  dashboard,
  users,
  newTechnician,
  newCompany,
  newAdmin,
  newTest,
  newSupplier,
  saveSupplier,
  infoUser,
  saveTechnician,
  saveAdmin,
  saveCompany,
  updateUser,
  blockUser,
  unlockUser,
  deleteUser
} = require('../controllers/adminCtrl')

const { 
  account,
  updateAccount,
  newPassword,
  notificationsEmail
} = require('../controllers/accountCtrl')


// Dashboard
router.get("/", authMiddleware, dashboard)


// Infos
router.get("/all-calls", authMiddleware)
router.get("/all-companies", authMiddleware)

// router.delete("/all-posts/delete-post/:id", authMiddleware)
// router.put("/all-posts/edit-post-schedule-link/:id", authMiddleware, editPostScheduleLink)
// router.put("/all-posts/edit-post-schedule-image/:id", authMiddleware, editPostScheduleImage)
// router.put("/all-posts/edit-post-published/:id", authMiddleware, editPostPublished)
// router.get("/view/:id", authMiddleware, viewPost)


// Account
router.get("/account", authMiddleware, account)
router.post("/account/update", authMiddleware, updateAccount)
router.post("/account/password", authMiddleware, newPassword)
router.post("/account/notifications", authMiddleware, notificationsEmail)

const storagePhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/photos')
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const filename = randomNumber.toString() + extension;
    cb(null, filename);
  }
});

const uploadPhoto = multer({ storage: storagePhoto });

router.post('/config/upload', authMiddleware, uploadPhoto.single('image'), function (req, res, next) {
  const filePath = path.join('./public/img/photos', req.file.filename);
  const extension = path.extname(req.file.originalname);
  const newRandomNumber = Math.floor(Math.random() * 1000000000);
  const newFilename = uuidv4() + '-' + Date.now() + '-' + newRandomNumber.toString() + extension
  fs.rename(filePath, path.join('./public/img/photos', newFilename), async function (err) {
    if (err) {
      return next(err);
    }

    const find = await Admin.findById(req.user._id)

    if (find.photo.length != 0) {
      fs.unlink(`./public/img/photos/${find.photo}`, (err) => {
        if (err) {
          res.sendStatus(500)
        }
      });
    }
    
    const update = await Admin.findByIdAndUpdate(req.user._id, {
      photo: newFilename
    })

    res.send(newFilename);
  });
});


// Functions
router.get("/new-technician", authMiddleware, isAdmin, newTechnician)
router.post("/new-technician/save", authMiddleware, isAdmin, saveTechnician)

router.get("/new-company", authMiddleware, isAdmin, newCompany)
router.post("/new-company/save", authMiddleware, isAdmin, saveCompany)

router.get("/new-admin", authMiddleware, isAdmin, newAdmin)
router.post("/new-admin/save", authMiddleware, isAdmin, saveAdmin)

router.get("/new_test", authMiddleware, isAdmin, newTest)

router.get("/new-supplier", authMiddleware, isAdmin, newSupplier)
router.post("/new-supplier/save", authMiddleware, isAdmin, saveSupplier)

router.get("/users", authMiddleware, isAdmin, users)
router.get("/users/:id", authMiddleware, isAdmin, infoUser)
router.put("/users/update/:id", authMiddleware, isAdmin, updateUser)
router.post("/users/block/:id", authMiddleware, isAdmin, blockUser)
router.post("/users/unlock/:id", authMiddleware, isAdmin, unlockUser)
router.delete("/users/delete/:id", authMiddleware, isAdmin, deleteUser)

module.exports = router