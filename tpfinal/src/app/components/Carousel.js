import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir
import '../styles/carousel.css'; // Importa el archivo CSS

const Carousel = ({ eventos }) => {
  const navigate = useNavigate(); // Inicializa useNavigate

  // Función para manejar la navegación a la página de detalles del evento
  const handleEventClick = (id) => {
    navigate(`/event/${id}`); // Redirige a la ruta del detalle del evento con el id
  };

  return (
    <div className="carouselContainer">
      <div className="carousel">
        {eventos.map((evento, index) => (
          <div 
            key={evento.id} 
            className="card" 
            onClick={() => handleEventClick(evento.id)} // Redirige al hacer clic
            style={{ cursor: 'pointer' }} // Añade estilo de cursor para indicar que es clicable
          >
            <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>Evento:</div> 
            <div className="info">{evento.name}</div>

            <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>Descripción:</div>
            <div className="details">{evento.description}</div>

            <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>Categorías:</div>
            <div className="details">{evento.event_category.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
