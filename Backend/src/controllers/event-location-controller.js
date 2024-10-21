import express from "express";
import EventLocationService from "./../servicios/event-location-service.js";
import AuthMiddleware from "../auth/AuthMiddleware.js"; 
import Validaciones from "../utils/validaciones-utils.js";
const eventlocationService = new EventLocationService();
const router = express.Router();
const validaciones = new Validaciones();

router.get("/:id", AuthMiddleware, async (request, response) => {
    try {
      const id = request.params.id;
      if(!await validaciones.existeObjeto(`event_locations`, id)){
        return response.status(404).json({message: "Event location del ID no encontrada"})
      }else{
        const eventLocations = await eventlocationService.getEventLocationById(id);
      return response.status(200).json(eventLocations);
      }
    } catch (error) {
      console.error("Error al obtener las localidades del evento por ID:", error);
      return response.status(500).json({ message: "Error interno del servidor" });
    }
  });
router.get("/", AuthMiddleware, async (request, response) => {
    try {
      const page = request.query.offset;
      const pageSize = request.query.limit
      const eventLocations = await eventlocationService.getAllEventlocations(page, pageSize);
      return response.status(200).json(eventLocations);
    } catch (error) {
      console.error("Error al obtener todas las localidades del evento:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  });
  router.post("/", AuthMiddleware, async (request, response) => {
    try {
      const id_location = request.body.id_location;
      const name = request.body.name;
      const full_address = request.body.full_address;
      const max_capacity = request.body.max_capacity;
      const latitude = request.body.latitude;
      const longitude = request.body.longitude;
      const id_creator_user = request.user.id;
      if (!await validaciones.existeObjeto(`locations`, id_location)) {
        return response.status(404).json({ message: "Location del ID no encontrada" });
      } else if (await validaciones.menor3(name)) {
        return response.status(400).json({ message: "Name vacio o menor a 3" });
      } else if (await validaciones.menor3(full_address)) {
        return response.status(400).json({ message: "adress vacio o menor a 3" });
      } else if (max_capacity <= 0) {
        return response.status(400).json({ message: "Max capacity igual o menor a 0" });
      } else {
        const eventLocations = await eventlocationService.crearEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
        return response.status(200).json(eventLocations);
      }
    } catch (error) {
      console.error("Error al obtener todas las localidades del evento:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  });
  router.post("/", AuthMiddleware, async (request, response) => {
    try {
        const id = request.params.id;
      const id_location = request.body.id_location;
      const name = request.body.name;
      const full_address = request.body.full_address;
      const max_capacity = request.body.max_capacity;
      const latitude = request.body.latitude;
      const longitude = request.body.longitude;
      const id_creator_user = request.user.id;
      if (!await validaciones.existeObjeto(`locations`, id_location)) {
        return response.status(404).json({ message: "Location del ID no encontrada" });
      } else if (await validaciones.menor3(name)) {
        return response.status(400).json({ message: "Name vacio o menor a 3" });
      } else if (await validaciones.menor3(full_address)) {
        return response.status(400).json({ message: "adress vacio o menor a 3" });
      } else if (max_capacity <= 0) {
        return response.status(400).json({ message: "Max capacity igual o menor a 0" });
      } else {
        const eventLocations = await eventlocationService.putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
        return response.status(200).json(eventLocations);
      }
    } catch (error) {
      console.error("Error al obtener todas las localidades del evento:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  });
  router.delete("/:id", async (request, response) => {
    try {
      const id = request.params.id;
      if(!await validaciones.existeObjeto(`event_locations`, id)){
        return response.status(404).json({message: "Event Location del ID no encontrada"})
      }else{
      await eventlocationService.borrarEventLocation(id);
      return response.status(200).json({message: "event location eliminado correctamente"});
    }
    } catch (error) {
      console.error("Error al eliminar el event location:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  });
  
  
export default router;