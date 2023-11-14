const asyncHandler = require('express-async-handler')

const Admin = require('../models/adminModel')
const Technician = require('../models/techinicianModel')
const Company = require('../models/companyModel')

const { generateToken } = require('../config/jwtToken')


const login = asyncHandler(async (req, res) => {
  res.render('layouts/auth/login')
})

const handleLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user
  let model

  if (user = await Admin.findOne({ email })) {
    model = Admin
  } else if (user = await Technician.findOne({ email })) {
    model = Technician
  } else if (user = await Company.findOne({ email })) {
    model = Company
  } else {
    return res.status(500).json({ error: "Credenciais inválidas" })
  }

  if (user.isBlocked) {
    return res.status(500).json({ error: "O usuário está bloqueado" })
  }

  if (user.password == password) {
    const refreshToken = generateToken(user._id);

    const updateUser = await model.findByIdAndUpdate(
      user._id,
      { refreshToken },
      { new: true }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      token: generateToken(user._id),
      roles: user.roles,
    });
  } else {
    return res.status(500).json({ error: "Credenciais inválidas" })
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  res.render('layouts/auth/forgot-password')
})

const sendToken = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body

    const findUser = await User.findOne({ email: email })

    if (!findUser) return res.status(500).json({ error: "Email inválido" })

    const token = await findUser.createPasswordResetToken()
    await findUser.save()

    const data = {
      name: findUser.name,
      email: findUser.email,
      token: token
    }

    await sendEmailTokenPassword(data)

    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
})

const validPasswordToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const findToken = await User.findOne({ passwordResetToken: hashedToken })

  if (findToken) {
    res.render('layouts/auth/reset-password', { token: token })
  } else {
    res.render('layouts/not-found')
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  if (password.length < 8) return res.status(500).json({ error: "A senha deve conter 8 caracteres ou mais" })

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const findToken = await User.findOne({ passwordResetToken: hashedToken })

  if (!findToken) return res.status(500).json({ error: "Token inválido ou expirado" })

  const passwordCrypt = await bcrypt.hash(password, 10);

  const resetPassword = await User.findOneAndUpdate(
    {
      passwordResetToken: hashedToken
    },
    {
      password: passwordCrypt,
      passwordResetToken: '',
      passwordResetExpires: '',
    },
    { new: true }
  );

  if (resetPassword) {
    res.sendStatus(200)
  } else {
    res.status(500).json({ error: "Não foi possível alterar a senha" })
  }
});

module.exports =
{
  login,
  forgotPassword,
  handleLogin,
  sendToken,
  validPasswordToken,
  resetPassword
}