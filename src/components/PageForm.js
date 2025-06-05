import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './PageForm.css';

const PageForm = ({ onAddPage }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const newPage = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    onAddPage(newPage);
    navigate(`/page/${newPage.id}`);
  };

  return (
    <div className="page-form-container">
      <h2>Crear Nueva Página</h2>
      <form onSubmit={handleSubmit} className="page-form">
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ingresa el título de la página"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Contenido:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ingresa el contenido de la página"
            rows="10"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="cancel-button">
            Cancelar
          </button>
          <button type="submit" className="submit-button">
            Crear Página
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageForm; 