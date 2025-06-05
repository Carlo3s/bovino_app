const mongoose = require('mongoose');

const FisicoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  cantidad: Number,
  unidad: String,
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fisico', FisicoSchema);
