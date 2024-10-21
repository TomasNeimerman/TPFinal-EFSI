"use client"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetail from './components/EventDetail';
import EventForm from './pages/EventForm';
import { AuthProvider } from '../context/AuthContext.js'; // Importa el AuthProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/event-form" element={<EventForm />} /> {/* Formulario de eventos */}
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
