"use client"; // Asegura que este componente se ejecute en el cliente

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js'; 
import axios from 'axios';

const EventDetail = () => {
    const { id } = useParams();  // Obtener el ID del evento desde la URL
    const [evento, setEvento] = useState(null); // Guardar los detalles del evento
    const { token } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Cargar detalles del evento al montar el componente
    useEffect(() => {
        const fetchEventDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:3508/api/event/${id}`);
                setEvento(response.data); // Guardar los datos del evento en el estado
            } catch (error) {
                console.error('Error al cargar detalles del evento:', error);
                setError('Error al cargar los detalles del evento');
            }
        };

        fetchEventDetail();
    }, [id]);

    // Función para manejar la inscripción
    const handleInscription = async () => {
        console.log('Token:', token); // Verifica el token
        try {
            const response = await axios.post(
                `http://localhost:3508/api/event/${id}/enrollment`,
                {
                    description: '',
                    attended: false,
                    observations: '',
                    rating: null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Inscripción exitosa:', response.data);
        } catch (error) {
            console.error('Error al inscribirse al evento:', error.response ? error.response.data : error.message);
            setError('Error al inscribirse al evento');
        }
    };
    console.log(token)

    // Mostrar error si hubo un problema al cargar el evento
    if (error) return <div>{error}</div>;

    // Mostrar mensaje de carga mientras los detalles no se han obtenido
    if (!evento) return <div>Cargando detalles del evento...</div>;

    // Renderizar los detalles del evento
    return (
        <div>
            <h1>Detalles del Evento</h1>
            <p><strong>Nombre del Evento:</strong> {evento[id-1].name}</p>
            <p><strong>Descripción:</strong> {evento[id-1].description}</p>
            <p><strong>Duración (minutos):</strong> {evento[id-1].duration_in_minutes}</p>
            <p><strong>Asistencia Máxima:</strong> {evento[id-1].max_assistance}</p>
            <p><strong>Precio:</strong> ${evento[id-1].price}</p>
            <p><strong>Fecha de Inicio:</strong> {new Date(evento[id-1].start_date).toLocaleDateString()}</p>
            <p><strong>Inscripciones Habilitadas:</strong> {evento[id-1].enabled_for_enrollment ? 
                <button onClick={handleInscription}>Inscribirse</button> : 'No disponibles'}
            </p>
        </div>
    );
};

export default EventDetail;
