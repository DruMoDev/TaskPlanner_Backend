import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  // Buscar proyectos donde el usuario es el creador
  const proyectosCreador = await Proyecto.find({ creador: req.usuario });

  // Buscar proyectos donde el usuario es un colaborador
  const proyectosColaborador = await Proyecto.find({
    colaboradores: req.usuario,
  });

  // Combinar los proyectos encontrados en uno solo
  const proyectos = [...proyectosCreador, ...proyectosColaborador];

  res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No encontrado.");
    return res.status(403).json({ msg: error.message });
  }

  if (
    proyecto.creador.toString() !== req.usuario._id.toString() &&
    !proyecto.colaboradores.includes(req.usuario._id.toString())
  ) {
    const error = new Error(
      "No eres el creador o un colaborador del proyecto."
    );
    return res.status(401).json({ msg: error.message });
  }

  // Obtener las tareas del proyecto
  const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);

  res.json({
    proyecto,
    tareas,
  });
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No encontrado.");
    return res.status(403).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida.");
    return res.status(401).json({ msg: error.message });
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No encontrado.");
    return res.status(403).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida.");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto Eliminado" });
  } catch (error) {
    console.log(error);
  }
};

const agregarColaborador = async (req, res) => {
  const { id } = req.params;
  const { id: idProyecto } = req.body;

  const proyecto = await Proyecto.findById(idProyecto);
  console.log(proyecto);

  if (!proyecto) {
    const error = new Error("No encontrado.");
    return res.status(403).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida.");
    return res.status(401).json({ msg: error.message });
  }
  // Verificar si el colaborador ya existe en el array
  if (proyecto.creador.toString() === id.toString()) {
    const error = new Error("No puedes añadir al creador como colaborador.");
    return res.status(401).json({ msg: error.message });
  }
  if (!proyecto.colaboradores.includes(id)) {
    proyecto.colaboradores.push(id);
    res.json(proyecto);
  } else {
    const error = new Error("El colaborador ya pertenece al proyecto.");
    res.status(401).json({ msg: error.message });
  }
  // proyecto.colaboradores = [...proyecto.colaboradores, id] || proyecto.colaboradores
  // proyecto.nombre = req.body.nombre || proyecto.nombre;
  // proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  // proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  // proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const buscarColaborador = async (req, res) => {
  const { email } = req.params;
  const usuario = await Usuario.findOne({ email: email });
  if (!usuario) {
    const error = new Error("Usuario no encontrado.");
    return res.status(403).json({ msg: error.message });
  }
  return res.json(usuario);
};

const eliminarColaborador = async (req, res) => {};

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  buscarColaborador,
};
