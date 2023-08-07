const express = require('express')
const router = express.Router()
const multer  = require('multer');
const path = require('path')
const fs = require('fs')
const Company = require('../models/Company')
const { v4: uuidv4 } = require('uuid');

const {
  authMiddleware,
  isAdmin
} = require('../middlewares/authMiddleware')

const {
  dashboard,
  allCalls,
  viewEquipment,
  viewReport,
  viewBudget,
  myEquipments,
  budgets,
  reports,
  account,
  updateAccount,
  newEquipment,
  saveEquipment,
  viewCall,
  saveCall,
  newPassword,
  notificationsEmail,
  notifications
} = require('../controllers/technicianCtrl')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.resolve(__dirname, '../public/img/uploads');
    cb(null, path.resolve(__dirname, destinationPath))
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const filename = randomNumber.toString() + extension;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });


// Dashboard
router.get("/", authMiddleware, dashboard)

// Chamados
router.get("/all-calls", authMiddleware, allCalls)
router.get("/register-equipment", authMiddleware, newEquipment)
router.put("/save-equipment/:id", authMiddleware, saveEquipment)
router.get("/view-call/:id", authMiddleware, viewCall)
router.post("/save-call", authMiddleware, saveCall)
router.post('/save-image-call', authMiddleware, upload.single('image'), function (req, res, next) {
  const destinationPath = path.resolve(__dirname, '../public/img/uploads');
  const filePath = path.join(destinationPath, req.file.filename);
  const extension = path.extname(req.file.originalname);
  const newRandomNumber = Math.floor(Math.random() * 1000000000);
  const newFilename = uuidv4() + '-' + Date.now() + '-' + newRandomNumber.toString() + extension
  fs.rename(filePath, path.join(destinationPath, newFilename), function (err) {
    if (err) {
      return next(err);
    }
    res.send(newFilename);
  });
})


router.get("/view-equipment", authMiddleware, viewEquipment)
router.get("/view-report", authMiddleware, viewReport)
router.get("/view-budget", authMiddleware, viewBudget)
router.get("/notifications", authMiddleware, notifications)
router.get("/my-equipments", authMiddleware, myEquipments)
router.get("/reports", authMiddleware, reports)
router.get("/budgets", authMiddleware, budgets)


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

router.post('/account/upload', authMiddleware, uploadPhoto.single('image'), function (req, res, next) {
  const filePath = path.join('./public/img/photos', req.file.filename);
  const extension = path.extname(req.file.originalname);
  const newRandomNumber = Math.floor(Math.random() * 1000000000);
  const newFilename = uuidv4() + '-' + Date.now() + '-' + newRandomNumber.toString() + extension
  fs.rename(filePath, path.join('./public/img/photos', newFilename), async function (err) {
    if (err) {
      return next(err);
    }

    const find = await Company.findById(req.user._id)

    if (find.photo.length != 0) {
      fs.unlink(`./public/img/photos/${find.photo}`, (err) => {
        if (err) {
          res.sendStatus(500)
        }
      });
    }
    
    const update = await Company.findByIdAndUpdate(req.user._id, {
      photo: newFilename
    })

    res.send(newFilename);
  });
});


module.exports = router