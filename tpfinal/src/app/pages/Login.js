// src/pages/Login.js
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/form.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Home');
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
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            localStorage.setItem('Admin', response.data.isAdmin);
            navigate('/Home');
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
