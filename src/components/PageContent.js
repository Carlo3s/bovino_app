import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './PageContent.css';

const PageContent = ({ pages }) => {
  const { id } = useParams();
  const page = pages.find(p => p.id === id);

  if (!page) {
    return (
      <div className="page-not-found">
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
        <Link to="/" className="back-link">Volver al inicio</Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="page-content">
      <h1>{page.title}</h1>
      <div className="page-meta">
        <span>Creado: {formatDate(page.createdAt)}</span>
      </div>
      <div className="page-body">
        {page.content.split('\n').map((paragraph, index) => (
          paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
        ))}
      </div>
    </div>
  );
};

export default PageContent; 