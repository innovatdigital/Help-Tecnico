const express = require('express')
const router = express.Router()
const multer  = require('multer');
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const Admin = require('../models/adminModel')

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
  viewEquipment,

  administrators,
  newAdmin,
  saveAdmin,
  updateAdmin,
  deleteAdmin,

  testUsers,

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

  settings,
  updateAccount,
  updatePassword
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

const upload = multer({ dest: path.resolve(__dirname, "../public/file-manager/") });

router.get("/file-manager", authMiddleware, fileManager)
router.post("/file-manager/create-folder", authMiddleware, createFolder)
router.post("/file-manager/upload-archive", authMiddleware, upload.single('arquivo'), uploadArchive)





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
router.get("/view-equipment/:id", authMiddleware, viewEquipment)





// ########################## //
// ##    ADMINISTRADORES   ## //
// ########################## //

router.get("/administrators", authMiddleware, administrators)
router.get("/new-admin", authMiddleware, isAdmin, newAdmin)
router.post("/new-admin/save", authMiddleware, isAdmin, saveAdmin)
router.get("/update-admin/:id", authMiddleware, isAdmin, updateAdmin)
router.put("/update-admin/save/:id", authMiddleware, isAdmin, saveAdmin)
router.delete("/delete-admin/:id", authMiddleware, isAdmin, deleteAdmin)





// ########################### //
// ##   USUÁRIOS DE TESTE   ## //
// ########################### //

router.get("/test-users", authMiddleware, testUsers)





// ########################## //
// ##       TÉCNICOS       ## //
// ########################## //

router.get("/technicians", authMiddleware, technicians)
router.get("/new-technician", authMiddleware, isAdmin, newTechnician)
router.post("/new-technician/save", authMiddleware, isAdmin, saveTechnician)
router.get("/view-technician/:id", authMiddleware, isAdmin, viewTechnician)
router.get("/update-technician/:id", authMiddleware, isAdmin, updateTechnician)
router.put("/update-technician/save/:id", authMiddleware, isAdmin, saveTechnician)
router.delete("/delete-technician/:id", authMiddleware, isAdmin, deleteTechnician)





// ########################## //
// ##       EMPRESAS       ## //
// ########################## //

router.get("/all-companies", authMiddleware, allCompanies)
router.get("/new-company", authMiddleware, isAdmin, newCompany)
router.post("/new-company/save", authMiddleware, isAdmin, saveCompany)
router.get("/view-company/:id", authMiddleware, isAdmin, viewCompany)
router.get("/update-company/:id", authMiddleware, isAdmin, updateCompany)
router.put("/update-company/save/:id", authMiddleware, isAdmin, saveCompany)
router.delete("/delete-company/:id", authMiddleware, isAdmin, deleteCompany)





// ########################## //
// ##     FORNECEDORES     ## //
// ########################## //

router.get("/all-suppliers", authMiddleware, allSuppliers)
router.get("/new-supplier", authMiddleware, isAdmin, newSupplier)
router.post("/new-supplier/save", authMiddleware, isAdmin, saveSupplier)
router.get("/view-supplier/:id", authMiddleware, isAdmin, viewSupplier)
router.get("/update-supplier/:id", authMiddleware, isAdmin, updateSupplier)
router.put("/update-supplier/save/:id", authMiddleware, isAdmin, saveSupplier)
router.delete("/delete-supplier/:id", authMiddleware, isAdmin, deleteSupplier)




// ######################### //
// ##     FATURAMENTO     ## //
// ######################### //

router.get("/invoices", authMiddleware, invoices)





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
    
    const updateAvatar = await Admin.findByIdAndUpdate(req.user._id, {
      avatar: newFilename
    })

    res.sendStatus(200)
  });
});

module.exports = router