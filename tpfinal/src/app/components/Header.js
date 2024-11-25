import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Image from 'next/image';
import logo from '../img/logo.png';
import styles from '../styles/styles.module.css';

const Header = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username') || 'Usuario';

    useEffect(() => {
        const adminStatus = localStorage.getItem('Admin') === 'true'; // Verifica si es admin
        setIsAdmin(adminStatus);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('Admin');
        navigate('/');
    };

    return (
        <header className={styles.body}>
            <div className={styles.leftSection}>
                <div className={styles.logo}>
                    <Link to="/Home">
                        <Image src={logo} alt="Logo" />
                    </Link>
                </div>
                {token && isAdmin && (
                    <div className={styles.adminLink}>
                        <Link to="/Admin">Administración</Link>
                    </div>
                )}
                {token && (
                    <div className={styles.createEventLink}>
                        <Link to="/event-form">Crear Evento</Link>
                    </div>
                )}
            </div>
            <nav>
                <ul className={styles.navLinks}>
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
