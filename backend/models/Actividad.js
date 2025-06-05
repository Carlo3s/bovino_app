const mongoose = require('mongoose');

const ActividadSchema = new mongoose.Schema({
  tipo: { type: String, required: true }, // Ej: 'bovino', 'fisico', 'otro'
  descripcion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  datos: Object // Puede guardar datos adicionales
});

module.exports = mongoose.model('Actividad', ActividadSchema);
