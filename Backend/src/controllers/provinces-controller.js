import express from "express";
import ProvinceService from './../servicios/provinces-service.js';
import Validaciones from "../utils/validaciones-utils.js";
const provinceService = new ProvinceService();
const router = express.Router();
const validaciones = new Validaciones();
//Punto 7
router.post("/", async (request, response) => {
  try {
    const name = request.body.name;
    const fullName = request.body.full_name;
    const latitude = request.body.latitude;
    const longitude = request.body.longitude;
    const display_order = request.body.display_order
   
    if(await validaciones.menor3(name)){
      response.status(400).json({message: "name vacio o menor a 3 caracteres"})
    }else if(isNaN(latitude) || isNaN(longitude)){
      response.status(400).json({message: "latitude o longitude no son numeros"})}
      else{
    const newProvince = await provinceService.crearProvince(name, fullName, latitude, longitude, display_order);
    response.status(201).json(newProvince);
    }
  } catch (error) {
    console.error("Error al crear la provincia:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }});

  router.get("/", async (request, response) => {
    try {
      const pageSize = request.query.limit;
      const page = request.query.offset;
      const provinces = await provinceService.getAllProvinces(pageSize, page);
      response.json(provinces);
    } catch (error) {
      console.error("Error al obtener todas las provincias:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  });

  router.get("/:id", async (request, response) => {
    try {
      const id = request.params.id;
     
      if (!await validaciones.existeObjeto(`provinces`, id)) {
        return response.status(404).json({ message: "Provincia del ID no encontrada" });
      }else{
      const province = await provinceService.getProvinceById(id);
      return response.status(200).json(province);
      }
    } catch (error) {
      console.error("Error al obtener la provincia por ID:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  });

  router.get("/:id/locations", async (request,response)=>{
    try {
 
      const pageSize = request.query.limit;
      const page = request.query.offset;
      const id = request.params.id;
      if (await !validaciones.existeObjeto(`provinces`, id)) {
        response.status(404).json({ message: "Provincia del ID no encontrada" });
      }else{
      const locationsArray = await provinceService.getAllLocationsByProvinceId(id, pageSize, page);
      response.status(200).json(locationsArray);
      }
    } catch (error) {
      console.error("Error al obtener la provincia por ID:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  });

  router.put("/:id", async (request, response) => {
    try {
      const id = request.params.id;
      const name = request.query.name;
  
      const fullName = request.query.full_name;

      const latitude = request.query.latitude;
 
      const longitude = request.query.longitude;
    
      if(await !validaciones.existeObjeto(`provinces`, id)){
        response.status(404).json({message: "No existe la provincia del ID"})
      }
      if(await validaciones.menor3(name)){
        response.status(400).json({message: "name vacio o menor a 3 caracteres"})
      }else if(isNaN(latitude) || isNaN(longitude)){
        response.status(400).json({message: "latitude o longitude no son numeros"})}
        else{
        const updatedProvince = await provinceService.putProvince(id, name, fullName, latitude, longitude);
        response.status(200).json(updatedProvince);
      }
    } catch (error) {
      console.error("Error al editar la provincia:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  });
  

  router.delete("/:id", async (request, response) => {
    try {
      const id = request.params.id;
      if(await !validaciones.existeObjeto(`provinces`, id)){
        response.status(404).json({message: "ID no encontrado"})}
        else{
      await provinceService.borrarProvince(id);
      response.status(200).json({message: "se elimino correctamente"});
    }
    } catch (error) {
      console.error("Error al eliminar la provincia:", error);
      response.status(500).json({ message: "Error interno del servidor" });
    }
  });


export default router;
