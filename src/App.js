import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CalendarioVacunacion from './pages/CalendarioVacunacion';
import InventarioBovino from './pages/InventarioBovino';
import GaleriaGramineas from './pages/GaleriaGramineas';
import InventarioFisico from './pages/InventarioFisico';
import Dashboard from './pages/Dashboard';
import initialPages from './data/pages.json';
import './App.css';

function App() {
  const [pages, setPages] = useState(() => {
    // Intentar cargar las páginas desde localStorage
    const savedPages = localStorage.getItem('cms-pages');
    return savedPages ? JSON.parse(savedPages) : initialPages;
  });

  // Guardar las páginas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('cms-pages', JSON.stringify(pages));
  }, [pages]);

  // Función para agregar una nueva página
  const handleAddPage = (newPage) => {
    setPages([...pages, newPage]);
  };

  return (
    <Router>
      <div className="app">
        <Layout pages={pages}>
          <Routes>
            <Route path="/calendario-vacunacion" element={<CalendarioVacunacion />} />
            <Route path="/inventario-bovino" element={<InventarioBovino />} />
            <Route path="/galeria-gramineas" element={<GaleriaGramineas />} />
            <Route path="/inventario-fisico" element={<InventarioFisico />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
