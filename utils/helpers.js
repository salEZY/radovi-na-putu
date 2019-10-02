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
        subject: 'Uspešno ste registrovani',
        html:
          '<h1 style="color: teal;margin-bottom: 10px;">Radovi Na Putu</h1><p>Dobrodošli! Kreiranjem naloga možete prijavljivati zatvorene ulice.</p>'
      }
    case 'reset':
      return {
        ...mailOptions,
        subject: 'Promena šifre!',
        html: `<h1 style="color: teal;margin-bottom: 10px;">Radovi Na Putu</h1><p>Vaša nova šifra je ${info}. Možete je promeniti u aplikaciji</p>`
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
