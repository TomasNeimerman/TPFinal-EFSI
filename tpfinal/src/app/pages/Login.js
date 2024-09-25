// src/pages/Login.js
"use client"
import { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías llamar a la API de autenticación.
    const userData = { name: 'Usuario Demo', email }; 
    login(userData);
    navigate('/');
  };

  return (
    <div className="login-page">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Contraseña" 
          required 
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
