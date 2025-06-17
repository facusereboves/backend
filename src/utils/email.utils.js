import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
}
})

export const sendRecoveryEmail = async (email, token) => {
const link = `http://localhost:8080/reset-password/${token}`

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    html: `<p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${link}">${link}</a>
            <p>Este enlace expirará en 1 hora.</p>`
}

await transporter.sendMail(mailOptions)
}
