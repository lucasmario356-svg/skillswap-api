const https = require("https");

const sendEmail = (to, subject, html) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      sender: { name: "SkillSwap Team", email: "lucasmario356@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    const req = https.request({
      hostname: "api.brevo.com",
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
        else reject(new Error(`Brevo error ${res.statusCode}: ${data}`));
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

const sendVerificationEmail = (email, name, confirmationCode) => {
  return sendEmail(
    email,
    "¡Autoriza tu cuenta en SkillSwap!",
    `<div style="font-family: sans-serif; text-align: center; border: 1px solid #eee; padding: 20px;">
      <h1>Hola ${name}</h1>
      <p>Haz clic abajo para autorizar tu cuenta:</p>
      <a href="${process.env.API_URL}/api/auth/verify/${confirmationCode}"
         style="background-color: #ff8a00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
         Autorizar mi cuenta
      </a>
    </div>`
  );
};

const sendRoleApprovedEmail = (email, name, role) => {
  const rolTexto = role === "Professor" ? "Profesor" : "Alumno";
  const mensaje = role === "Professor"
    ? "Ya puedes publicar tus clases y empezar a enseñar."
    : "Ya puedes reservar clases y empezar a aprender.";

  return sendEmail(
    email,
    `¡Enhorabuena ${name}! Ya eres ${rolTexto} en SkillSwap`,
    `<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #ff8a00;">Felicidades, ${name}!</h1>
      <p style="font-size: 1.1rem;">Tu solicitud para ser <strong>${rolTexto}</strong> ha sido <strong style="color: green;">aprobada</strong>.</p>
      <p>${mensaje}</p>
      <p style="color: #888; margin-top: 30px;">El equipo de SkillSwap</p>
    </div>`
  );
};

module.exports = { sendVerificationEmail, sendRoleApprovedEmail };