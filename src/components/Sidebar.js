import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Tabla de Contenidos</h2>
      <ul>
        <li><Link to="/calendario-vacunacion">Calendario de Vacunación</Link></li>
        <li><Link to="/inventario-bovino">Inventario Bovino</Link></li>
        <li><Link to="/galeria-gramineas">Galería de Gramíneas</Link></li>
        <li><Link to="/inventario-fisico">Inventario Físico</Link></li>
        <li><Link to="/dashboard">Dashboard / Reportes</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;