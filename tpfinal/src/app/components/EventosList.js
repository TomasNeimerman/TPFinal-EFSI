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
        <div>
            {eventos.map((evento, index) => (
                <div key={evento.id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Evento: {index + 1}</div> {/* Número de evento */}
                    
                    <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>Nombre:</div>
                    <div>{evento.name}</div>

                    <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>Descripción:</div>
                    <div>{evento.description}</div>

                    <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' }}>Categorías:</div>
                    <div>{evento.event_category.name}</div> {/* Cambié a la estructura correcta */}
                    
                    {/* Puedes agregar más campos de evento aquí siguiendo el mismo patrón */}
                </div>
            ))}
        </div>
    );
};

export default EventosList;
