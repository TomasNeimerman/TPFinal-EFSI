// src/pages/Register.js
"use client"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Aquí deberías hacer la llamada a la API de registro
    // Simulamos el registro exitoso
    const userData = { name, email }; // Simular creación de usuario en backend

    // Simular que el usuario ha sido registrado
    console.log('Usuario registrado:', userData);

    // Navegar a la página de inicio (home) después de registrarse
    navigate('/');
  };

  return (
    <div className="register-page">
      <h1>Registro de Usuario</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nombre" 
          required 
        />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Correo Electrónico" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Contraseña" 
          required 
        />
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirmar Contraseña" 
          required 
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
