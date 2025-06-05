const express = require('express');
const router = express.Router();
const Actividad = require('../models/Actividad');

// Obtener todas las actividades
router.get('/', async (req, res) => {
  const actividades = await Actividad.find().sort({ fecha: -1 });
  res.json(actividades);
});

// Crear una actividad
router.post('/', async (req, res) => {
  const actividad = new Actividad(req.body);
  await actividad.save();
  res.json(actividad);
});

// Eliminar una actividad
router.delete('/:id', async (req, res) => {
  await Actividad.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
