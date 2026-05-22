const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = (email, name, confirmationCode) => {
  return transporter.sendMail({
    from: `"SkillSwap Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "¡Autoriza tu cuenta en SkillSwap!",
    html: `
      <div style="font-family: sans-serif; text-align: center; border: 1px solid #eee; padding: 20px;">
        <h1>Hola ${name}</h1>
        <p>Haz clic abajo para autorizar tu cuenta y poder subir tus fotos:</p>
        <a href="http://localhost:3000/api/auth/verify/${confirmationCode}" 
           style="background-color: #ff8a00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
           Autorizar mi cuenta
        </a>
      </div>
    `,
  });
};

const sendRoleApprovedEmail = (email, name, role) => {
  const rolTexto = role === "Professor" ? "Profesor" : "Alumno";
  const mensaje = role === "Professor"
    ? "Ya puedes publicar tus clases y empezar a enseñar."
    : "Ya puedes reservar clases y empezar a aprender.";

  return transporter.sendMail({
    from: `"SkillSwap Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `¡Enhorabuena ${name}! Ya eres ${rolTexto} en SkillSwap`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #ff8a00;">Felicidades, ${name}!</h1>
        <p style="font-size: 1.1rem;">Tu solicitud para ser <strong>${rolTexto}</strong> ha sido <strong style="color: green;">aprobada</strong>.</p>
        <p>${mensaje}</p>
        <p style="color: #888; margin-top: 30px;">El equipo de SkillSwap</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendRoleApprovedEmail };