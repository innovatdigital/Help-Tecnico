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
    
  allCalls,
  viewCall,
  designateCall,
  cancelCall,
  
  fileManager,
  createFolder,
  uploadArchive,

  allReports,
  viewReport,

  budgets,
  viewBudget,

  allEquipments,

  administrators,
  newAdmin,
  saveAdmin,

  testUsers,
  newTester,

  technicians,
  newTechnician,
  viewTechnician,
  saveTechnician,
  updateTechnician,
  deleteTechnician,

  allCompanies,
  newCompany,
  saveCompany,
  viewCompany,
  updateCompany,
  deleteCompany,

  allSuppliers,
  newSupplier,
  saveSupplier,
  viewSupplier,
  updateSupplier,
  deleteSupplier,

  invoices,

  account,
  updateAccount,
  newPassword
} = require('../controllers/adminCtrl')


// ########################### //
// ##       DASHBOARD       ## //
// ########################### //

router.get("/", authMiddleware, dashboard)





// ########################## //
// ##       CHAMADOS       ## //
// ########################## //

router.get("/all-calls", authMiddleware, allCalls)
router.get("/view-call/:id", authMiddleware, viewCall)
router.put("/designate-call", authMiddleware, designateCall)
router.delete("/cancel-call/:id", authMiddleware, cancelCall)





// ########################## //
// ##       ARQUIVOS       ## //
// ########################## //

// const upload = multer({ dest: "../public/file-manager" });

router.get("/file-manager", authMiddleware, fileManager)
router.post("/file-manager/create-folder", authMiddleware, createFolder)
// router.post("/file-manager/upload-archive", authMiddleware, upload.single('arquivo'), uploadArchive)





// ########################## //
// ##      RELATÓRIOS      ## //
// ########################## //

router.get("/all-reports", authMiddleware, allReports)
router.get("/view-report/:id", authMiddleware, viewReport)




// ########################## //
// ##      ORÇAMENTOS      ## //
// ########################## //

router.get("/budgets", authMiddleware, budgets)
router.get("/view-budget", authMiddleware, viewBudget)





// ########################## //
// ##     EQUIPAMENTOS     ## //
// ########################## //

router.get("/all-equipments", authMiddleware, allEquipments)





// ########################## //
// ##    ADMINISTRADORES   ## //
// ########################## //

router.get("/administrators", authMiddleware, administrators)
router.get("/new-admin", authMiddleware, isAdmin, newAdmin)
router.post("/new-admin/save", authMiddleware, isAdmin, saveAdmin)





// ########################### //
// ##   USUÁRIOS DE TESTE   ## //
// ########################### //

router.get("/test-users", authMiddleware, testUsers)
router.get("/new-tester", authMiddleware, isAdmin, newTester)





// ########################## //
// ##       TÉCNICOS       ## //
// ########################## //

router.get("/technicians", authMiddleware, technicians)
router.get("/new-technician", authMiddleware, isAdmin, newTechnician)
router.post("/new-technician/save", authMiddleware, isAdmin, saveTechnician)
router.get("/view-technician/:id", authMiddleware, isAdmin, viewTechnician)
router.get("/update-technician/:id", authMiddleware, isAdmin, updateTechnician)
router.put("/save-technician/:id", authMiddleware, isAdmin, saveTechnician)
router.delete("/delete-technician/:id", authMiddleware, isAdmin, deleteTechnician)





// ########################## //
// ##       EMPRESAS       ## //
// ########################## //

router.get("/all-companies", authMiddleware, allCompanies)
router.get("/new-company", authMiddleware, isAdmin, newCompany)
router.post("/new-company/save", authMiddleware, isAdmin, saveCompany)
router.get("/view-company/:id", authMiddleware, isAdmin, viewCompany)
router.get("/update-company/:id", authMiddleware, isAdmin, updateCompany)
router.put("/save-company/:id", authMiddleware, isAdmin, saveCompany)
router.delete("/delete-company/:id", authMiddleware, isAdmin, deleteCompany)





// ########################## //
// ##     FORNECEDORES     ## //
// ########################## //

router.get("/all-suppliers", authMiddleware, allSuppliers)
router.get("/new-supplier", authMiddleware, isAdmin, newSupplier)
router.post("/new-supplier/save", authMiddleware, isAdmin, saveSupplier)
router.get("/view-supplier/:id", authMiddleware, isAdmin, viewSupplier)
router.get("/update-supplier/:id", authMiddleware, isAdmin, updateSupplier)
router.put("/save-supplier/:id", authMiddleware, isAdmin, saveSupplier)
router.delete("/delete-supplier/:id", authMiddleware, isAdmin, deleteSupplier)




// ######################### //
// ##     FATURAMENTO     ## //
// ######################### //

router.get("/invoices", authMiddleware, invoices)





// ######################### //
// ##        CONTA        ## //
// ######################### //

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

router.get("/account", authMiddleware, account)
router.post("/account/update", authMiddleware, updateAccount)
router.post("/account/password", authMiddleware, newPassword)
router.post('/account/upload', authMiddleware, uploadPhoto.single('image'), function (req, res, next) {
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

module.exports = router