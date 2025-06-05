import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarioVacunacion.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaPlus, FaTrash } from 'react-icons/fa';

function CalendarioVacunacion() {
  const [date, setDate] = useState(new Date());
  const [actividades, setActividades] = useState(() => {
    const saved = localStorage.getItem('actividades-vacunacion');
    return saved ? JSON.parse(saved) : {};
  });
  const [nuevaActividad, setNuevaActividad] = useState('');
  const fechaKey = date.toISOString().split('T')[0];

  useEffect(() => {
    localStorage.setItem('actividades-vacunacion', JSON.stringify(actividades));
  }, [actividades]);

  // NUEVO: Cargar actividades desde el backend agrupadas por fecha y guardando _id
  const fetchActividadesBackend = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/actividades');
      const data = await res.json();
      // Agrupar por fecha (YYYY-MM-DD) y guardar _id y descripcion
      const agrupadas = {};
      data.forEach(act => {
        const fechaAct = act.fecha ? act.fecha.split('T')[0] : '';
        if (!agrupadas[fechaAct]) agrupadas[fechaAct] = [];
        agrupadas[fechaAct].push({ _id: act._id, descripcion: act.descripcion });
      });
      setActividades(agrupadas);
    } catch (err) {
      console.error('Error cargando actividades del backend:', err);
    }
  };

  useEffect(() => {
    fetchActividadesBackend();
  }, []);

  // Guardar actividad manual en el backend
  const guardarActividadManual = async (descripcion, fecha) => {
    try {
      await fetch('http://localhost:5000/api/actividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'manual',
          descripcion,
          fecha,
          datos: {}
        })
      });
    } catch (err) {
      console.error('Error guardando actividad manual en backend:', err);
    }
  };

  const handleAgregar = async () => {
    if (!nuevaActividad.trim()) return;
    await guardarActividadManual(nuevaActividad, new Date(fechaKey));
    setNuevaActividad('');
    await fetchActividadesBackend();
  };

  const handleEliminar = async (idx) => {
    const actividad = actividades[fechaKey][idx];
    try {
      if (actividad && actividad._id) {
        await fetch(`http://localhost:5000/api/actividades/${actividad._id}`, { method: 'DELETE' });
      }
      await fetchActividadesBackend();
    } catch (err) {
      console.error('Error eliminando actividad del backend:', err);
    }
  };

  return (
    <div className="calendario-vacunacion">
      <motion.h2 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <FaCalendarAlt style={{color:'#1976d2', marginRight:8}}/>Calendario de Vacunación
      </motion.h2>
      <h3>Agenda tus Actividades</h3>
      <Calendar
        onChange={setDate}
        value={date}
        locale="es-ES"
        tileClassName={({ date }) => {
          const key = date.toISOString().split('T')[0];
          return actividades[key] ? 'tiene-actividad' : null;
        }}
      />
      <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.5 }}>
      <div className="actividades-lista">
        <h4>Actividades para {date.toLocaleDateString('es-ES')}</h4>
        {actividades[fechaKey] && actividades[fechaKey].length > 0 ? (
          <ul>
            {actividades[fechaKey].map((act, idx) => (
              <li key={act._id}>
                {act.descripcion}
                <button onClick={() => handleEliminar(idx)} className="eliminar-btn"><FaTrash style={{marginRight:6}}/>Eliminar</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay actividades para este día.</p>
        )}
      </div>
      <div className="agregar-actividad">
        <input
          type="text"
          value={nuevaActividad}
          onChange={e => setNuevaActividad(e.target.value)}
          placeholder="Nueva actividad"
        />
        <button onClick={handleAgregar} className="agregar-btn"><FaPlus style={{marginRight:6}}/>Agregar</button>
      </div>
      </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default CalendarioVacunacion;
