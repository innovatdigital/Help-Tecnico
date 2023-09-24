const express = require('express')
const router = express.Router()
const multer  = require('multer');
const path = require('path')
const fs = require('fs')
const Technician = require('../models/Technician')
const { v4: uuidv4 } = require('uuid');

const {
  authMiddleware,
  isAdmin
} = require('../middlewares/authMiddleware')

const {
  scanQrCode,
  account,
  updateAccount,
  newEquipment,
  saveEquipment,
  newPassword,
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


router.get("/register-equipment", authMiddleware, newEquipment)
router.put("/save-equipment/:id", authMiddleware, saveEquipment)



// ######################### //
// ##       QR CODE       ## //
// ######################### //

router.get("/scan-qr-code", authMiddleware, scanQrCode)





// ######################### //
// ##        CONTA        ## //
// ######################### //

router.get("/account", authMiddleware, account)
router.post("/account/update", authMiddleware, updateAccount)
router.post("/account/password", authMiddleware, newPassword)

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

    const find = await Technician.findById(req.user._id)

    if (find.photo.length != 0) {
      fs.unlink(`./public/img/photos/${find.photo}`, (err) => {
        if (err) {
          res.sendStatus(500)
        }
      });
    }

    const update = await Technician.findByIdAndUpdate(req.user._id, {
      photo: newFilename
    })

    res.send(newFilename);
  });
});


module.exports = router