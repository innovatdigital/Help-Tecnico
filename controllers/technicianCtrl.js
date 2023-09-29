const asyncHandler = require('express-async-handler')
const Admin = require('../models/Admin')
const Technician = require('../models/Technician')
const Company = require('../models/Company')
const Suppliers = require('../models/Suppliers')
const Calls = require('../models/Calls')
const Equipments = require('../models/Equipments')
const moment = require('moment')


// ########################## //
// ##       CHAMADOS       ## //
// ########################## //

const calls = asyncHandler(async (req, res) => {
    const calls = []

    for (const company of req.user.responsibleCompanies) {
        const foundCalls = await Calls.find({ id_company: company })

        for (const call of foundCalls) {
            const findCompany = await Company.findById(call.id_company)

            if (findCompany) {
                call.name_company = findCompany.name
                call.logo_company = findCompany.photo
            } else {
                call.name_company = "Empresa excluida"
                call.logo_company = ""
            }
        }

        calls.push(...foundCalls)
    }

    res.render('layouts/technician/calls', { notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, calls: calls.reverse() })
})

const viewCall = asyncHandler(async (req, res) => {
    const call = await Calls.findById(req.params.id)
    const findCompany = await Company.findById(call.id_company)

    const equipments = []
    
    for (const equipment of call.equipments) {
        const findEquipment = await Equipments.findById(equipment)

        equipments.push(findEquipment)
    }

    call.emailCompany = findCompany.email
    call.phoneCompany = findCompany.phoneCompany
    call.photoCompany = findCompany.photo

    res.render('layouts/technician/view-call', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, call: call, equipments: equipments })
})

const initiateCall = asyncHandler(async (req, res) => {
    const dateHour = new Date();

    const hour = dateHour.getHours();
    const minutes = dateHour.getMinutes();

    const updateTimeline = await Calls.findByIdAndUpdate(req.params.id, {
        status: "in-attendance",
        id_technician: req.user._id,

        $push: {
            timeline: {
                text: `Técnico ${req.user.name} será responsável pelo chamado`,
                hour: `${hour}:${minutes}`,
                type: "technician"
            }
        }
    })

    if (updateTimeline) res.sendStatus(200)
})

