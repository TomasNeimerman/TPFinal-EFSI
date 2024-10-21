import express from "express";
import UsersService from "./../servicios/users-service.js";
import Validaciones from "../utils/validaciones-utils.js";
const usersService = new UsersService();
const router = express.Router();
const validaciones = new Validaciones();
//punto 6
router.post("/login", async (request, response) => {
  try {
    const username = request.body.username;
    const password = request.body.password;
    if (!await usersService.validarMail(username)) {
      response.status(400).json({
        success: false,
        message: "El email es invalido.",
        token: ""
      });
    } else {
      const login = await usersService.recibirToken(username, password); 
      if (login) {
        response.status(200).json({
          success: true,
          message: "Inicio correcto",
          token: login[0],       
          username: login[1]  
        });
      } else {
        response.status(401).json({
          success: false,
          message: "Usuario o clave invalida",
          token: "",
        });
      }
    }
  } catch (error) {
    console.error("Error al crear algo", error);
    return response.status(500).json({ message: "Error interno del servidor" });
  }
});


router.post("/register", async (request, response) => {
  try {
    const { first_name, last_name, username, password } = request.body;

    // Validaciones
    if (!await usersService.validarMail(username)) {
      return response.status(400).json({ message: "Username(email) no válido." });
    }
    if (await validaciones.menor3(first_name)) {
      return response.status(400).json({ message: "Nombre vacío o menor a 3 caracteres" });
    }
    if (await validaciones.menor3(last_name)) {
      return response.status(400).json({ message: "Apellido vacío o menor a 3 caracteres" });
    }
    if (await validaciones.menor3(password)) {
      return response.status(400).json({ message: "Contraseña vacía o menor a 3 caracteres" });
    }

    // Creación del usuario
    await usersService.crearUsuario(first_name, last_name, username, password);
    response.status(201).json({ message: "Usuario creado correctamente" });
    
  } catch (error) {
    console.error("Error al crear usuario", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
