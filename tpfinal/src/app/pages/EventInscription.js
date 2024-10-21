// src/app/pages/EventSubscriptionForm.js
"use client"; // Asegura que este componente se ejecute en el cliente

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js'; // Contexto para obtener el token
import styles from '../styles/form.module.css';

const EventSubscriptionForm = () => {  
const { id } = useParams();
  const { token } = useContext(AuthContext); // Obtener el token de autenticación
  const [events, setEvents] = useState([]); // Lista de eventos disponibles
  const [selectedEvent, setSelectedEvent] = useState(''); // ID del evento seleccionado
  const [description, setDescription] = useState(''); // Descripción opcional
  const [observations, setObservations] = useState(''); // Observaciones opcionales
  const [rating, setRating] = useState(0); // Valoración opcional
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar los eventos disponibles al montar el componente
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3508/api/events/${id}`); // Asumiendo que esta es la ruta para obtener los eventos
        setEvents(response.data); // Suponiendo que la respuesta es un array de eventos
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
        setError('Error al cargar los eventos.');
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedEvent) {
      setError('Debe seleccionar un evento.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3508/api/event/${selectedEvent}/enrollment`, // Ruta para inscribirse al evento
        {
          description, // Descripción opcional
          attended: false, // Se puede ajustar según la lógica de negocio
          observations, // Observaciones opcionales
          rating: rating > 0 ? rating : null, // Valoración opcional
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Autenticación
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage('Inscripción realizada con éxito.');
        // Limpiar el formulario
        setDescription('');
        setObservations('');
        setRating(0);
        setSelectedEvent('');
      } else {
        setError('Error al realizar la inscripción.');
      }
    } catch (error) {
      console.error('Error al inscribirse en el evento:', error);
      setError('Error al inscribirse en el evento.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Formulario de Inscripción a Evento</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <label>Selecciona un Evento:</label>
        <div className={styles.formGroup}>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
          >
            <option value="">Selecciona un evento</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        <label>Descripción (opcional):</label>
        <div className={styles.formGroup}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <label>Observaciones (opcional):</label>
        <div className={styles.formGroup}>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </div>

        <label>Valoración (opcional):</label>
        <div className={styles.formGroup}>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="0"
            max="5"
            placeholder="0 a 5"
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Inscribirse
        </button>
      </form>
    </div>
  );
};

export default EventSubscriptionForm;
