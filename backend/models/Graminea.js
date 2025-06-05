const mongoose = require('mongoose');

const GramineaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  zona: String,
  foto: String,
  cientifico: String,
  info: String,
  proteina: String,
  quema: String,
  inundacion: String,
  plagas: String,
  importancia: String,
  beneficios: String,
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Graminea', GramineaSchema);
