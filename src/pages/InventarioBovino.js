import React, { useState, useEffect, useRef } from 'react';
import './InventarioBovino.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { GiCow, GiBull, GiBuffaloHead } from 'react-icons/gi';

const CATEGORIAS = [
  { key: 'vacas', label: 'Vacas' },
  { key: 'toros', label: 'Toros' },
  { key: 'terneros', label: 'Terneros' },
  { key: 'novillas', label: 'Novillas' },
  { key: 'novillos', label: 'Novillos' },
];
const RAZAS = [
  'Holstein', 'Jersey', 'Simmental', 'Charolais', 'Brahman', 'Otra'
];

function InventarioBovino() {
  const [bovinos, setBovinos] = useState(() => {
    const saved = localStorage.getItem('inventario-bovino');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroRaza, setFiltroRaza] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [nuevo, setNuevo] = useState({
    nombre: '',
    categoria: 'vacas',
    descripcion: '',
    codigoFinca: '',
    codigoSiniiga: '',
    raza: 'Holstein',
    foto: ''
  });
  const [categoriaActiva, setCategoriaActiva] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    localStorage.setItem('inventario-bovino', JSON.stringify(bovinos));
  }, [bovinos]);

  const handleChange = e => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  // Función para registrar actividad en el backend
  const registrarActividad = async (descripcion, datos = {}, tipo = 'bovino') => {
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

  // Función para guardar bovino en el backend
  const guardarBovinoBackend = async (bovino, edit = false) => {
    try {
      const { id, ...bovinoSinId } = bovino;
      if (edit && id) {
        // Actualizar bovino existente
        await fetch(`http://localhost:5000/api/bovinos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bovinoSinId)
        });
      } else {
        // Crear nuevo bovino
        await fetch('http://localhost:5000/api/bovinos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bovinoSinId)
        });
      }
    } catch (err) {
      console.error('Error guardando bovino en backend:', err);
    }
  };

  const handleAgregar = async e => {
    e.preventDefault();
    if (!nuevo.nombre.trim()) return;
    let bovinoNuevo;
    if (editId) {
      bovinoNuevo = { ...nuevo, id: editId };
      setBovinos(bovinos.map(b => b.id === editId ? bovinoNuevo : b));
      setEditId(null);
      await registrarActividad(`Se actualizó el bovino "${nuevo.nombre}" (${nuevo.categoria}, ${nuevo.raza})`, bovinoNuevo, 'bovino');
      await guardarBovinoBackend(bovinoNuevo, true);
    } else {
      bovinoNuevo = { ...nuevo, id: Date.now() };
      setBovinos([...bovinos, bovinoNuevo]);
      await registrarActividad(`Se agregó el bovino "${nuevo.nombre}" (${nuevo.categoria}, ${nuevo.raza})`, bovinoNuevo, 'bovino');
      await guardarBovinoBackend(bovinoNuevo, false);
    }
    setNuevo({ nombre: '', categoria: 'vacas', descripcion: '', codigoFinca: '', codigoSiniiga: '', raza: 'Holstein', foto: '' });
    setShowForm(false);
  };

  const handleEliminar = async id => {
    const bovinoAEliminar = bovinos.find(b => b.id === id);
    setBovinos(bovinos.filter(b => b.id !== id));
    if (bovinoAEliminar) {
      await registrarActividad(`Se eliminó el bovino "${bovinoAEliminar.nombre}" (${bovinoAEliminar.categoria}, ${bovinoAEliminar.raza})`, bovinoAEliminar, 'bovino');
    }
  };

  const handleEditar = bovino => {
    setNuevo(bovino);
    setEditId(bovino.id);
    setShowForm(true);
  };

  // Imagen real (base64)
  const handleFotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNuevo(prev => ({ ...prev, foto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Filtros y búsqueda
  const bovinosFiltrados = bovinos.filter(b =>
    (!filtroCategoria || b.categoria === filtroCategoria) &&
    (!filtroRaza || b.raza === filtroRaza) &&
    (!busqueda || b.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Mostrar solo la categoría activa
  const mostrarBovinos = categoriaActiva
    ? bovinosFiltrados.filter(b => b.categoria === categoriaActiva)
    : [];

  return (
    <div className="inventario-bovino">
      <motion.h2 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <GiCow style={{color:'#ff7043', marginRight:8}}/>Inventario Bovino
      </motion.h2>
      <div className="bovino-menu">
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => { setShowForm(true); setEditId(null); setNuevo({ nombre: '', categoria: 'vacas', descripcion: '', codigoFinca: '', codigoSiniiga: '', raza: 'Holstein', foto: '' }); }} className="nuevo-btn"><FaPlus style={{marginRight:6}}/>Nuevo Registro</motion.button>
        <motion.input
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="busqueda-input"
          whileFocus={{ scale: 1.03 }}
        />
        <FaSearch style={{marginLeft: -28, color:'#bbb', position:'relative', top:2}}/>
        <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map(cat => (
            <option key={cat.key} value={cat.key}>{cat.label}</option>
          ))}
        </select>
        <select value={filtroRaza} onChange={e => setFiltroRaza(e.target.value)}>
          <option value="">Todas las razas</option>
          {RAZAS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <AnimatePresence>
      {showForm && (
        <motion.form className="bovino-form" onSubmit={handleAgregar} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.4 }}>
          <label className="foto-label">
            Foto del bovino (opcional)
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFotoChange}
            />
            <button type="button" onClick={() => fileInputRef.current.click()} className="foto-btn">Seleccionar foto</button>
            {nuevo.foto && <img src={nuevo.foto} alt="bovino" className="bovino-foto-form" />}
          </label>
          <input
            name="codigoFinca"
            value={nuevo.codigoFinca}
            onChange={handleChange}
            placeholder="Código finca del bovino"
          />
          <input
            name="codigoSiniiga"
            value={nuevo.codigoSiniiga}
            onChange={handleChange}
            placeholder="Código SINIIGA del bovino"
          />
          <input
            name="nombre"
            value={nuevo.nombre}
            onChange={handleChange}
            placeholder="Nombre del bovino"
            required
          />
          <select name="raza" value={nuevo.raza} onChange={handleChange}>
            {RAZAS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select name="categoria" value={nuevo.categoria} onChange={handleChange}>
            {CATEGORIAS.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>
          <textarea
            name="descripcion"
            value={nuevo.descripcion}
            onChange={handleChange}
            placeholder="Descripción o detalles"
          />
          <div className="form-actions">
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="cancelar-btn"><FaTrash style={{marginRight:6}}/>Cancelar</button>
            <button type="submit" className="guardar-btn"><FaPlus style={{marginRight:6}}/>{editId ? 'Actualizar' : 'Guardar'}</button>
          </div>
        </motion.form>
      )}
      </AnimatePresence>
      <div className="bovino-categorias-grid">
        {CATEGORIAS.map(cat => (
          <motion.button
            key={cat.key}
            className={`categoria-btn${categoriaActiva === cat.key ? ' activa' : ''}`}
            onClick={() => setCategoriaActiva(cat.key)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.key === 'vacas' && <GiCow style={{marginRight:6}}/>}
            {cat.key === 'toros' && <GiBull style={{marginRight:6}}/>}
            {cat.key === 'terneros' && <GiBuffaloHead style={{marginRight:6}}/>}
            {cat.key === 'novillas' && <GiCow style={{marginRight:6}}/>}
            {cat.key === 'novillos' && <GiBull style={{marginRight:6}}/>}
            {cat.label}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
      {categoriaActiva && (
        <motion.div className="bovino-categoria" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.5 }}>
          <h3>{CATEGORIAS.find(c => c.key === categoriaActiva).label}</h3>
          <ul>
            {mostrarBovinos.length === 0 && <li>No hay registros en esta categoría.</li>}
            {mostrarBovinos.map(b => (
              <motion.li key={b.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3 }}>
                {b.foto && <img src={b.foto} alt="bovino" className="bovino-foto" />}
                <div>
                  <strong>{b.nombre}</strong> <span>({b.raza})</span><br />
                  <span className="bovino-codigos">Finca: {b.codigoFinca || '-'} | SINIIGA: {b.codigoSiniiga || '-'}</span><br />
                  {b.descripcion && <span>{b.descripcion}</span>}
                </div>
                <div>
                  <button onClick={() => handleEditar(b)} className="editar-btn"><FaEdit style={{marginRight:6}}/>Editar</button>
                  <button onClick={() => handleEliminar(b.id)} className="eliminar-btn"><FaTrash style={{marginRight:6}}/>Eliminar</button>
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

export default InventarioBovino;
