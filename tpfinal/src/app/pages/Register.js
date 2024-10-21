// src/pages/Register.js
"use client";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de que estás usando react-router-dom
import styles from '../styles/form.module.css'

const Register = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inicializamos useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3508/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: name,
          last_name: lastName,
          username: email,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Usuario registrado:', data);
        // Redirigir a la página de login
        navigate('/'); // Asegúrate de que esta es la ruta correcta para Login.js
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      setError('Error en la conexión con el servidor');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Registro de Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.form}>
        <div className={styles.formGroup}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nombre"   
          required 
          
        />
        </div>
        <div className={styles.formGroup}>
        <input 
          type="text" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          placeholder="Apellido" 
          required 
          
        />
        </div>
        <div className={styles.formGroup}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Correo Electrónico" 
          required 
          className={styles.formGroup}
        />
        </div>
        <div className={styles.formGroup}>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Contraseña" 
          required
          className={styles.formGroup} 
        />
        </div>
        <div className={styles.formGroup}>
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirmar Contraseña" 
          required 
          className={styles.formGroup}
        />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className={styles.submitButton}>Registrarse</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
