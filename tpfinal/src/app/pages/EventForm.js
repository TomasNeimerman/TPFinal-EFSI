// src/app/pages/EventForm.js
"use client"; // Asegura que este componente se ejecute en el cliente

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.js';
import styles from '../styles/form.module.css';

const EventForm = () => {
  const { token } = useContext(AuthContext);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3508/api/event',
        {
          name: eventName,
          description: eventDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log('Evento creado con éxito');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error al crear el evento:', error);
      setError('Error al crear el evento.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Nombre del Evento:</label>
        <div className={styles.formGroup}>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <label>Descripción del Evento:</label>
        <div className={styles.formGroup}>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className={styles.submitButton}>
          Crear Evento
        </button>
      </form>
    </div>
  );
};

export default EventForm;
