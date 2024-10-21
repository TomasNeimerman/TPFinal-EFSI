import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
  const { id } = useParams(); // Obtiene el ID del evento desde la URL
  const [evento, setEvento] = useState(null);
  const [error, setError] = useState(null);
console.log(id)
  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await axios.get(`http://localhost:3508/api/event/${id}`);
        setEvento(response.data);
      } catch (error) {
        setError('Error al cargar el evento');
      }
    };

    fetchEvento();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!evento) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Nombre: {evento.name}</h1>
      <p>Descripción: {evento.description}</p>
      
      {/* Puedes mostrar más detalles del evento aquí */}
    </div>
  );
};

export default EventDetail;
