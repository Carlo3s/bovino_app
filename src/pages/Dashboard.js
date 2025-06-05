import React from 'react';
import './Dashboard.css';
import { FaChartBar } from 'react-icons/fa';

function Dashboard() {
  // Aquí puedes agregar lógica para obtener datos de los módulos
  // Por ejemplo, totales, gráficos, etc.
  return (
    <div className="dashboard">
      <h2><FaChartBar style={{color:'#1976d2', marginRight:8}}/>Panel de Reportes y Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Resumen de Vacunación</h3>
          <p>Próximas actividades, totales por mes, etc.</p>
        </div>
        <div className="dashboard-card">
          <h3>Inventario Bovino</h3>
          <p>Cantidad por categoría, razas, etc.</p>
        </div>
        <div className="dashboard-card">
          <h3>Inventario Físico</h3>
          <p>Totales por tipo, alertas de stock, etc.</p>
        </div>
        <div className="dashboard-card">
          <h3>Galería de Gramíneas</h3>
          <p>Cantidad de especies registradas, zonas, etc.</p>
        </div>
      </div>
      <p style={{marginTop: 30}}>Aquí puedes agregar gráficos, KPIs y reportes personalizados.</p>
    </div>
  );
}

export default Dashboard;
