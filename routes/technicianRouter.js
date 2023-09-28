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
  calls,
  viewCall,
  initiateCall,
  insertCode,
  completeCall,

  reports,
  viewReport,

  scanQrCode,

  allEquipments,
  newEquipment,
  viewEquipment,
  saveEquipment,

  allCompanies,
  viewCompany,
  
  updateAccount,
  account,
  newPassword,
} = require('../controllers/technicianCtrl')


// ########################## //
// ##       CHAMADOS       ## //
// ########################## //

router.get("/calls", authMiddleware, calls)
router.get("/view-call/:id", authMiddleware, viewCall)
router.put("/initiate-call/:id", authMiddleware, initiateCall)
router.put("/insert-code/:id", authMiddleware, insertCode)
router.put("/complete-call/:id", authMiddleware, completeCall)





// ########################## //
// ##      RELATÓRIOS      ## //
// ########################## //

router.get("/reports", authMiddleware, reports)
router.get("/view-report/:id", authMiddleware, viewReport)





// ######################## //
// ##    EQUIPAMENTOS    ## //
// ######################## //

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.resolve(__dirname, '../public/img/equipments');
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

router.get("/equipments", authMiddleware, allEquipments)
router.get("/register-equipment", authMiddleware, newEquipment)
router.get("/view-equipment/:id", authMiddleware, viewEquipment)
router.put("/save-equipment", authMiddleware, saveEquipment)
router.post('/save-image-equipment', authMiddleware, upload.single('image'), function (req, res, next) {
  const destinationPath = path.resolve(__dirname, '../public/img/equipments');
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





// ########################## //
// ##       EMPRESAS       ## //
// ########################## //

router.get("/companies", authMiddleware, allCompanies)
router.get("/view-company/:id", authMiddleware, viewCompany)



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