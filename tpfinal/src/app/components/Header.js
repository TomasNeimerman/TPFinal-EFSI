// src/components/Header.js
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import Image from 'next/image';
import logo from '../img/logo.png'
import styles from './styles.module.css'


const Header = () => {
  

  return (
    <header className={styles.body}>
    <div className={styles.logo}>
      <Link to="/">
        <Image src={logo} alt="Logo" />
      </Link>
    </div>

    <nav>
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        <>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </>
      </ul>
    </nav>
  </header>
  );
};

export default Header;

/* <li className="flex items-center space-x-2">
              <span>{user.name}</span>
              <button onClick={logout} className="bg-red-500 p-2 rounded">Logout</button>
            </li>
           */