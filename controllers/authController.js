const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')
const jwt = require('jsonwebtoken')
const { sendPasswordResetEmail, sendPasswordResetedEmail } = require('./email')

const register = async (req, res) => {
  const { email, name, password } = req.body

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  const user = await User.create({
    name,
    email,
    password,
    role,
  })
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const passwordReset = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.BadRequestError('User not found.')
  }
  var tokenObject = {
    email: user.email,
    id: user._id,
  }
  var secret = user._id + '_' + user.email + '_' + new Date().getTime()
  var token = jwt.sign(tokenObject, secret)
  //find by id and update reset_password_token: token, reset_password_expires: Date.now() + 86400000
  await User.findByIdAndUpdate(
    { _id: user._id },
    {
      reset_password_token: token,
      reset_password_expires: Date.now() + 86400000,
    },
    { new: true }
  )
  const url = 'http://localhost:3000/user/reset-password/' + token
  try {
    sendPasswordResetEmail(user.email, user.name, url, 'Password reset')
    res.status(StatusCodes.OK).json({ user: token })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.msg })
  }
}
const resetPassword = async (req, res) => {
  console.log(req.body)

  User.findOne({
    reset_password_token: req.body.token,
    reset_password_expires: {
      $gt: Date.now(),
    },
  }).exec(function (err, user) {
    if (!err && user) {
      user.password = req.body.password
      user.reset_password_token = ''
      user.reset_password_expires = ''
      user.save(function (err) {
        if (err) {
          console.log(err)
          return res.status(422).send({
            message: err,
          })
        } else {
          sendPasswordResetedEmail(
            user.email,
            user.name,
            'Password successfully reset'
          )
          res.status(StatusCodes.OK).json({ message: 'Password reset' })
        }
      })
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Password reset token is invalid or has expired.',
      })
    }
  })
}
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({ user: tokenUser })
}
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

module.exports = {
  register,
  login,
  logout,
  passwordReset,
  resetPassword,
}
