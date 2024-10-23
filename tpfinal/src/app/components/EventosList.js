// components/EventosList.js
"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from './Carousel.js';

const EventosList = () => {
    const [eventos, setEventos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const page = 0; // Página inicial
                const limit = 10; // Número de eventos por página
                const response = await axios.get(`http://localhost:3508/api/event/?offset=${page}&limit=${limit}`);
                setEventos(response.data.collection || []); 
            } catch (error) {
                console.error('Error al cargar eventos:', error);
                setError('Error al cargar eventos');
            }
        };

        fetchEventos();
    }, []);

    if (error) return <div>{error}</div>;
    if (!eventos.length) return <div>No hay eventos disponibles</div>;

    return (
        <div>
            <Carousel eventos={eventos} />
        </div>
    );
};

export default EventosList;
