import '../styles/carousel.css'; // Importa el archivo CSS

const Carousel = ({ eventos }) => {
  return (
    <div className="carouselContainer">
      <div className="carousel">
        {eventos.map((evento, index) => (
          <div key={evento.id} className="card"> {/* Manteniendo la clase .card para los estilos */}
            <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>Evento: </div> 
            
            <div className="info">{evento.name}</div> {/* Aquí se aplica el estilo de .info */}

            <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>Descripción:</div>
            <div className="details">{evento.description}</div> {/* Aquí se aplica el estilo de .details */}

            <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>Categorías:</div>
            <div className="details">{evento.event_category.name}</div> {/* Aquí se aplica el estilo de .details */}
            
            {/* Aquí se pueden agregar más campos de evento siguiendo el mismo patrón */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
