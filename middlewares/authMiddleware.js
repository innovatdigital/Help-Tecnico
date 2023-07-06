const Admin = require('../models/Admin')
const Technician = require('../models/Technician')
const Company = require('../models/Company')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const expressJwtPermissions = require('express-jwt-permissions')

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token

  if (req?.cookies?.token) {
    token = req.cookies.token
    
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id)
        if (admin) {
          req.user = admin
          next()
        } else {
          const company = await Company.findById(decoded.id)
          if (company) {
            req.user = company
            next()
          } else {
            const technician = await Technician.findById(decoded.id)
            if (technician) {
              req.user = technician
              next()
            } else {
              throw new Error('Usuário não encontrado')
            }
          }
        }
      }
    } catch (error) {
      throw new Error('Token expirado / Usuário não autorizado. Faça o login novamente.')
    }
  } else {
    throw new Error('Não há token anexado ao cabeçalho')
  }
})

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user

  const admin = await Admin.findOne({ email })

  if (admin.roles.includes("ADMIN")) {
    next()
  } else {
    throw new Error('Você não possui permissões.')
  }
})

const isTechnician = asyncHandler(async (req, res, next) => {
  const { email } = req.user

  const technician = await Technician.findOne({ email })

  if (technician.roles.includes("TECHNICIAN")) {
    next()
  } else {
    throw new Error('Você não possui permissões.')
  }
})

const isCompany = asyncHandler(async (req, res, next) => {
  const { email } = req.user

  const company = await Company.findOne({ email })

  if (company.roles.includes("COMPANY")) {
    next()
  } else {
    throw new Error('Você não possui permissões.')
  }
})

module.exports = {
  authMiddleware,
  isAdmin,
  isCompany,
  isTechnician
}
