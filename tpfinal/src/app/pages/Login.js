// src/pages/Login.js
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Usamos useNavigate
import styles from '../styles/form.module.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inicializa el enrutador

  useEffect(() => {
    // Verifica si ya hay un token en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Home'); // Redirige a la lista de eventos si ya está logueado
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3508/api/user/login', {
        username,
        password,
      });
      
      if (response.data.success) {
        // Guardar token y nombre de usuario en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        navigate('/Home'); // Redirige a la lista de eventos
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error al intentar iniciar sesión.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleLogin} className={styles.form}>
        <label>Nombre de Usuario:</label>
        <div className={styles.formGroup}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <label>Contraseña:</label>
        <div className={styles.formGroup}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className={styles.submitButton}>Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
