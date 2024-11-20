// src/pages/EditorAdmin.js
"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
//import styles from "../styles/editor.module.css";

const EditorAdmin = () => {
  const { token } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "category" o "location"
  const [selectedItem, setSelectedItem] = useState(null); // Para editar
  const [formData, setFormData] = useState({}); // Contiene los datos del formulario

  const apiBaseUrl = "http://localhost:3508/api";

  useEffect(() => {
    // Verificar si el usuario es administrador
    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/user/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error("Error al verificar administrador:", error);
        setIsAdmin(false);
      }
    };

    // Cargar categorías y ubicaciones
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(`${apiBaseUrl}/event-category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categoriesResponse.data);

        const locationsResponse = await axios.get(`${apiBaseUrl}/event-location`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    checkAdmin();
    fetchData();
  }, [token]);

  const handleDelete = async (type, id) => {
    try {
      const endpoint = type === "category" ? "event-category" : "event-location";
      await axios.delete(`${apiBaseUrl}/${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (type === "category") {
        setCategories(categories.filter((category) => category.id !== id));
      } else {
        setLocations(locations.filter((location) => location.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleSave = async () => {
    try {
      const endpoint = modalType === "category" ? "event-category" : "event-location";

      let response;
      if (selectedItem) {
        // Actualización
        response = await axios.put(`${apiBaseUrl}/${endpoint}/${selectedItem.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Creación
        response = await axios.post(`${apiBaseUrl}/${endpoint}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (modalType === "category") {
        setCategories((prev) =>
          selectedItem
            ? prev.map((item) => (item.id === selectedItem.id ? response.data : item))
            : [...prev, response.data]
        );
      } else {
        setLocations((prev) =>
          selectedItem
            ? prev.map((item) => (item.id === selectedItem.id ? response.data : item))
            : [...prev, response.data]
        );
      }

      setShowModal(false);
      setSelectedItem(null);
      setFormData({});
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  if (!isAdmin) return <p>No tienes permisos para acceder a esta sección.</p>;

  return (
    <div className={styles.editorAdmin}>
      <h1>Editor de Administración</h1>

      <div className={styles.section}>
        <h2>Categorías</h2>
        <button onClick={() => openModal("category")}>Añadir Categoría</button>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.name} (Orden: {category.display_order})
              <button onClick={() => openModal("category", category)}>Editar</button>
              <button onClick={() => handleDelete("category", category.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Ubicaciones</h2>
        <button onClick={() => openModal("location")}>Añadir Ubicación</button>
        <ul>
          {locations.map((location) => (
            <li key={location.id}>
              {location.name} - {location.full_address} (Capacidad: {location.max_capacity})
              <button onClick={() => openModal("location", location)}>Editar</button>
              <button onClick={() => handleDelete("location", location.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <h2>{selectedItem ? "Editar" : "Crear"} {modalType === "category" ? "Categoría" : "Ubicación"}</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {modalType === "category" && (
            <input
              type="number"
              placeholder="Orden de Visualización"
              value={formData.display_order || ""}
              onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
            />
          )}
          {modalType === "location" && (
            <>
              <input
                type="text"
                placeholder="Dirección"
                value={formData.full_address || ""}
                onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
              />
              <input
                type="number"
                placeholder="Capacidad Máxima"
                value={formData.max_capacity || ""}
                onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
              />
            </>
          )}
          <button onClick={handleSave}>Guardar</button>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default EditorAdmin;
