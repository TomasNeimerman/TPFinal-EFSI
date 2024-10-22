// src/app/pages/EventForm.js
"use client"; // Asegura que este componente se ejecute en el cliente

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.js';
import styles from '../styles/form.module.css';

const EventForm = () => {
  const token = localStorage.getItem('token') // Obtener token del contexto
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCategory, setEventCategory] = useState(''); // ID de la categoría seleccionada
  const [eventLocation, setEventLocation] = useState(''); // ID de la ubicación seleccionada
  const [startDate, setStartDate] = useState(''); // Nuevo campo para fecha de inicio
  const [duration, setDuration] = useState(''); // Nuevo campo para duración
  const [price, setPrice] = useState(''); // Nuevo campo para precio
  const [maxAssistance, setMaxAssistance] = useState(''); // Nuevo campo para asistencia máxima
  const [enabledForEnrollment, setEnabledForEnrollment] = useState(false); // Nuevo campo para habilitar inscripciones
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Estados para las opciones de categoría y ubicación
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  // Cargar categorías y ubicaciones al montar el componente
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const page = 0;
        const limit = 15;
        const response = await axios.get(`http://localhost:3508/api/event-location/?offset=${page}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de que el token esté definido
          },
        });
        console.log('Respuesta de la API:', response.data);
        setLocations(response.data); // Asignamos las ubicaciones
      } catch (error) {
        console.error('Error al cargar las ubicaciones:', error);
      }
    };
  
    fetchLocations();
  }, [token]);
  useEffect(() =>{
  const fetchCategories = async () => {
    try {
      const page = 0
      const limit = 15
      const response = await axios.get(`http://localhost:3508/api/event-category/?limit=${limit}&offset=${page}`);
      setCategories(response.data);
    }catch (error) {
      console.error('Error al cargar las categorías:', error);
    }
};

fetchCategories();
}, []);
     // Añadir dependencias como el token si es necesario


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3508/api/event',
        {
          name: eventName,
          description: eventDescription,
          id_event_category: eventCategory,
          id_event_location: eventLocation,
          start_date: startDate,
          duration_in_minutes: duration,
          price: price,
          enabled_for_enrollment: enabledForEnrollment,
          max_assistance: maxAssistance,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log('Evento creado con éxito');
        // Resetear el formulario si es necesario
        setEventName('');
        setEventDescription('');
        setEventCategory('');
        setEventLocation('');
        setStartDate('');
        setDuration('');
        setPrice('');
        setMaxAssistance('');
        setEnabledForEnrollment(false);
      } else {
        setError(response.data.message);
      }
      
    } catch (error) {
      console.error('Error al crear el evento:', error);
      setError('Error al crear el evento.');
    } finally{
      navigate('/Home')
    }
  };
  console.log(locations)
  console.log(categories)
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

        <label>Categoría del Evento:</label>
        <div className={styles.formGroup}>
          <select
            value={eventCategory}
            onChange={(e) => setEventCategory(e.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>
              {Array.isArray(categories) && categories.map((category) => (
              <option key={category.id} value={category.id}>
              {category.name}
              </option>
))}
          </select>
        </div>

        <label>Ubicación del Evento:</label>
        <div className={styles.formGroup}>
          <select
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            required
          >
            <option value="">Selecciona una ubicación</option>
            {Array.isArray(locations) && locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <label>Fecha de Inicio:</label>
        <div className={styles.formGroup}>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <label>Duración (en minutos):</label>
        <div className={styles.formGroup}>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <label>Precio:</label>
        <div className={styles.formGroup}>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <label>Máxima Asistencia:</label>
        <div className={styles.formGroup}>
          <input
            type="number"
            value={maxAssistance}
            onChange={(e) => setMaxAssistance(e.target.value)}
            required
          />
        </div>

        <label>
          <input
            type="checkbox"
            checked={enabledForEnrollment}
            onChange={(e) => setEnabledForEnrollment(e.target.checked)}
          />
          Habilitar Inscripción
        </label>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className={styles.submitButton}>
          Crear Evento
        </button>
      </form>
    </div>
  );
};

export default EventForm;
