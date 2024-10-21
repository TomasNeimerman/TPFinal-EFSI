import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
    const { id } = useParams();  // Obtener el ID del evento desde la URL
    const [evento, setEvento] = useState(null); // Guardar la información del evento
    const [error, setError] = useState(null);

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

    if (error) return <div>{error}</div>;
    if (!evento) return <div>Cargando detalles del evento...</div>;

    return (
        <div>
            <h1>Detalles del Evento</h1>
            <p><strong>Nombre del Evento:</strong> {evento[0].name}</p>
            <p><strong>Descripción:</strong> {evento[0].description}</p>
            <p><strong>Duración (minutos):</strong> {evento[0].duration_in_minutes}</p>
            <p><strong>Inscripciones Habilitadas:</strong> {evento[0].enabled_for_enrollment ? 'Sí' : 'No'}</p>

        </div>
    );
};

export default EventDetail;