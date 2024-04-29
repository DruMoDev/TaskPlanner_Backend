import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    service: "gmail",
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email
  const info = await transport.sendMail({
    from: '"TaskPlanner - Administrador de Proyectos" <cuentas@TaskPlanner.com>',
    to: email,
    subject: "TaskPlanner - Confirma tu cuenta",
    text: "Comprueba tu cuenta en TaskPlanner",
    html: `<p>Hola ${nombre}, confirma tu cuenta en TaskPlanner</p>
    <p>Tu cuenta ya esta casi lista, solo debes confirmarla en el siguiente enlace:</p>
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>    
    `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    service: "gmail",
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email
  const info = await transport.sendMail({
    from: '"TaskPlanner - Administrador de Proyectos" <cuentas@TaskPlanner.com>',
    to: email,
    subject: "TaskPlanner - Reestablece tu password",
    text: "Reestablece tu password",
    html: `<p>Hola ${nombre}, has solicitado reestablecer tu password</p>
    <p>Sigue el siguiente enlace para generar un nuevo password:</p>
    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password:</a>
    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>    
    `,
  });
};
