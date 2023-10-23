const asyncHandler = require('express-async-handler')

const Admin = require('../models/Admin')
const Technician = require('../models/Technician')
const Company = require('../models/Company')

const Promise = require('bluebird');
const { generateToken } = require('../config/jwtToken')
const { generateRefreshToken } = require('../config/refreshtoken')

const page = asyncHandler(async (req, res) => {
  res.render('layouts/auth/login')
})

const handleLogin = async (req, res, User) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Credenciais inválidas, tente novamente.');
  }

  if (user.isBlocked) {
    throw new Error('Não foi possível fazer login, o usuário está bloqueado.');
  }

  if (!(user.password == password)) {
    await User.findByIdAndUpdate(user.id, { $inc: { loginAttempts: 1 } });

    const updatedUser = await User.findById(user.id);

    if (updatedUser.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      await User.findByIdAndUpdate(user.id, { isBlocked: true });
      throw new Error('Não foi possível fazer login, o usuário está bloqueado.');
    }

    throw new Error('Credenciais inválidas, tente novamente.');
  }

  const refreshToken = await generateRefreshToken(user?.id);
  const updateUser = await User.findByIdAndUpdate(
    user.id,
    { refreshToken },
    { new: true }
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });

  res.json({
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    token: generateToken(user?._id),
    roles: user.roles,
  });
};

const login = asyncHandler(async (req, res) => {
  const adminPromise = handleLogin(req, res, Admin).catch(() => { });
  const companyPromise = handleLogin(req, res, Company).catch(() => { });
  const technicianPromise = handleLogin(req, res, Technician).catch(() => { });

  try {
    await Promise.any([adminPromise, companyPromise, technicianPromise]);
  } catch (error) {
    res.status(500).json({ error: 'Credenciais inválidas' });
  }
});

module.exports =
{
  page,
  login
}