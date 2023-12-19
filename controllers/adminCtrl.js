const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const path = require('path');
const moment = require('moment')
const fs = require('fs')
const { welcomeCompany } = require('../controllers/emailCtrl')

const Admin = require('../models/adminModel')
const Report = require('../models/reportModel')
const Technician = require('../models/techinicianModel')
const Company = require('../models/companyModel')
const Equipments = require('../models/equipmentModel')
const Suppliers = require('../models/supplierModel')
const Budgets = require('../models/budgetModel')
const Calls = require('../models/callModel')


// ########################### //
// ##       DASHBOARD       ## //
// ########################### //

const dashboard = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Month
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

    // Year
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const startOfNextYear = new Date(new Date().getFullYear() + 1, 0, 1);

    // Calls today
    const callsToday = await Calls.find({ createdAt: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } }).limit(10)

    // Calls today
    const callsYear = await Calls.countDocuments({ createdAt: { $gte: startOfYear, $lt: startOfNextYear } })

    const countCompanies = await Company.countDocuments()
    const countTechnicians = await Technician.countDocuments()
    const countEquipments = await Equipments.countDocuments()
    
    const countBudgets = await Budgets.find({
        createdAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
        }
    })

    for (const call of callsToday) {
        const findCompany = await Company.findById(call.idCompany)

        if (findCompany) {
            call.nameCompany = findCompany.name
            call.avatarCompany = findCompany.avatar
        } else {
            call.nameCompany = "Empresa excluída"
            call.avatarCompany = ""
        }

        if (call.status != "pending" && call.idTechnician.length > 0) {
            const findTechnician = await Technician.findById(call.idTechnician)

            if (findTechnician) {
                call.nameTechnician = findTechnician.name
                call.avatarTechnician = findTechnician.avatar
            }
        } else {
            call.avatarTechnician = ''
        }
    }

    res.render('layouts/admin/dashboard', { user: req.user, callsToday: callsToday.reverse(), callsYear: callsYear, countCompanies: countCompanies, countTechnicians: countTechnicians, countEquipments: countEquipments, countBudgets: countBudgets })
})





// ########################## //
// ##       CHAMADOS       ## //
// ########################## //

const allCalls = asyncHandler(async (req, res) => {
    const calls = await Calls.find({})

    for (const call of calls) {
        const findCompany = await Company.findById(call.idCompany)

        if (findCompany) {
            call.nameCompany = findCompany.name
            call.avatarCompany = findCompany.avatar
        } else {
            call.nameCompany = "Empresa excluída"
            call.avatarCompany = ""
        }

        if (call.status != "pending" && call.idTechnician.length > 0) {
            const findTechnician = await Technician.findById(call.idTechnician)

            if (findTechnician) {
                call.nameTechnician = findTechnician.name
                call.avatarTechnician = findTechnician.avatar
            }
        } else {
            call.avatarTechnician = ''
        }
    }

    res.render('layouts/admin/calls', { user: req.user, calls: calls.reverse() })
})

const viewCall = asyncHandler(async (req, res) => {
    const findCall = await Calls.findById(req.params.id)
    const findCompany = await Company.findById(findCall.idCompany)
    const technicians = await Technician.find({})
    const equipments = []

    for (const equipment of findCall.equipments) {
        const findEquipment = await Equipments.findById(equipment)

        equipments.push(findEquipment)
    }

    if (findCompany && findCall) {
        findCall.nameCompany = findCompany.name
        findCall.emailCompany = findCompany.email
        findCall.phoneCompany = findCompany.phoneCompany
        findCall.avatarCompany = findCompany.avatar

        res.render('layouts/admin/view-call', { user: req.user, call: findCall, technicians: technicians, equipments: equipments })
    } else {
        res.render('layouts/not-found')
    }
})

