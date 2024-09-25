// src/components/Header.js
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import Image from 'next/image';



const Header = () => {
  

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="logo">
        <Image src={logo}></Image>
        <Link to="/">Eventos</Link>
      </div>
      <nav>
        <ul className="flex space-x-4">
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