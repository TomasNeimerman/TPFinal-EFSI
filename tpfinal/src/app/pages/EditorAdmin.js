"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/editor.module.css";

const EditorAdmin = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("Admin") === "true"; // Verificar directamente en localStorage
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "category" o "location"
  const [selectedItem, setSelectedItem] = useState(null); // Para editar
  const [formData, setFormData] = useState({}); // Contiene los datos del formulario

  const apiBaseUrl = "http://localhost:3508/api";

  useEffect(() => {
    if (!isAdmin) return; // Si no es admin, no intentar cargar los datos

    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(`${apiBaseUrl}/event-category`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 10, offset: 0 }, // Enviar valores predeterminados
        });
        setCategories(categoriesResponse.data);

        const locationsResponse = await axios.get(`${apiBaseUrl}/event-location`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 10, offset: 0 }, // Enviar valores predeterminados
        });
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("Hubo un error al cargar los datos. Por favor, intenta nuevamente.");
      }
    };

    fetchData();
  }, [token, isAdmin]);

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
      alert("Hubo un error al eliminar el elemento. Por favor, intenta nuevamente.");
    }
  };

  const handleSave = async () => {
    try {
      console.log("Botón 'Guardar' presionado");
      console.log("Datos del formulario:", formData);

      // Validaciones de datos
      if (!formData.name || formData.name.trim().length < 3) {
        console.error("Nombre inválido. Debe tener al menos 3 caracteres.");
        alert("El nombre debe tener al menos 3 caracteres.");
        return;
      }
      if (modalType === "location" && (!formData.full_address || formData.full_address.trim().length < 3)) {
        console.error("Dirección inválida.");
        alert("La dirección debe tener al menos 3 caracteres.");
        return;
      }
      if (modalType === "location" && (!formData.max_capacity || formData.max_capacity <= 0)) {
        console.error("Capacidad máxima inválida.");
        alert("La capacidad máxima debe ser mayor a 0.");
        return;
      }

      const endpoint = modalType === "category" ? "event-category" : "event-location";
      let response;

      if (selectedItem) {
        console.log("Modo: Editar");
        response = await axios.put(`${apiBaseUrl}/${endpoint}/${selectedItem.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        console.log("Modo: Crear");
        response = await axios.post(`${apiBaseUrl}/${endpoint}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      console.log("Respuesta del servidor:", response.data);

      // Actualizar estado local con los nuevos datos
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

      // Cerrar modal y reiniciar estado
      setShowModal(false);
      setSelectedItem(null);
      setFormData({});
      console.log("Guardado exitoso y modal cerrado");
    } catch (error) {
      console.error("Error en handleSave:", error.response?.data || error.message);
      alert("Hubo un error al guardar. Verifica los datos ingresados y vuelve a intentar.");
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
