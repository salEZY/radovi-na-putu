const nodeMailer = require('nodemailer')

const { emailPw } = require('./config')

const createMailOptions = (email, type, info) => {
  const mailOptions = {
    from: 'zatvorene.ulice@gmail.com',
    to: email
  }
  switch (type) {
    case 'register':
      return {
        ...mailOptions,
        subject: 'Uspesno ste registrovani',
        text:
          'Dobrodošli! Prijavom na aplikaciju mozete prijavljivati zatvorene ulice.'
      }
    case 'reset':
      return {
        ...mailOptions,
        subject: 'Promena šifre!',
        text: `Vaša trenutna šifra je ${info}. Molimo da je promenite u aplikaciji`
      }
    default:
      return null
  }
}

const sendEmail = (email, type, info) => {
  const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'zatvorene.ulice@gmail.com',
      pass: `${emailPw}`
    }
  })
  const mailOptions = createMailOptions(email, type, info)
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return console.error(err.message)
    console.log(`Email je poslat! ${info.response}`)
  })
}

module.exports = {
  sendEmail
}
