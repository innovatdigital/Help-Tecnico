const asyncHandler = require('express-async-handler')
const Admin = require('../models/Admin')
const Report = require('../models/Report')
const Technician = require('../models/Technician')
const Company = require('../models/Company')
const Suppliers = require('../models/Suppliers')
const Calls = require('../models/Calls')
const path = require('path');
const fs = require('fs')
const { welcomeCompany } = require('../controllers/emailCtrl')


// ########################### //
// ##       DASHBOARD       ## //
// ########################### //

const dashboard = asyncHandler(async(req, res) => {
    const calls = await Calls.find({})

    for (const call of calls) {
        const findCompany = await Company.findById(call.id_company)

        if (findCompany) {
            call.name_company = findCompany.name
            call.logo_company = findCompany.photo
        } else {
            call.name_company = "Empresa excluida"
            call.logo_company = ""
        }
    }

    res.render('layouts/admin/dashboard', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, calls: calls.reverse()})
})





// ########################## //
// ##       CHAMADOS       ## //
// ########################## //

const allCalls = asyncHandler(async(req, res) => {
    const calls = await Calls.find({})

    for (const call of calls) {
        const findCompany = await Company.findById(call.id_company)

        if (findCompany) {
            call.name_company = findCompany.name
            call.logo_company = findCompany.photo
        } else {
            call.name_company = "Empresa excluida"
            call.logo_company = ""
        }
    }

    res.render('layouts/admin/all-calls', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, calls: calls.reverse()})
})

const viewCall = asyncHandler(async(req, res) => {
    const findCall = await Calls.findById(req.params.id)
    const findCompany = await Company.findById(findCall.id_company)
    const technicians = await Technician.find({})

    if (findCompany && findCall) {
        findCall.emailCompany = req.user.email
        findCall.phoneCompany = req.user.phoneCompany
        findCall.photoCompany = findCompany.photo
        
        res.render('layouts/admin/view-call', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, call: findCall, technicians: technicians})
    } else {
        res.render('layouts/notFound')
    }
})

const designateCall = asyncHandler(async(req, res) => {
    const findCall = await Calls.findById(req.query.id_call)

    if (findCall) {
        const designate = await Technician.findByIdAndUpdate(req.query.id_technician, {
            $push: {
                calls: {
                    id: findCall._id
                }
            }
        })

        if (designate) {
            const dateHour = new Date();

            const hour = dateHour.getHours();
            const minutes = dateHour.getMinutes();

            const updateTimeline = await Calls.findByIdAndUpdate(req.query.id_call, {
                $push: {
                    timeline: {
                        text: `Técnico ${designate.name} será responsável pelo chamado`,
                        hour: `${hour}:${minutes}`,
                        type: "technician"
                    }
                }
            })

            if (updateTimeline) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        } else {
            res.sendStatus(500)
        }
    } else {
        res.sendStatus(500)
    }
})

const cancelCall = asyncHandler(async(req, res) => {
    const cancelCall = await Calls.findByIdAndDelete(req.params.id)

    if (cancelCall) {
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
})





// ########################## //
// ##       ARQUIVOS       ## //
// ########################## //

const fileManager = asyncHandler(async(req, res) => {
    fs.readdir(path.resolve(__dirname, "../public/file-manager/"), (err, files) => {
        if (err) {
          console.error('Erro ao ler diretório:', err);
          return;
        }
    
        const folders = files.filter(file => {
          const filePath = path.join(path.resolve(__dirname, "../public/file-manager/"), file);
          return fs.statSync(filePath).isDirectory();
        });

        res.render('layouts/admin/file-manager', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, archives: [], folders: folders})
    });
})

const createFolder = asyncHandler(async(req, res) => {
    fs.mkdir(path.resolve(__dirname, `../public/file-manager/${req.body.name_folder}`), (err) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200)
        }
    });
})

const uploadArchive = asyncHandler(async(req, res) => {
    const nomePasta = req.body.name_path;
    const arquivoEnviado = req.file;

    const pastaPath = path.join(__dirname, `../public/file-manager/${nomePasta}`);
    if (!fs.existsSync(pastaPath)) {
        fs.mkdirSync(pastaPath);
    }

    const destino = path.join(pastaPath, arquivoEnviado.originalname);
    fs.renameSync(arquivoEnviado.path, destino);

    res.sendStatus(200)
})




// ########################## //
// ##      RELATÓRIOS      ## //
// ########################## //

