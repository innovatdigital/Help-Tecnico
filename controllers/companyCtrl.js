const asyncHandler = require('express-async-handler')
const Admin = require('../models/adminModel')
const Technician = require('../models/techinicianModel')
const Company = require('../models/companyModel')
const Suppliers = require('../models/supplierModel')
const Calls = require('../models/callModel')
const Equipments = require('../models/equipmentModel')
const moment = require('moment')


// ########################### //
// ##       DASHBOARD       ## //
// ########################### //

const dashboard = asyncHandler(async(req, res) => {
    const calls = await Calls.find({
        idCompany: req.user._id,
        createdAt: {
          $gte: moment().startOf('month').toDate(),
          $lte: moment().endOf('month').toDate()
        }
    });
    const countEquipments = await Equipments.find({idCompany: req.user._id}).count()

    for (const call of calls) {
        if (call.status != "pending" && call.idTechnician.length > 0) {
            const findTechnician = await Technician.findById(call.idTechnician)

            if (findTechnician) {
                call.nameTechnician = findTechnician.name
                call.photoTechnician = findTechnician.photo
            }
        } else {
            call.photoTechnician = ''
        }
    }

    res.render('layouts/company/dashboard', {user: req.user, service: req.user.service, calls: calls.reverse(), countEquipments: countEquipments})
})





// ########################## //
// ##       CHAMADOS       ## //
// ########################## //

const calls = asyncHandler(async(req, res) => {
    const calls = await Calls.find({idCompany: req.user._id})

    for (const call of calls) {
        if (call.status != "pending" && call.idTechnician.length > 0) {
            const findTechnician = await Technician.findById(call.idTechnician)

            if (findTechnician) {
                call.nameTechnician = findTechnician.name
                call.photoTechnician = findTechnician.photo
            }
        } else {
            call.photoTechnician = ''
        }
    }

    res.render('layouts/company/calls', {user: req.user, service: req.user.service, calls: calls.reverse()})
})

const newCall = asyncHandler(async(req, res) => {
    const equipments = await Equipments.find({idCompany: req.user._id})

    for (const equipment of equipments) {
        const dateCreatedAt = moment.utc(equipment.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");
    
        equipment.createdAtFormatted = createdAtFormatted
    }

    res.render('layouts/company/new-call', {user: req.user, service: req.user.service, equipments: equipments})
})

const viewCall = asyncHandler(async(req, res) => {
    const call = await Calls.findById(req.params.id)
    const equipments = []
    
    for (const equipment of call.equipments) {
        const findEquipment = await Equipments.findById(equipment)

        equipments.push(findEquipment)
    }

    call.emailCompany = req.user.email
    call.phoneCompany = req.user.phoneCompany
    call.avatarCompany = req.user.avatar

    res.render('layouts/company/view-call', {user: req.user, service: req.user.service, call: call, equipments: equipments})
})

const saveCall = asyncHandler(async(req, res) => {
    try {
        const { description, photos, equipments } = req.body

        const date = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(date);

        const dateHour = new Date();

        const hour = dateHour.getHours();
        const minutes = dateHour.getMinutes();

        const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);

        const saveCallInDb = await Calls.create({description: description, idCompany: req.user._id, idTechnician: '', photos: photos, equipments: equipments, code: code, date: dataFormat, status: "pending", sla: "0", timeline: [{text: `Chamado aberto por ${req.user.name}`, hour: `${hour}:${minutes}`, type: "company"}]})
        
        const saveCallInCompany = await Company.findByIdAndUpdate(
            { _id: req.user._id },
            {
                $push: {
                    calls: {
                        id: saveCallInDb._id
                    }
                }
            }
        );

        if (saveCallInCompany) {
            res.status(200).json({ _id: saveCallInCompany._id })
        } else {
            res.status(500).json({ error: "Tente novamente mais tarde" })
        }
    } catch (err) {
        res.status(500).json({ error: "Erro interno no servidor" })
        console.log(err)
    }
})

const cancelCall = asyncHandler(async(req, res) => {
    const cancelCall = await Calls.findByIdAndUpdate(req.params.id, {cancellation_message: req.body.cancellation_message, status: "canceled"})

    if (cancelCall) {
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
})





// ########################## //
// ##         PMOC         ## //
// ########################## //

const viewPmoc = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-pmoc', {user: req.user, service: req.user.service})
})





// ################################# //
// ##    LISTA DE EQUIPAMENTOS    ## //
// ################################# //

const viewEquipmentList = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-equipment-list', {user: req.user, service: req.user.service})
})





// ########################## //
// ##     EQUIPAMENTOS     ## //
// ########################## //

const equipments = asyncHandler(async(req, res) => {
    const equipments = await Equipments.find({idCompany: req.user._id})
    
    for (const equipment of equipments) {
        const dateCreatedAt = moment.utc(equipment.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");
    
        equipment.createdAtFormatted = createdAtFormatted
    }

    res.render('layouts/company/equipments', {user: req.user, service: req.user.service, equipments: equipments})
})

const viewEquipment = asyncHandler(async(req, res) => {
    const equipment = await Equipments.findById(req.params.id)

    res.render('layouts/company/view-equipment', {user: req.user, service: req.user.service, equipment: equipment})
})





// ########################## //
// ##      RELATÓRIOS      ## //
// ########################## //

const reports = asyncHandler(async(req, res) => {
    res.render('layouts/company/reports', {user: req.user, service: req.user.service})
})

const viewReport = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-report', {user: req.user, service: req.user.service})
})





// ########################## //
// ##      ORÇAMENTOS      ## //
// ########################## //

const budgets = asyncHandler(async(req, res) => {
    res.render('layouts/company/budgets', {user: req.user, service: req.user.service})
})

const viewBudget = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-budget', {user: req.user, service: req.user.service})
})





// ######################### //
// ##        CONTA        ## //
// ######################### //

const settings = asyncHandler(async(req, res) => {
    res.render('layouts/company/settings', {user: req.user, service: req.user.service})
})

const updateAccount = asyncHandler(async (req, res) => {
  try {
    const updateAccount = await User.findByIdAndUpdate(req.user._id, {
      name: req?.body?.name,
      cpf: req?.body?.cpf,
      email: req?.body?.email
    })

    if (updateAccount) {
      res.sendStatus(200)
    } else {
      res.status(500).json({ error: "Não foi possível atualizar suas informações" })
    }
  } catch (err) {
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
    updatePassword
}