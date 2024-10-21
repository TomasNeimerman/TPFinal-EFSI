import express from "express";
import EventsService from "../servicios/events-service.js";
import { authMiddleware } from "../utils/auth-utils.js";
import Validaciones from "../utils/validaciones-utils.js";

const router = express.Router();
const eventsService = new EventsService();
const validaciones = new Validaciones();

// punto 2 y 3
// events-controller.js
router.get("/", async (request, response) => {
  const pageSize = request.query.limit || 10;
  const page = request.query.offset || 0; 
  const name = request.query.name || null; 
  const category = request.query.category || null; 
  const startDate = request.query.startDate || null; 
  const tag = request.query.tag || null; 

  try {
      const BusquedaEvent = await eventsService.BusquedaEvento(
          name,
          category,
          startDate,
          tag,
          page,
          pageSize
      );
      return response.status(200).json(BusquedaEvent);
  } catch (error) {
      console.error(error);
      return response.status(500).json("Error en la búsqueda de eventos");
  }
});



//punto 4
router.get("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const detalleEvento = await eventsService.DetalleEvento(id);

    if (!detalleEvento) {
      return response.status(404).json({ message: "No se encontró evento con el ID" });
    }

    return response.status(200).json(detalleEvento); // Asegúrate de que devuelve un solo objeto
  } catch (error) {
    console.error('Error al cargar los detalles del evento:', error);
    return response.status(500).json({ message: "Error al procesar la solicitud" });
  }
});

//punto 5
router.get("/:id/enrollment", async(request, respose) => {
  const id = request.params.id
  const first_name = request.query.first_name
  const last_name = request.query.last_name
  const username = request.query.username
  const attended = request.query.attended
  const rating = request.query.rating
  const pageSize = 10
  const page = 0
      try{
          const usuario = await eventsService.listaUsuarios(id, first_name, last_name, username, attended, rating, pageSize, page)
          if(usuario){
              return respose.json(usuario)
          } else{
              return respose.json("No se encontro al usuario")
          }
      }catch(error){
          console.error(error)
          return respose.json("Sad papu :V")
      }
    })

//punto 8
router.post("/", authMiddleware, async (request, response) => {
  try {
    const name = request.body.name;
    const description = request.body.description;
    const id_event_category = request.body.id_event_category;
    const id_event_location = request.body.id_event_location;
    const start_date = request.body.start_date;
    const duration_in_minutes = request.body.duration_in_minutes;
    const price = request.body.price;
    const enabled_for_enrollment = request.body.enabled_for_enrollment;
    const max_assistance = request.body.max_assistance
    const id_creator_user = request.user.id
    if(await validaciones.menor3(name)){
      response.status(400).json({message: "name vacio o menor a 3 caracteres"})
    } else if(await validaciones.menor3(description)){
      response.status(400).json({message: "description vacio o menor a 3 caracteres"})
    }else if(await validaciones.asistenciaMayorACapacidad(max_assistance, id_event_location)){
      response.status(400).json({message: "max_assistance supera max capacity"})
    }else if(price<0 || duration_in_minutes<0){
      response.status(400).json({message: "price o duration_in_minutes menor a 0"})
    }else{
    const nuevoEvent = await eventsService.crearEvent(name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user);
    response.status(201).json(nuevoEvent);
    }
  } catch (error) {
    console.error("Error al crear el evento:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});
router.put("/:id", authMiddleware, async (request, response) => {
  try {
    const id = request.params.id;

  const name = request.body.name;
  const description = request.body.description;
  const id_event_category = request.body.id_event_category;
  const id_event_location = request.body.id_event_location;
  const start_date = request.body.start_date;
  const duration_in_minutes = request.body.duration_in_minutes;
  const price = request.body.price;
  const enabled_for_enrollment = request.body.enabled_for_enrollment;
  const max_assistance = request.body.max_assistance
  const id_creator_user = request.user.id
  if (!await validaciones.existeObjeto(`events`, id)) {
    return response.status(404).json({ message: "No se encontró evento con el ID" });
  }else if(await validaciones.menor3(name)){
    response.status(400).json({message: "name vacio o menor a 3 caracteres"})
  } else if(await validaciones.menor3(description)){
    response.status(400).json({message: "description vacio o menor a 3 caracteres"})
  }else if(await validaciones.asistenciaMayorACapacidad(max_assistance, id_event_location)){
    response.status(400).json({message: "max_assistance supera max capacity"})
  }else if(price<0 || duration_in_minutes<0){
    response.status(400).json({message: "price o duration_in_minutes menor a 0"})
  }else{
    const updatedEvent = await eventsService.putEvent(id, name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user);
    response.status(200).json(updatedEvent);
  }
  } catch (error) {
    console.error("Error al editar el evento:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
  });
router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    const id = request.params.id;
    if (await !validaciones.existeObjeto(`events`, id)) {
      return response.status(404).json({ message: "No se encontró evento con el ID" });
    }else if(await validaciones.min1Usuario(id)){
      return response.status(404).json({message: "Hay minimo 1 usuario registrado al evento"})
    }
    else{
      await eventsService.borrarEvent(id);
      return response.status(200).json({message: "se elimino correctamente"});
    }
  } catch (error) {
    console.error("Error al eliminar el evento:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

//punto 9

router.post("/:id/enrollment", authMiddleware, async (request, response) => {
  const id_event = request.params.id
  const id_user = request.user.id
  const description = request.query.description
  const attended = request.query.attended
  const observations = request.query.observations
  const rating = request.params.entero
  const registration_date_time = await eventsService.conseguirHora()
  try {
      const nuevoEnrollment = await eventsService.registerUser(id_event, id_user, description, attended, observations, rating, registration_date_time);
      response.status(201).json(nuevoEnrollment);
    
  } catch (error) {
    console.error("Error al crear el evento:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

router.delete("/:id/enrollment", authMiddleware, async (request, response) => {
  const id_event = request.params.id
  const id_user = request.user.id
  try {
      const eliminado = await eventsService.unregisterUser(id_event, id_user);
      response.status(200).json({message: "Se elimino correctamente", ...eliminado});
  } catch (error) {
    console.error("Error al crear el evento:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get("/:id/enrollment", authMiddleware, async (req, res) => {
  const id_event = req.params.id;
  const id_user = req.user.id;

  try {
    const isEnrolled = await eventsService.isUserEnrolled(id_event, id_user);
    res.status(200).json({ isEnrolled });
  } catch (error) {
    console.error("Error al verificar inscripción:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//punto 10
router.patch("/:id/enrollment/:rating", authMiddleware, async (request, response) => {
 
    try {
      const { id, rating } = request.params;
      const event = await eventsService.getEventById(`events`, id);
      if (!await validaciones.existeObjeto()){
        return response.status(404).json({ message: "No se encontró evento con el ID" });
      } else {
        const rate = eventsService.ratingEvento(id, rating);
        response.status(200).json(rate);
      }
    } catch (error) {
      console.error("Error al registrar el rating del evento:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

export default router;
