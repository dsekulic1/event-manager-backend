const asyncWrapper = require('../middleware/async')
require('dotenv').config()
const fs = require('fs')
var handlebars = require('handlebars')
var nodemailer = require('nodemailer')
const path = './templates/forgot-password-email.html'
const pathReseted = './templates/reset-password-email.html'
const confirmation = './templates/register-successful.html'
const SENDER_ADDRESS = process.env.SENDER_ADDRESS
const SENDER_PASS = process.env.SENDER_PASS
const mail = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: SENDER_ADDRESS,
    pass: SENDER_PASS,
  },
})

const sendEmail = asyncWrapper(async (req, res) => {
  var mail_content =
    'Poštovani,\n\n' +
    req.body.emailMessage +
    '\n\nLijep pozdrav,\nVaše obavijesti.'
  var mailOptions = {
    from: SENDER_ADDRESS,
    to: req.body.emailTo,
    subject: 'Obavijest',
    text: mail_content,
  }
  let response = ''
  try {
    response = mail.sendMail(mailOptions)

    return res.status(201).json({ response })
  } catch (error) {
    // console.log(error)
  }
  if (!response.ok) {
    return next(createCustomError(`Error : ${error}`, 500))
  }
  mail.close()
})

//templates\forgot-password-email.html
const sendPasswordResetEmail = async (emailTo, name, url, subject) => {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      //
      return err
      //console.log(err)
    } else {
      var template = handlebars.compile(html)
      var replacements = {
        name: name,
        url: url,
      }
      var htmlToSend = template(replacements)
      var mailOptions = {
        from: SENDER_ADDRESS,
        to: emailTo,
        subject: subject,
        html: htmlToSend,
      }

      try {
        mail.sendMail(mailOptions)
      } catch (error) {
        console.log(error)
      }
      mail.close()
    }
  })
}
const sendPasswordResetedEmail = async (emailTo, name, subject) => {
  fs.readFile(pathReseted, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      //
      return err
      //console.log(err)
    } else {
      var template = handlebars.compile(html)
      var replacements = {
        name: name,
      }
      var htmlToSend = template(replacements)
      var mailOptions = {
        from: SENDER_ADDRESS,
        to: emailTo,
        subject: subject,
        html: htmlToSend,
      }

      try {
        mail.sendMail(mailOptions)
      } catch (error) {
        console.log(error)
      }
      mail.close()
    }
  })
}
const sendConfirmationEmail = async (emailTo, name, subject) => {
  fs.readFile(confirmation, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      //
      return err
      //console.log(err)
    } else {
      var template = handlebars.compile(html)
      var replacements = {
        name: name,
      }
      var htmlToSend = template(replacements)
      var mailOptions = {
        from: SENDER_ADDRESS,
        to: emailTo,
        subject: subject,
        html: htmlToSend,
      }

      try {
        mail.sendMail(mailOptions)
      } catch (error) {
        console.log(error)
      }
      mail.close()
    }
  })
}
module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendPasswordResetedEmail,
  sendConfirmationEmail,
}
