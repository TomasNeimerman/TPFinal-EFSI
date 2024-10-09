// components/EventosList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventosList = () => {
    const [eventos, setEventos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                // Definimos los parámetros de paginación (puedes ajustarlos según tus necesidades)
                const page = 0; // Página inicial
                const limit = 10; // Número de eventos por página
                const response = await axios.get(`http://localhost:3508/api/event/?offset=${page}&limit=${limit}`);
                setEventos(response.data.collection || []); // Asegúrate de acceder a la colección de eventos
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
       
    );
};

export default EventosList;
