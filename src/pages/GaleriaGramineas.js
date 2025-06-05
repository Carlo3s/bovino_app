import React, { useState, useEffect, useRef } from 'react';
import './GaleriaGramineas.css';
import { saveAs } from 'file-saver';
import { FaSeedling, FaInfoCircle, FaFlask, FaFire, FaTint, FaBug, FaStar, FaThumbsUp, FaLeaf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ZONAS = [
  { key: 'no_inundable', label: 'Para zonas no inundables' },
  { key: 'baja_inundable', label: 'Para zonas bajas inundables' }
];

function GaleriaGramineas() {
  const [gramineas, setGramineas] = useState(() => {
    const saved = localStorage.getItem('galeria-gramineas');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [nueva, setNueva] = useState({
    nombre: '',
    zona: 'no_inundable',
    foto: '',
    cientifico: '',
    info: '',
    proteina: '',
    quema: '',
    inundacion: '',
    plagas: '',
    importancia: '',
    beneficios: ''
  });
  const [detalle, setDetalle] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    localStorage.setItem('galeria-gramineas', JSON.stringify(gramineas));
  }, [gramineas]);

  const handleChange = e => {
    setNueva({ ...nueva, [e.target.name]: e.target.value });
  };

  // Función para guardar gramínea en el backend
  const guardarGramineaBackend = async (graminea, edit = false) => {
    try {
      const { id, ...gramineaSinId } = graminea;
      if (edit && id) {
        // Actualizar gramínea existente
        await fetch(`http://localhost:5000/api/gramineas/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gramineaSinId)
        });
      } else {
        // Crear nueva gramínea
        await fetch('http://localhost:5000/api/gramineas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gramineaSinId)
        });
      }
    } catch (err) {
      console.error('Error guardando gramínea en backend:', err);
    }
  };

  // Función para registrar actividad en el backend
  const registrarActividad = async (descripcion, datos = {}, tipo = 'graminea') => {
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

  const handleAgregar = async e => {
    e.preventDefault();
    if (!nueva.nombre.trim()) return;
    let gramineaNueva;
    if (editId) {
      gramineaNueva = { ...nueva, id: editId };
      setGramineas(gramineas.map(g => g.id === editId ? gramineaNueva : g));
      setEditId(null);
      await registrarActividad(`Se actualizó la gramínea "${nueva.nombre}"`, gramineaNueva, 'graminea');
      await guardarGramineaBackend(gramineaNueva, true);
    } else {
      gramineaNueva = { ...nueva, id: Date.now() };
      setGramineas([...gramineas, gramineaNueva]);
      await registrarActividad(`Se agregó la gramínea "${nueva.nombre}"`, gramineaNueva, 'graminea');
      await guardarGramineaBackend(gramineaNueva, false);
    }
    setNueva({ nombre: '', zona: 'no_inundable', foto: '', cientifico: '', info: '', proteina: '', quema: '', inundacion: '', plagas: '', importancia: '', beneficios: '' });
    setShowForm(false);
  };

  const handleEliminar = async id => {
    const gramineaAEliminar = gramineas.find(g => g.id === id);
    setGramineas(gramineas.filter(g => g.id !== id));
    if (gramineaAEliminar) {
      await registrarActividad(`Se eliminó la gramínea "${gramineaAEliminar.nombre}"`, gramineaAEliminar, 'graminea');
    }
  };

  const handleEditar = graminea => {
    setNueva(graminea);
    setEditId(graminea.id);
    setShowForm(true);
  };

  // Imagen real (base64)
  const handleFotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNueva(prev => ({ ...prev, foto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const exportarDatos = () => {
    const blob = new Blob([JSON.stringify(gramineas, null, 2)], { type: 'application/json' });
    saveAs(blob, `gramineas_${new Date().toISOString().slice(0,10)}.json`);
  };

  return (
    <div className="galeria-gramineas">
      <motion.h2 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <FaLeaf style={{color:'#1976d2', marginRight:8}}/>Galería de Gramíneas
      </motion.h2>
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => { setShowForm(true); setEditId(null); setNueva({ nombre: '', zona: 'no_inundable', foto: '', cientifico: '', info: '', proteina: '', quema: '', inundacion: '', plagas: '', importancia: '', beneficios: '' }); }} className="nuevo-btn">
        <FaSeedling style={{marginRight:6}}/>Nueva Gramínea
      </motion.button>
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={exportarDatos} className="exportar-btn">
        <FaInfoCircle style={{marginRight:6}}/>Exportar Datos
      </motion.button>
      <AnimatePresence>
      {showForm && (
        <motion.form className="graminea-form" onSubmit={handleAgregar} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.4 }}>
          <label className="foto-label">
            Foto de la gramínea
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFotoChange}
            />
            <button type="button" onClick={() => fileInputRef.current.click()} className="foto-btn">Seleccionar foto</button>
            {nueva.foto && <img src={nueva.foto} alt="gramínea" className="graminea-foto-form" />}
          </label>
          <input
            name="nombre"
            value={nueva.nombre}
            onChange={handleChange}
            placeholder="Nombre de la gramínea"
            required
          />
          <select name="zona" value={nueva.zona} onChange={handleChange}>
            {ZONAS.map(z => (
              <option key={z.key} value={z.key}>{z.label}</option>
            ))}
          </select>
          <input name="cientifico" value={nueva.cientifico || ''} onChange={handleChange} placeholder="Nombre científico" />
          <textarea name="info" value={nueva.info || ''} onChange={handleChange} placeholder="Información" />
          <input name="proteina" value={nueva.proteina || ''} onChange={handleChange} placeholder="Nivel de proteína" />
          <input name="quema" value={nueva.quema || ''} onChange={handleChange} placeholder="Soporta quema (Sí/No)" />
          <input name="inundacion" value={nueva.inundacion || ''} onChange={handleChange} placeholder="Soporta inundación (Sí/No)" />
          <input name="plagas" value={nueva.plagas || ''} onChange={handleChange} placeholder="Soporta plagas (Sí/No)" />
          <textarea name="importancia" value={nueva.importancia || ''} onChange={handleChange} placeholder="Importancia" />
          <textarea name="beneficios" value={nueva.beneficios || ''} onChange={handleChange} placeholder="Beneficios" />
          <div className="form-actions">
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="cancelar-btn"><FaInfoCircle style={{marginRight:6}}/>Cancelar</button>
            <button type="submit" className="guardar-btn"><FaSeedling style={{marginRight:6}}/>{editId ? 'Actualizar' : 'Guardar'}</button>
          </div>
        </motion.form>
      )}
      </AnimatePresence>
      <AnimatePresence>
      {detalle && (
        <motion.div className="graminea-detalle-modal" onClick={() => setDetalle(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="graminea-detalle" onClick={e => e.stopPropagation()} initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ duration: 0.3 }}>
            <img src={detalle.foto} alt={detalle.nombre} className="detalle-foto" />
            <div className="detalle-nombre"><FaLeaf style={{marginRight:6}}/>{detalle.nombre}</div>
            <div className="detalle-campo"><FaFlask style={{color:'#1976d2',marginRight:6}}/><b>Nombre Científico:</b> <span>{detalle.cientifico}</span></div>
            <div className="detalle-campo"><FaInfoCircle style={{color:'#1976d2',marginRight:6}}/><b>Información:</b> <span>{detalle.info}</span></div>
            <div className="detalle-campo"><FaFlask style={{color:'#1976d2',marginRight:6}}/><b>Nivel De Proteína:</b> <span>{detalle.proteina}</span></div>
            <div className="detalle-campo"><FaFire style={{color:'#1976d2',marginRight:6}}/><b>Soporta Quema:</b> <span>{detalle.quema}</span></div>
            <div className="detalle-campo"><FaTint style={{color:'#1976d2',marginRight:6}}/><b>Soporta Inundación:</b> <span>{detalle.inundacion}</span></div>
            <div className="detalle-campo"><FaBug style={{color:'#1976d2',marginRight:6}}/><b>Soporta Plagas:</b> <span>{detalle.plagas}</span></div>
            <div className="detalle-campo"><FaStar style={{color:'#1976d2',marginRight:6}}/><b>Importancia:</b> <span>{detalle.importancia}</span></div>
            <div className="detalle-campo"><FaThumbsUp style={{color:'#1976d2',marginRight:6}}/><b>Beneficios:</b> <span>{detalle.beneficios}</span></div>
            <button className="cerrar-btn" onClick={() => setDetalle(null)}><FaInfoCircle style={{marginRight:6}}/>Cerrar</button>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
      {ZONAS.map(zona => (
        <motion.div key={zona.key} className="zona-section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h3 className="zona-titulo">
            {zona.key === 'no_inundable' && <FaLeaf style={{marginRight:6}}/>}
            {zona.key === 'baja_inundable' && <FaTint style={{marginRight:6}}/>}
            {zona.label}
          </h3>
          <div className="gramineas-grid">
            {gramineas.filter(g => g.zona === zona.key).length === 0 && <div className="no-gramineas">No hay gramíneas en esta zona.</div>}
            {gramineas.filter(g => g.zona === zona.key).map(g => (
              <motion.div key={g.id} className="graminea-card" onClick={() => setDetalle(g)} whileHover={{ scale: 1.04, boxShadow: '0 4px 24px #1976d255' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {g.foto && <img src={g.foto} alt={g.nombre} className="graminea-foto" />}
                <div className="graminea-nombre">{g.nombre}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default GaleriaGramineas;
