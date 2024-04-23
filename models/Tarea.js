import mongoose from "mongoose";

const tareaSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    estado: {
      type: String,
      required: true,
      enum: ["pendiente", "enProgreso", "enRevisión", "terminada"],
      default: "pendiente",
    },
    fechaEntrega: {
      type: Date,
      required: true,
      default: Date.now, // cambiado a Date.now
    },
    prioridad: {
      type: String,
      required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
    },
  },
  { timestamps: true }
);

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;
