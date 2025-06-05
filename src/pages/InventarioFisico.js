import React, { useState, useEffect } from 'react';
import './InventarioFisico.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaCow, FaSeedling, FaWarehouse, FaChartBar, FaPlus, FaEdit, FaTrash, FaAppleAlt, FaPills, FaTools, FaTractor, FaBoxOpen } from 'react-icons/fa';

const CATEGORIAS = [
  { key: 'alimentos', label: 'Alimentos' },
  { key: 'medicamentos', label: 'Medicamentos' },
  { key: 'ferreteria', label: 'Ferretería' },
  { key: 'maquinaria', label: 'Maquinaria' },
  { key: 'insumos', label: 'Insumos' },
];

function InventarioFisico() {
  const [productos, setProductos] = useState(() => {
    const saved = localStorage.getItem('inventario-fisico');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('');
  const [nuevo, setNuevo] = useState({
    codigo: '',
    nombre: '',
    obtencion: '',
    precio: '',
    categoria: 'alimentos',
    usos: '',
    descripcion: '',
    ubicacion: ''
  });

  useEffect(() => {
    localStorage.setItem('inventario-fisico', JSON.stringify(productos));
  }, [productos]);

  const handleChange = e => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  // Función para registrar actividad en el backend
  const registrarActividad = async (descripcion, datos = {}, tipo = 'fisico') => {
    try {
      await fetch('http://localhost:5000/api/actividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          descripcion,
          datos,
          fecha: new Date()
        })
      });
    } catch (err) {
      console.error('Error registrando actividad:', err);
    }
  };

  // Función para guardar producto en el backend
  const guardarProductoBackend = async (producto, edit = false) => {
    try {
      const { id, ...productoSinId } = producto;
      if (edit && id) {
        // Actualizar producto existente
        await fetch(`http://localhost:5000/api/fisicos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoSinId)
        });
      } else {
        // Crear nuevo producto
        await fetch('http://localhost:5000/api/fisicos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoSinId)
        });
      }
    } catch (err) {
      console.error('Error guardando producto en backend:', err);
    }
  };

  const handleAgregar = async e => {
    e.preventDefault();
    if (!nuevo.nombre.trim()) return;
    let productoNuevo;
    if (editId) {
      productoNuevo = { ...nuevo, id: editId };
      setProductos(productos.map(p => p.id === editId ? productoNuevo : p));
      setEditId(null);
      await registrarActividad(`Se actualizó el producto "${nuevo.nombre}" (${nuevo.categoria})`, productoNuevo, 'fisico');
      await guardarProductoBackend(productoNuevo, true);
    } else {
      productoNuevo = { ...nuevo, id: Date.now() };
      setProductos([...productos, productoNuevo]);
      await registrarActividad(`Se agregó el producto "${nuevo.nombre}" (${nuevo.categoria})`, productoNuevo, 'fisico');
      await guardarProductoBackend(productoNuevo, false);
    }
    setNuevo({ codigo: '', nombre: '', obtencion: '', precio: '', categoria: 'alimentos', usos: '', descripcion: '', ubicacion: '' });
    setShowForm(false);
  };

  const handleEliminar = async id => {
    const productoAEliminar = productos.find(p => p.id === id);
    setProductos(productos.filter(p => p.id !== id));
    if (productoAEliminar) {
      await registrarActividad(`Se eliminó el producto "${productoAEliminar.nombre}" (${productoAEliminar.categoria})`, productoAEliminar, 'fisico');
    }
  };

  const handleEditar = producto => {
    setNuevo(producto);
    setEditId(producto.id);
    setShowForm(true);
  };

  // Mostrar solo la categoría activa
  const mostrarProductos = categoriaActiva
    ? productos.filter(p => p.categoria === categoriaActiva)
    : [];

  return (
    <div className="inventario-fisico">
      <motion.h2 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <FaWarehouse style={{color:'#1976d2', marginRight:8}}/>Inventario Físico
      </motion.h2>
      <div className="fisico-categorias-grid">
        {CATEGORIAS.map(cat => (
          <motion.button
            key={cat.key}
            className={`categoria-btn${categoriaActiva === cat.key ? ' activa' : ''}`}
            onClick={() => setCategoriaActiva(cat.key)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.key === 'alimentos' && <FaAppleAlt style={{marginRight:6}}/>}
            {cat.key === 'medicamentos' && <FaPills style={{marginRight:6}}/>}
            {cat.key === 'ferreteria' && <FaTools style={{marginRight:6}}/>}
            {cat.key === 'maquinaria' && <FaTractor style={{marginRight:6}}/>}
            {cat.key === 'insumos' && <FaBoxOpen style={{marginRight:6}}/>}
            {cat.label}
          </motion.button>
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => { setShowForm(true); setEditId(null); setNuevo({ codigo: '', nombre: '', obtencion: '', precio: '', categoria: categoriaActiva || 'alimentos', usos: '', descripcion: '', ubicacion: '' }); }} className="nuevo-btn"><FaPlus style={{marginRight:6}}/>Nuevo Registro</motion.button>
      <AnimatePresence>
      {showForm && (
        <motion.form className="fisico-form" onSubmit={handleAgregar} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.4 }}>
          <input
            name="codigo"
            value={nuevo.codigo}
            onChange={handleChange}
            placeholder="Código del producto"
          />
          <input
            name="nombre"
            value={nuevo.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
          <input
            name="obtencion"
            value={nuevo.obtencion}
            onChange={handleChange}
            placeholder="Obtención (fecha o proveedor)"
            type="text"
          />
          <input
            name="precio"
            value={nuevo.precio}
            onChange={handleChange}
            placeholder="Precio"
            type="number"
            min="0"
            step="0.01"
          />
          <select name="categoria" value={nuevo.categoria} onChange={handleChange}>
            {CATEGORIAS.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>
          <input
            name="usos"
            value={nuevo.usos}
            onChange={handleChange}
            placeholder="Usos"
          />
          <textarea
            name="descripcion"
            value={nuevo.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
          />
          <input
            name="ubicacion"
            value={nuevo.ubicacion}
            onChange={handleChange}
            placeholder="Ubicación"
          />
          <div className="form-actions">
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="cancelar-btn"><FaTrash style={{marginRight:6}}/>Cancelar</button>
            <button type="submit" className="guardar-btn"><FaPlus style={{marginRight:6}}/>{editId ? 'Actualizar' : 'Guardar'}</button>
          </div>
        </motion.form>
      )}
      </AnimatePresence>
      <AnimatePresence>
      {categoriaActiva && (
        <motion.div className="fisico-categoria" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.5 }}>
          <h3>{CATEGORIAS.find(c => c.key === categoriaActiva).label}</h3>
          <ul>
            {mostrarProductos.length === 0 && <li>No hay productos en esta categoría.</li>}
            {mostrarProductos.map(p => (
              <motion.li key={p.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3 }}>
                <div>
                  <strong>{p.nombre}</strong> <span>({p.codigo})</span><br />
                  <span className="fisico-codigos">Obtención: {p.obtencion || '-'} | Precio: ${p.precio || '-'}</span><br />
                  {p.usos && <span>Usos: {p.usos}</span>}<br />
                  {p.descripcion && <span>Descripción: {p.descripcion}</span>}<br />
                  {p.ubicacion && <span>Ubicación: {p.ubicacion}</span>}
                </div>
                <div>
                  <button onClick={() => handleEditar(p)} className="editar-btn"><FaEdit style={{marginRight:6}}/>Editar</button>
                  <button onClick={() => handleEliminar(p.id)} className="eliminar-btn"><FaTrash style={{marginRight:6}}/>Eliminar</button>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export default InventarioFisico;
