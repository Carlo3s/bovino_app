const mongoose = require('mongoose');

const BovinoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true, enum: ['vacas', 'toros', 'terneros', 'novillos', 'novillas'] },
  descripcion: String,
  codigoFinca: String,
  codigoSiniiga: String,
  raza: String,
  foto: String,
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bovino', BovinoSchema);