const allReports = asyncHandler(async(req, res) => {
    const reports = [{
        _id: "6501f97cd7c07a0535820364",
        title: "Relatório de conclusão de serviço",
        imageCompany: "28730ff9-70c4-4270-898f-903dda65c5be-1694625282204-934505504.png",
        nameCompany: "Innovat Digital",
        type: "Conclusão de serviço",
        status: "Pendente",
        createdAt: "16/02/2023"
    }]

    res.render('layouts/admin/all-reports', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, reports: reports})
})

const viewReport = asyncHandler(async(req, res) => {
    res.render('layouts/admin/view-report', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})





// ########################## //
// ##      ORÇAMENTOS      ## //
// ########################## //

const budgets = asyncHandler(async(req, res) => {
    const budgets = [{
        _id: "6501f97cd7c07a0535820364",
        title: "Orçamento de serviço",
        imageCompany: "28730ff9-70c4-4270-898f-903dda65c5be-1694625282204-934505504.png",
        nameCompany: "Innovat Digital",
        type: "Corretivo",
        status: "Pendente",
        createdAt: "16/02/2023"
    }]

    res.render('layouts/admin/all-budgets', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, budgets: budgets})
})

const viewBudget = asyncHandler(async(req, res) => {
    res.render('layouts/admin/view-budget', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})





// ########################## //
// ##     EQUIPAMENTOS     ## //
// ########################## //

const allEquipments = asyncHandler(async(req, res) => {
    const equipments = [{
        _id: "6501f97cd7c07a0535820364",
        image: "https://s.zst.com.br/cms-assets/2021/10/cuidados-com-o-ar-condicionado.jpg",
        model: "Ar condicionado Split",
        imageCompany: "28730ff9-70c4-4270-898f-903dda65c5be-1694625282204-934505504.png",
        nameCompany: "Innovat Digital",
        status: "Funcionando corretamente",
        maintances: 2,
        createdAt: "16/02/2023"
    }]

    res.render('layouts/admin/all-equipments', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, equipments: equipments})
})




// ########################## //
// ##    ADMINISTRADORES   ## //
// ########################## //

const administrators = asyncHandler(async(req, res) => {
    const findAdmins = await Admin.find({})

    res.render('layouts/admin/administrators', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, administrators: findAdmins})
})

const newAdmin = asyncHandler(async(req, res) => {
    res.render('layouts/admin/newAdmin', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name })
})

const saveAdmin = asyncHandler(async(req, res) => {
    try {
        const createAdmin = await Admin.create(req.body)

        if (createAdmin) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})





// ########################### //
// ##   USUÁRIOS DE TESTE   ## //
// ########################### //

const testUsers = asyncHandler(async(req, res) => {
    res.render('layouts/admin/test-users', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name})
})

const newTester = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render('layouts/admin/newTester', { isAdmin: true, notifications: find.notifications.reverse(), photo: find.photo, name_user: find.name })
})





// ########################## //
// ##       TÉCNICOS       ## //
// ########################## //

const technicians = asyncHandler(async(req, res) => {
    const findTechnicians = await Technician.find({})

    res.render('layouts/admin/technicians', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, technicians: findTechnicians})
})

const viewTechnician = asyncHandler(async(req, res) => {
    const findTechnician = await Technician.findById(req.params.id)

    if (findTechnician) {
        let callsTechnician = await Calls.find({id_technician: req.params.id})
        
        res.render('layouts/admin/view-technician', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, technician: findTechnician, calls: callsTechnician})
    } else {
        res.render('layouts/notFound')
    }
})

const newTechnician = asyncHandler(async(req, res) => {
    res.render('layouts/admin/newTechnician', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name })
})

