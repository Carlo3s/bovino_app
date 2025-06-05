const express = require('express');
const router = express.Router();
const Graminea = require('../models/Graminea');

// Obtener todas las gramíneas
router.get('/', async (req, res) => {
  const gramineas = await Graminea.find();
  res.json(gramineas);
});

// Crear una gramínea
router.post('/', async (req, res) => {
  const graminea = new Graminea(req.body);
  await graminea.save();
  res.json(graminea);
});

// Actualizar una gramínea
router.put('/:id', async (req, res) => {
  const graminea = await Graminea.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(graminea);
});

// Eliminar una gramínea
router.delete('/:id', async (req, res) => {
  await Graminea.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
