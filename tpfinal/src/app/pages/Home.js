// pages/Home.js
import React from 'react';
import EventosList from '../components/EventosList';
import styles from '../styles/home.module.css'

const Home = () => {
    return (
        <div>
            <h1 className={styles.title}>Eventos</h1>
            <EventosList />
        </div>
    );
};

export default Home;