const insertCode = asyncHandler(async (req, res) => {
    const findCall = await Calls.findById(req.params.id)

    if (findCall) {
        if (findCall.code == parseInt(req.body.code)) {
            const dateHour = new Date();

            const hour = dateHour.getHours();
            const minutes = dateHour.getMinutes();
        
            const updateTimeline = await Calls.findByIdAndUpdate(req.params.id, {
                start_time: `${hour}:${minutes}`,
                confirmed_code: true,
        
                $push: {
                    timeline: {
                        $each: [
                            {
                                text: `Código validado com sucesso`,
                                hour: `${hour}:${minutes}`,
                                type: "valid-code"
                            },
                            {
                                text: `Contagem do SLA inicializada`,
                                hour: `${hour}:${minutes}`,
                                type: "sla-started"
                            }
                        ]
                    }
                }
            })
        
            if (updateTimeline) res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }
})

const completeCall = asyncHandler(async (req, res) => {
    const findCall = await Calls.findById(req.params.id);

    if (findCall) {
        const dateHour = new Date();

        const hour = dateHour.getHours();
        const minutes = dateHour.getMinutes();

        const [startHour, startMinutes] = findCall.start_time.split(":").map(Number);
        const startTimeInMinutes = startHour * 60 + startMinutes;

        const currentTimeInMinutes = hour * 60 + minutes;

        const slaInMinutes = currentTimeInMinutes - startTimeInMinutes;
        const slaHours = Math.floor(slaInMinutes / 60);
        const slaMinutes = slaInMinutes % 60;
        const sla = `${slaHours}:${slaMinutes.toString().padStart(2, '0')}`;

        const updateTimeline = await Calls.findByIdAndUpdate(req.params.id, {
            end_time: `${hour}:${minutes}`,
            sla: sla,
            status: "concluded",
    
            $push: {
                timeline: {
                    $each: [
                        {
                            text: `Concluído o atendimento pelo técnico - Contagem do SLA finalizada: ${sla}`,
                            hour: `${hour}:${minutes}`,
                            type: "sla-finished"
                        }
                    ]
                }
            }
        });
    
        if (updateTimeline) res.sendStatus(200);
    }
});



// ########################## //
// ##      RELATÓRIOS      ## //
// ########################## //

const reports = asyncHandler(async (req, res) => {
    const reports = [{
        _id: "6501f97cd7c07a0535820364",
        title: "Relatório de conclusão de serviço",
        imageCompany: "28730ff9-70c4-4270-898f-903dda65c5be-1694625282204-934505504.png",
        nameCompany: "Innovat Digital",
        type: "Conclusão de serviço",
        status: "Pendente",
        createdAt: "16/02/2023"
    }]

    res.render('layouts/technician/reports', { isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, reports: reports })
})

const viewReport = asyncHandler(async (req, res) => {
    res.render('layouts/technician/view-report', { notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
})





// ######################## //
// ##    EQUIPAMENTOS    ## //
// ######################## //

const equipments = asyncHandler(async(req, res) => {
    const equipments = await Equipments.find({
        idCompany: { $in: req.user.responsibleCompanies }
    });

    for (const equipment of equipments) {
        const findCompany = await Company.findById(equipment.idCompany).select("name photo")

        equipment.nameCompany = findCompany.name
        equipment.photoCompany = findCompany.photo

        const dateCreatedAt = moment.utc(equipment.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");
    
        equipment.createdAtFormatted = createdAtFormatted
    }

    res.render('layouts/technician/equipments', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, equipments: equipments})
})


const newEquipment = asyncHandler(async (req, res) => {
    const companies = await Company.find({technician: req.user._id})

    res.render('layouts/technician/register-equipment', { notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, companies: companies })
})

const viewEquipment = asyncHandler(async (req, res) => {
    const equipment = await Equipments.findById(req.params.id)
    const company = await Company.findById(equipment.idCompany).select("name photo")

    if (equipment && company) {
        res.render('layouts/technician/view-equipment', { notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, equipment: equipment, company: company })
    } else {
        res.render('layouts/notFound')
    }
})

const saveEquipment = asyncHandler(async (req, res) => {
    try {
        const createEquipment = await Equipments.create(req.body)

        if (createEquipment) {
            const insertEquipmentCompany = await Company.findByIdAndUpdate(req.body.idCompany, {
                $push: {
                    equipments: {
                        id: createEquipment._id,
                    }
                }
            })
    
            if (insertEquipmentCompany) {
                res.status(200).json({ id: createEquipment._id })
            } else {
                res.sendStatus(500)
            }
        }
    } catch (err) {
        res.sendStatus(500)
    }
})





// ########################## //
// ##       EMPRESAS       ## //
// ########################## //

const companies = asyncHandler(async(req, res) => {
    const companies = await Company.find({technician: req.user._id})

    res.render('layouts/technician/companies', {isAdmin: false, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, companies: companies})
})

const viewCompany = asyncHandler(async(req, res) => {
    const findCompany = await Company.findById(req.params.id)
    const equipments = await Equipments.find({idCompany: req.params.id})

    if (findCompany) {
        const callsCompany = await Calls.find({id_company: req.params.id})

        res.render('layouts/technician/view-company', { isAdmin: false, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, company: findCompany, calls: callsCompany.reverse(), equipments: equipments })
    } else {
        res.render('layouts/404')
    }
})





// ######################### //
// ##       QR CODE       ## //
// ######################### //

const scanQrCode = asyncHandler(async (req, res) => {
    res.render('layouts/technician/scan-qr-code', { notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
})





// ######################### //
// ##        CONTA        ## //
// ######################### //

const account = asyncHandler(async (req, res) => {
    res.render('layouts/technician/account', { user: req.user, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
})

const updateAccount = asyncHandler(async (req, res) => {
    try {
        const update = await Technician.findByIdAndUpdate(req.user._id, req.body)

        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})

const newPassword = asyncHandler(async (req, res) => {
    try {
        const technician = await Technician.findById(req.cookies._id)

        if (req.body.currentPassword === user.password && req.body.newPassword === req.body.confirmPassword) {
            const updatePassword = await Company.findByIdAndUpdate(req.cookies._id, {
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
    calls,
    viewCall,
    initiateCall,
    insertCode,
    completeCall,

    reports,
    viewReport,

    scanQrCode,

    equipments,
    newEquipment,
    viewEquipment,
    saveEquipment,

    companies,
    viewCompany,

    account,
    updateAccount,
    newPassword
}