const saveTechnician = asyncHandler(async(req, res) => {
    try {
        if (req.params.id == undefined) {
            const createTechnician = await Technician.create(req.body)

            if (createTechnician) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        } else {
            const updateTechnician = await Technician.findByIdAndUpdate(req.params.id, req.body)

            if (updateTechnician) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const updateTechnician = asyncHandler(async(req, res) => {
    const findTechnician = await Technician.findById(req.params.id)

    if (findTechnician) {
        res.render('layouts/admin/editTechnician', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, technician: findTechnician })
    } else {
        res.render('layouts/notFound')
    }
})

const deleteTechnician = asyncHandler(async(req, res) => {
    try {
        const deleteTechnician = await Technician.findByIdAndDelete(req.params.id)

        if (deleteTechnician) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})





// ########################## //
// ##       EMPRESAS       ## //
// ########################## //

const allCompanies = asyncHandler(async(req, res) => {
    const companies = await Company.find({})

    res.render('layouts/admin/all-companies', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, companies: companies.reverse()})
})

const newCompany = asyncHandler(async(req, res) => {
    const technicians = await Technician.find({}).select("name")

    res.render('layouts/admin/newCompany', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, technicians: technicians })
})

const saveCompany = asyncHandler(async(req, res) => {
    try {
        if (req.params.id === undefined) {
            const createCompany = await Company.create(req.body)
            
            const updateTechnician = await Technician.findByIdAndUpdate(req.body.technician, {
                $push: {
                    responsibleCompanies: createCompany._id
                }
            })

            if (createCompany) {
                await welcomeCompany({name: req.body.name, email: req.body.email, password: req.body.password})

                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        } else {
            const updateCompany = await Company.findByIdAndUpdate(req.params.id, req.body)

            if (updateCompany) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const viewCompany = asyncHandler(async(req, res) => {
    const findCompany = await Company.findById(req.params.id)

    if (findCompany) {
        const callsCompany = await Calls.find({id_company: req.params.id})

        res.render('layouts/admin/viewCompany', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, company: findCompany, calls: callsCompany })
    } else {
        res.render('layouts/404')
    }
})

const updateCompany = asyncHandler(async(req, res) => {
    const findCompany = await Company.findById(req.params.id)
    const technicians = await Technician.find({}).select("name")

    if (findCompany) {
        res.render('layouts/admin/editCompany', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, company: findCompany, technicians: technicians })
    } else {
        res.render('layouts/404')
    }
})

const deleteCompany = asyncHandler(async(req, res) => {
    try {
        const deleteCompany = await Company.findByIdAndDelete(req.params.id)

        if (deleteCompany) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})





// ########################## //
// ##     FORNECEDORES     ## //
// ########################## //

const allSuppliers = asyncHandler(async(req, res) => {
    const suppliers = await Suppliers.find({})

    res.render('layouts/admin/all-suppliers', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, suppliers: suppliers.reverse()})
})

const newSupplier = asyncHandler(async(req, res) => {
    res.render('layouts/admin/newSupplier', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name })
})

const saveSupplier = asyncHandler(async(req, res) => {
    try {
        if (req.params.id === undefined) {
            const createSupplier = await Suppliers.create(req.body)

            if (createSupplier) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        } else {
            const updateSupplier = await Suppliers.findByIdAndUpdate(req.params.id, req.body)

            if (updateSupplier) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const viewSupplier = asyncHandler(async(req, res) => {
    const findSupplier = await Suppliers.findById(req.params.id)

    if (findSupplier) {
        res.render('layouts/admin/viewSupplier', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, supplier: findSupplier })
    } else {
        res.render('layouts/notFound')
    }
})

const updateSupplier = asyncHandler(async(req, res) => {
    const findSupplier = await Suppliers.findById(req.params.id)

    if (findSupplier) {
        res.render('layouts/admin/editSupplier', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, supplier: findSupplier })
    } else {
        res.render('layouts/notFound')
    }
})

const deleteSupplier = asyncHandler(async(req, res) => {
    try {
        const deleteSupplier = await Suppliers.findByIdAndDelete(req.params.id)

        if (deleteSupplier) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})





// ######################### //
// ##     FATURAMENTO     ## //
// ######################### //

const invoices = asyncHandler(async(req, res) => {
    res.render('layouts/admin/invoices', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name})
})





// ######################### //
// ##        CONTA        ## //
// ######################### //

const account = asyncHandler(async(req, res) => {
    const find = await Admin.findById(req.user._id)

    res.render('layouts/admin/configurations', {isAdmin: find.isAdmin, user: find, notifications: find.notifications.reverse(), photo: find.photo, name_user: find.name})
})

const updateAccount = asyncHandler(async(req, res) => {
    try {
        const update = await Admin.findByIdAndUpdate(req.cookies._id, {name: req?.body?.name, phone: req?.body?.phone, email: req?.body?.email})

        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})

const newPassword = asyncHandler(async(req, res) => {
    try {
        const user = await Admin.findById(req.cookies._id)

        if (req.body.currentPassword === user.password && req.body.newPassword === req.body.confirmPassword) {
            const updatePassword = await Admin.findByIdAndUpdate(req.cookies._id, {
                password: req.body.newPassword
            })

            if (updatePassword) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = {
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
    viewTechnician,
    newTechnician,
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
}