const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path')
const fs = require('fs')
const Company = require('../models/companyModel')
const { v4: uuidv4 } = require('uuid');

const {
  authMiddleware,
  isCompany
} = require('../middlewares/authMiddleware')

const {
  dashboard,

  calls,
  newCall,
  viewCall,
  saveCall,
  cancelCall,

  equipments,
  viewEquipment,
  
  viewPmoc,

  viewEquipmentList,

  reports,
  viewReport,

  budgets,
  viewBudget,

  settings,
  updateAccount,
  updatePassword,
} = require('../controllers/companyCtrl')


// ########################### //
// ##       DASHBOARD       ## //
// ########################### //

router.get("/", authMiddleware, dashboard)





// ########################## //
// ##       CHAMADOS       ## //
// ########################## //

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.resolve(__dirname, '../public/img/calls');
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

router.get("/all-calls", authMiddleware, calls)
router.get("/new-call", authMiddleware, newCall)
router.get("/view-call/:id", authMiddleware, viewCall)
router.post("/save-call", authMiddleware, saveCall)
router.post('/save-image-call', authMiddleware, upload.single('image'), function (req, res, next) {
  const destinationPath = path.resolve(__dirname, '../public/img/calls');
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
router.delete("/cancel-call/:id", authMiddleware, cancelCall)





// ########################## //
// ##     EQUIPAMENTOS     ## //
// ########################## //

router.get("/equipments", authMiddleware, equipments)
router.get("/view-equipment/:id", authMiddleware, viewEquipment)





// ########################## //
// ##         PMOC         ## //
// ########################## //

router.get("/view-pmoc", authMiddleware, viewPmoc)





// ################################# //
// ##    LISTA DE EQUIPAMENTOS    ## //
// ################################# //

router.get("/view-equipment-list", authMiddleware, viewEquipmentList)





// ########################## //
// ##      RELATÓRIOS      ## //
// ########################## //

router.get("/reports", authMiddleware, reports)
router.get("/view-report", authMiddleware, viewReport)





// ########################## //
// ##      ORÇAMENTOS      ## //
// ########################## //

router.get("/budgets", authMiddleware, budgets)
router.get("/view-budget", authMiddleware, viewBudget)





// ######################### //
// ##        CONTA        ## //
// ######################### //

router.get("/settings", authMiddleware, settings)
router.put("/settings/update-account", authMiddleware, updateAccount)
router.put("/settings/update-password", authMiddleware, updatePassword)

const storagePhoto = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/avatars')
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const filename = randomNumber.toString() + extension;
    cb(null, filename);
  }
});

const uploadPhoto = multer({ storage: storagePhoto });

router.put('/settings/update-avatar', authMiddleware, uploadPhoto.single('image'), function (req, res, next) {
  const filePath = path.join('./public/img/avatars', req.file.filename);
  const extension = path.extname(req.file.originalname);
  const newRandomNumber = Math.floor(Math.random() * 1000000000);
  const newFilename = uuidv4() + '-' + Date.now() + '-' + newRandomNumber.toString() + extension

  fs.rename(filePath, path.join('./public/img/avatars', newFilename), async function (err) {
    if (err) {
      return next(err);
    }

    if (req.user.avatar.length != 0) {
      fs.unlink(`./public/img/avatars/${req.user.avatar}`, (err) => {});
    }
    
    const updateAvatar = await User.findByIdAndUpdate(req.user._id, {
      avatar: newFilename
    })

    res.sendStatus(200)
  });
});


module.exports = router