import express from "express";
import EventLocationService from "./../servicios/event-location-service.js";
import AuthMiddleware from "../auth/AuthMiddleware.js";
import Validaciones from "../utils/validaciones-utils.js";

const eventlocationService = new EventLocationService();
const router = express.Router();
const validaciones = new Validaciones();

router.get("/", AuthMiddleware, async (req, res) => {
    try {
        const page = req.query.offset || 0;
        const pageSize = req.query.limit || 10;
        const eventLocations = await eventlocationService.getAllEventlocations(page, pageSize);
        return res.status(200).json(eventLocations.collection);
    } catch (error) {
        console.error("Error al obtener todas las localidades del evento:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.get("/:id", AuthMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        if (!await validaciones.existeObjeto("event_locations", id)) {
            return res.status(404).json({ message: "Event location del ID no encontrada" });
        }
        const eventLocation = await eventlocationService.getEventLocationById(id);
        return res.status(200).json(eventLocation);
    } catch (error) {
        console.error("Error al obtener la localidad del evento por ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post("/", AuthMiddleware, async (req, res) => {
  try {
      const { id_location, name, full_address, max_capacity, latitude, longitude } = req.body;
      const id_creator_user = req.user.id;

      // Validaciones
      if (!id_location || isNaN(parseInt(id_location))) {
          return res.status(400).json({ message: "ID de la ubicación inválido o no proporcionado" });
      }
      if (!name || name.length < 3) {
          return res.status(400).json({ message: "El nombre debe tener al menos 3 caracteres" });
      }
      if (!full_address || full_address.length < 3) {
          return res.status(400).json({ message: "La dirección debe tener al menos 3 caracteres" });
      }
      if (!max_capacity || isNaN(parseInt(max_capacity)) || max_capacity <= 0) {
          return res.status(400).json({ message: "Capacidad máxima inválida" });
      }

      const eventLocation = await eventlocationService.crearEventLocation(
          id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user
      );
      return res.status(200).json(eventLocation);
  } catch (error) {
      console.error("Error al crear la localidad del evento:", error);
      res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.put("/:id", AuthMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const { id_location, name, full_address, max_capacity, latitude, longitude } = req.body;
        const id_creator_user = req.user.id;

        const eventLocation = await eventlocationService.putEventLocation(
            id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user
        );
        return res.status(200).json(eventLocation);
    } catch (error) {
        console.error("Error al actualizar la localidad del evento:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.delete("/:id", AuthMiddleware, async (req, res) => {
  try {
      const id = req.params.id;
      if (!await validaciones.existeObjeto("event_locations", id)) {
          return res.status(404).json({ message: "Event Location del ID no encontrada" });
      }
      await eventlocationService.borrarEventLocation(id);
      return res.status(200).json({ message: "Event location eliminado correctamente" });
  } catch (error) {
      console.error("Error al eliminar la localidad del evento:", error);
      res.status(500).json({ message: "Error interno del servidor" });
  }
});


export default router;
