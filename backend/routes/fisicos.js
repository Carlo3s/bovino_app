const express = require('express');
const router = express.Router();
const Fisico = require('../models/Fisico');

// Obtener todos los registros físicos
router.get('/', async (req, res) => {
  const fisicos = await Fisico.find();
  res.json(fisicos);
});

// Crear un registro físico
router.post('/', async (req, res) => {
  const fisico = new Fisico(req.body);
  await fisico.save();
  res.json(fisico);
});

// Actualizar un registro físico
router.put('/:id', async (req, res) => {
  const fisico = await Fisico.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(fisico);
});

// Eliminar un registro físico
router.delete('/:id', async (req, res) => {
  await Fisico.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
