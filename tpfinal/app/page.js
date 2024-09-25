"use client";
import React from 'react';
import Home from "./components/Inicio"
import styles from './page.module.css';
const InicioSesion = () => {
  return (
    <div className={styles.container}>
      <Home/>
    </div>
  );
};

export default InicioSesion;