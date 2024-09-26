// src/pages/Home.js
"use client"
import React, { useState, useEffect } from 'react';
import Card from '../components/Card'
const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Simular llamada a API
    setEvents([
      { id: 1, title: 'Evento 1', description: 'Descripción del Evento 1', date: '2023-10-01' },
      { id: 2, title: 'Evento 2', description: 'Descripción del Evento 2', date: '2023-10-05' },
    ]);
  }, []);

  return (
    <div className="events-list">
      <h1>Listado de Eventos</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <Card titulo={event.title} descripcion={event.description} fecha={event.date}></Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
