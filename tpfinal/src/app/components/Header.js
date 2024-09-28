// src/components/Header.js
import { Link } from 'react-router-dom';
import Image from 'next/image';
import logo from '../img/logo.png';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'Usuario'; // Obtener el nombre de usuario de localStorage

  const logout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    localStorage.removeItem('username'); // Eliminar el nombre de usuario
    navigate('/'); // Redirigir al login
  };

  return (
    <header className={styles.body}>
      <div className={styles.logo}>
        <Link to="/">
          <Image src={logo} alt="Logo" />
        </Link>
      </div>

      <nav>
        <ul className={styles.navLinks}>
          <li><Link to="/Home">Home</Link></li>
          {!token ? (
            <>
              <li><Link to="/">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <li className="flex items-center space-x-2">
              <span>Bienvenido, {username}</span>
              <button onClick={logout} className="bg-red-500 p-2 rounded">Cerrar sesión</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
