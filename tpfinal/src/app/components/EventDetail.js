import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [capacity, setCapacity] = useState(0);
  const [currentEnrolled, setCurrentEnrolled] = useState(0);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          return;
        }
  
        // Obtener los detalles del evento
        const eventResponse = await axios.get(`http://localhost:3508/api/event/${id}`);
        if (!eventResponse.data) {
          throw new Error('No se encontraron los detalles del evento.');
        }
  
        // Asegúrate de que los valores sean numéricos
        setEvento(eventResponse.data);
        setCapacity(parseInt(eventResponse.data.max_capacity) || 0);  // Capacidad máxima
        setCurrentEnrolled(parseInt(eventResponse.data.current_enrolled) || 0);  // Inscriptos actuales
  
        const enrollmentResponse = await axios.get(`http://localhost:3508/api/event/${id}/enrollment`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsEnrolled(enrollmentResponse.data.isEnrolled);
      } catch (error) {
        setError(error.response?.data?.message || 'Error al cargar los detalles del evento.');
      }
    };
  
    fetchEvento();
  }, [id]);

  const handleEnroll = async () => {
    try {
      if (currentEnrolled >= capacity) {
        alert("El evento ha alcanzado el límite de plazas.");
        return;
      }

      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3508/api/event/${id}/enrollment`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEnrolled(true);
      setCurrentEnrolled(currentEnrolled + 1);
    } catch (error) {
      alert("Hubo un error al intentar inscribirse.");
      console.error("Error al inscribirse al evento:", error);
    }
  };

  const handleUnenroll = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3508/api/event/${id}/enrollment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEnrolled(false);
      setCurrentEnrolled(currentEnrolled - 1);
    } catch (error) {
      alert("Hubo un error al intentar desinscribirse.");
      console.error("Error al desinscribirse del evento:", error);
    }
  };

  if (error) return <div>{error}</div>;
  if (!evento) return <div>Cargando detalles del evento...</div>;

  return (
    <div>
      <h1>Detalles del Evento</h1>
      <p><strong>Nombre del Evento:</strong> {evento.name}</p>
      <p><strong>Descripción:</strong> {evento.description}</p>
      <p><strong>Duración (minutos):</strong> {evento.duration_in_minutes}</p>
      <p><strong>Capacidad Máxima:</strong> {capacity}</p>
      <p><strong>Inscriptos Actuales:</strong> {currentEnrolled}</p>

      {isEnrolled ? (
        <button onClick={handleUnenroll} style={{ backgroundColor: 'red', color: 'white' }}>
          Desinscribirse del Evento
        </button>
      ) : (
        <button onClick={handleEnroll} style={{ backgroundColor: 'blue', color: 'white' }}>
          Inscribirse al Evento
        </button>
      )}
    </div>
  );
};

export default EventDetail;
