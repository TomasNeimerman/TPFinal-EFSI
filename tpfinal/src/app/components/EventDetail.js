import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/detail.module.css'

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
    <div className={styles.header}>
      <h1>Detalle del evento</h1>
    </div>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>{evento.name}</h2>
          <p><strong>Descripción:</strong> {evento.description}</p>
          <p><strong>Duración:</strong> {evento.duration_in_minutes} minutos</p>
          <p><strong>Capacidad:</strong> {capacity}</p>
          <p><strong>Localidad:</strong> {evento.location}</p>
          <p><strong>Categoría:</strong> {evento.category}</p>
          <p><strong>Inscriptos:</strong> {currentEnrolled}</p>
  
          {isEnrolled ? (
            <button onClick={handleUnenroll} className={ styles.unenrollbutton}>
              Desinscribirse
            </button>
          ) : (
            <button onClick={handleEnroll} className={styles.enrollbutton}>
              Inscribirse
            </button>
          )}
        </div>
      </div>
      </div>
  
  );
};

export default EventDetail;
