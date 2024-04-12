import { emailOlvidePassword, emailRegistro } from "../helpers/email.js";
import generarJWT from "../helpers/genenarJWT.js";
import generarId from "../helpers/generarId.js";
import Usuario from "../models/Usuario.js";

const registrar = async (req, res) => {
  // Evitar Registros Duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email: email });
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();

    // Enviar el email
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({
      msg: "Usuario Creado Correctamente. Revista tu Email para confirmar tu cuenta.",
    });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe.");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si esta registrado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada.");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar su password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params; //req.params accede al url (dinamico en este caso)
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no válido 1.");
    res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado correctamente." });
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe.");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();

    // Enviar el email
    emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({ msg: "Le hemos enviado un email con las instrucciones." });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    res.json({ msg: "Token válido y el usuario existe." });
  } else {
    const error = new Error("Token no válido 2.");
    res.status(403).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });
  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "Password modificado correctamente." });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no válido 3.");
    res.status(403).json({ msg: error.message });
  }
};

const nuevoPasswordDesdePerfil = async (req, res) => {
  const { password, email, nuevoPassword } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe.");
    return res.status(404).json({ msg: error.message });
  }

  if (await usuario.comprobarPassword(password)) {
    usuario.password = nuevoPassword;
    try {
      await usuario.save();
      res.json({ msg: "Password modificado correctamente." });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("El password es incorrecto.");
    res.status(403).json({ msg: error.message });
  }
};

const editarPerfil = async (req, res) => {
  const { nombre, email, nuevoEmail } = req.body;
  console.log(nuevoEmail, email);

  //Encontrar en usuario con ese email en la base de datos, utilizando el email que se recibe en el body
  const usuario = await Usuario.findOne({ email: req.body.email });
  if (!usuario) {
    const error = new Error("Actualiza la página y vuelve a intentarlo.");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si el nuevoEmail ya existe en la base de datos
  const existeEmail = await Usuario.findOne({ email: nuevoEmail });
  if (existeEmail) {
    const error = new Error("El nuevo email ya está registrado.");
    return res.status(400).json({ msg: error.message });
  }

  try {
    if (nombre) usuario.nombre = nombre;
    if (nuevoEmail) usuario.email = nuevoEmail;
    await usuario.save();
    res.json({
      msg: "Usuario modificado correctamente.",
      nombre: usuario?.nombre,
      email: usuario?.email,
    });
  } catch (error) {
    console.log(error);
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};

const obtenerUsuario = async (req, res) => {
  const { id } = req.params;

  const usuario = await Usuario.findById(id);
  if (!usuario) {
    const error = new Error("Usuario no encontrado.");
    return res.status(403).json({ msg: error.message });
  }
  return res.json({
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
  });
};

export {
  olvidePassword,
  confirmar,
  registrar,
  autenticar,
  comprobarToken,
  nuevoPassword,
  perfil,
  editarPerfil,
  nuevoPasswordDesdePerfil,
  obtenerUsuario,
};
