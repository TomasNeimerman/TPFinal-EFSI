// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Usamos useNavigate

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inicializa el enrutador

  useEffect(() => {
    // Verifica si ya hay un token en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Redirige a la página principal si ya está logueado
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
        localStorage.setItem('username', response.data.username);
        navigate('/home'); // Redirige a la página de inicio
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error al intentar iniciar sesión.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Nombre de Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default Login;