const designateCall = asyncHandler(async (req, res) => {
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

const cancelCall = asyncHandler(async (req, res) => {
    const cancelCall = await Calls.findByIdAndUpdate(req.params.id, { cancellationMessage: "Cancelado pelo administrador do sistema.", status: "canceled" })

    if (cancelCall) {
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
})





// ########################## //
// ##       ARQUIVOS       ## //
// ########################## //

const fileManager = asyncHandler(async (req, res) => {
    fs.readdir(path.resolve(__dirname, "../public/file-manager/"), (err, files) => {
        if (err) {
            console.error('Erro ao ler diretório:', err);
            return;
        }

        const folders = files.filter(file => {
            const filePath = path.join(path.resolve(__dirname, "../public/file-manager/"), file);
            return fs.statSync(filePath).isDirectory();
        });

        res.render('layouts/admin/file-manager', { user: req.user, archives: [], folders: folders })
    });
})

const createFolder = asyncHandler(async (req, res) => {
    fs.mkdir(path.resolve(__dirname, `../public/file-manager/${req.body.name_folder}`), (err) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200)
        }
    });
})

const uploadArchive = asyncHandler(async (req, res) => {
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

const allReports = asyncHandler(async (req, res) => {
    const reports = [{
        _id: "6501f97cd7c07a0535820364",
        title: "Relatório de conclusão de serviço",
        imageCompany: "28730ff9-70c4-4270-898f-903dda65c5be-1694625282204-934505504.png",
        nameCompany: "Innovat Digital",
        type: "Conclusão de serviço",
        status: "Pendente",
        createdAt: "16/02/2023"
    }]

    res.render('layouts/admin/reports', { user: req.user, reports: reports })
})

const viewReport = asyncHandler(async (req, res) => {
    res.render('layouts/admin/view-report', { user: req.user })
})





// ########################## //
// ##      ORÇAMENTOS      ## //
// ########################## //

const budgets = asyncHandler(async (req, res) => {
    const budgets = [{
        _id: "6501f97cd7c07a0535820364",
        title: "Orçamento de serviço",
        imageCompany: "28730ff9-70c4-4270-898f-903dda65c5be-1694625282204-934505504.png",
        nameCompany: "Innovat Digital",
        type: "Corretivo",
        status: "Pendente",
        createdAt: "16/02/2023"
    }]

    res.render('layouts/admin/budgets', { user: req.user, budgets: budgets })
})

const viewBudget = asyncHandler(async (req, res) => {
    res.render('layouts/admin/view-budget', { user: req.user })
})





// ########################## //
// ##     EQUIPAMENTOS     ## //
// ########################## //

const allEquipments = asyncHandler(async (req, res) => {
    const equipments = await Equipments.find({})

    for (const equipment of equipments) {
        const findCompany = await Company.findById(equipment.idCompany).select("name avatar")
        const callsWithEquipment = await Calls.find({ equipments: { $elemMatch: { $eq: equipment._id.toString() } } });

        const isInMaintenance = callsWithEquipment.some(call => call.status !== "concluded");

        equipment.status = isInMaintenance ? "maintenance" : "normal";

        if (findCompany) {
            equipment.nameCompany = findCompany.name
            equipment.avatarCompany = findCompany.avatar
        } else {
            equipment.nameCompany = "Empresa excluída"
            equipment.avatarCompany = ""
        }

        const dateCreatedAt = moment.utc(equipment.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");

        equipment.createdAtFormatted = createdAtFormatted
    }

    res.render('layouts/admin/equipments', { user: req.user, equipments: equipments })
})

const viewEquipment = asyncHandler(async (req, res) => {
    const findEquipment = await Equipments.findById(req.params.id)

    if (findEquipment) {
        const findCompany = await Company.findById(findEquipment.idCompany).select("name avatar")
        const callsWithEquipment = await Calls.find({ equipments: { $elemMatch: { $eq: findEquipment._id.toString() } } });

        const isInMaintenance = callsWithEquipment.some(call => call.status !== "concluded");

        findEquipment.status = isInMaintenance ? "maintenance" : "normal";

        for (const call of callsWithEquipment) {
            const findCompany = await Company.findById(call.idCompany)
    
            if (findCompany) {
                call.nameCompany = findCompany.name
                call.avatarCompany = findCompany.avatar
            } else {
                call.nameCompany = "Empresa excluída"
                call.avatarCompany = ""
            }
    
            if (call.status != "pending" && call.idTechnician.length > 0) {
                const findTechnician = await Technician.findById(call.idTechnician)
    
                if (findTechnician) {
                    call.nameTechnician = findTechnician.name
                    call.avatarTechnician = findTechnician.avatar
                } else {
                    call.nameTechnician = "Técnico excluído"
                    call.avatarTechnician = ""
                }
            } else {
                call.avatarTechnician = ''
            }
        }

        const dateCreatedAt = moment.utc(findEquipment.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");

        findEquipment.createdAtFormatted = createdAtFormatted

        res.render('layouts/admin/view-equipment', { user: req.user, equipment: findEquipment, company: findCompany, calls: callsWithEquipment })
    } else {
        res.render('layouts/not-found')
    }
})




// ########################## //
// ##    ADMINISTRADORES   ## //
// ########################## //

const administrators = asyncHandler(async (req, res) => {
    const findAdmins = await Admin.find({})

    for (const admin of findAdmins) {
        const dateCreatedAt = moment.utc(admin.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");

        admin.createdAtFormatted = createdAtFormatted
    }

    res.render('layouts/admin/administrators', { user: req.user, administrators: findAdmins })
})

const newAdmin = asyncHandler(async (req, res) => {
    res.render('layouts/admin/new-admin', { user: req.user })
})

const saveAdmin = asyncHandler(async (req, res) => {
    try {
        if (req.params.id == undefined) {
            const createAdmin = await Admin.create(req.body)

            if (createAdmin) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        } else {
            const updateAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body)

            if (updateAdmin) {
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

const updateAdmin = asyncHandler(async (req, res) => {
    const findAdmin = await Admin.findById(req.params.id)

    if (findAdmin) {
        res.render('layouts/admin/update-admin', { user: req.user, admin: findAdmin })
    } else {
        res.render('layouts/not-found')
    }
})

const deleteAdmin = asyncHandler(async (req, res) => {
    try {
        const deleteAdmin = await Admin.findByIdAndDelete(req.params.id)

        if (deleteAdmin) {
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

const testUsers = asyncHandler(async (req, res) => {
    res.render('layouts/admin/test-users', { user: req.user })
})





// ########################## //
// ##       TÉCNICOS       ## //
// ########################## //

const technicians = asyncHandler(async (req, res) => {
    const findTechnicians = await Technician.find({})

    for (const technician of findTechnicians) {
        const dateCreatedAt = moment.utc(technician.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");

        technician.createdAtFormatted = createdAtFormatted
    }

    res.render('layouts/admin/technicians', { user: req.user, technicians: findTechnicians })
})

const viewTechnician = asyncHandler(async (req, res) => {
    const findTechnician = await Technician.findById(req.params.id)

    if (findTechnician) {
        const callsTechnician = await Calls.find({ idTechnician: req.params.id })

        const dateCreatedAt = moment.utc(findTechnician.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");

        findTechnician.createdAtFormatted = createdAtFormatted

        res.render('layouts/admin/view-technician', { user: req.user, technician: findTechnician, calls: callsTechnician })
    } else {
        res.render('layouts/not-found')
    }
})

const newTechnician = asyncHandler(async (req, res) => {
    res.render('layouts/admin/new-technician', { user: req.user })
})

const saveTechnician = asyncHandler(async (req, res) => {
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

const updateTechnician = asyncHandler(async (req, res) => {
    const findTechnician = await Technician.findById(req.params.id)

    if (findTechnician) {
        res.render('layouts/admin/update-technician', { user: req.user, technician: findTechnician })
    } else {
        res.render('layouts/not-found')
    }
})

const deleteTechnician = asyncHandler(async (req, res) => {
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

const allCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find({})

    for (const company of companies) {
        const dateCreatedAt = moment.utc(company.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");

        company.createdAtFormatted = createdAtFormatted
    }

    res.render('layouts/admin/companies', { user: req.user, companies: companies.reverse() })
})

const newCompany = asyncHandler(async (req, res) => {
    const technicians = await Technician.find({}).select("avatar name")

    res.render('layouts/admin/new-company', { user: req.user, technicians: technicians })
})

const saveCompany = asyncHandler(async (req, res) => {
    try {
        if (req.params.id === undefined) {
            const createCompany = await Company.create(req.body)

            const updateTechnician = await Technician.findByIdAndUpdate(req.body.technician, {
                $push: {
                    responsibleCompanies: createCompany._id
                }
            })

            if (createCompany) {
                await welcomeCompany({ name: req.body.name, email: req.body.email, password: req.body.password })

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

const viewCompany = asyncHandler(async (req, res) => {
    const equipmentsCompany = await Equipments.find({ idCompany: req.params.id })
    const findCompany = await Company.findById(req.params.id)

    if (findCompany) {
        const callsCompany = await Calls.find({ idCompany: req.params.id })

        const dateCreatedAt = moment.utc(findCompany.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");

        findCompany.createdAtFormatted = createdAtFormatted

        res.render('layouts/admin/view-company', { user: req.user, company: findCompany, calls: callsCompany.reverse(), equipments: equipmentsCompany })
    } else {
        res.render('layouts/not-found')
    }
})

const updateCompany = asyncHandler(async (req, res) => {
    const findCompany = await Company.findById(req.params.id)
    const technicians = await Technician.find({}).select("avatar name")

    if (findCompany) {
        res.render('layouts/admin/update-company', { user: req.user, company: findCompany, technicians: technicians })
    } else {
        res.render('layouts/not-found')
    }
})

const deleteCompany = asyncHandler(async (req, res) => {
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

const allSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Suppliers.find({})

    for (const supplier of suppliers) {
        const dateCreatedAt = moment.utc(supplier.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");

        supplier.createdAtFormatted = createdAtFormatted
    }

    res.render('layouts/admin/suppliers', { user: req.user, suppliers: suppliers.reverse() })
})

const newSupplier = asyncHandler(async (req, res) => {
    res.render('layouts/admin/new-supplier', { user: req.user })
})

const saveSupplier = asyncHandler(async (req, res) => {
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

const viewSupplier = asyncHandler(async (req, res) => {
    const findSupplier = await Suppliers.findById(req.params.id)

    if (findSupplier) {
        const dateCreatedAt = moment.utc(findSupplier.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");

        findSupplier.createdAtFormatted = createdAtFormatted

        res.render('layouts/admin/view-supplier', { user: req.user, supplier: findSupplier })
    } else {
        res.render('layouts/not-found')
    }
})

const updateSupplier = asyncHandler(async (req, res) => {
    const findSupplier = await Suppliers.findById(req.params.id)

    if (findSupplier) {
        res.render('layouts/admin/update-supplier', { user: req.user, supplier: findSupplier })
    } else {
        res.render('layouts/not-found')
    }
})

const deleteSupplier = asyncHandler(async (req, res) => {
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

const invoices = asyncHandler(async (req, res) => {
    res.render('layouts/admin/invoices', { user: req.user })
})





// ######################### //
// ##        CONTA        ## //
// ######################### //

const settings = asyncHandler(async (req, res) => {
    res.render('layouts/admin/settings', { user: req.user })
})

const updateAccount = asyncHandler(async (req, res) => {
    try {
        let existsEmail = false

        if (req.body.email !== req.user.email) {
            const findEmailAdmin = await Admin.findOne({ email: req.body.email.trim() }).select("email")
            const findEmailCompany = await Company.findOne({ email: req.body.email.trim() }).select("email")

            if (findEmailAdmin || findEmailCompany) existsEmail = true
        }

        if (!existsEmail) {
            const updateUser = await Admin.findByIdAndUpdate(req.user._id, {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone
            })

            if (updateUser) {
                res.sendStatus(200)
            } else {
                res.status(500).json({ error: "Não foi possível salvar os dados" })
            }
        } else {
            res.status(500).json({ error: "Email existente" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro interno no servidor" })
    }
})

const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (newPassword != confirmPassword) return res.status(500).json({ error: "As senhas não conferem" })
    else {
        const findUser = await User.findById(req.user._id)

        if (await findUser.isPasswordMatched(currentPassword)) {
            const updateUser = await User.findByIdAndUpdate(req.user._id, {
                password: await bcrypt.hash(newPassword, 10)
            })

            if (updateUser) {
                res.sendStatus(200)
            } else {
                res.status(500).json({ error: "Não foi possível atualizar a senha" })
            }
        } else {
            res.status(500).json({ error: "Senha atual incorreta" })
        }
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
    viewEquipment,

    administrators,
    newAdmin,
    saveAdmin,
    updateAdmin,
    deleteAdmin,

    testUsers,

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

    settings,
    updateAccount,
    updatePassword
}