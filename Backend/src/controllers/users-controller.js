import express, { response } from "express";
import UsuarioServicios from "../servicios/users-service.js";
import generarToken from "../auth/token.js"; 
import AuthMiddleware from "../auth/AuthMiddleware.js"; 

const router = express.Router();
const usuarioServicios = new UsuarioServicios();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const usuario = await usuarioServicios.login(username, password);
        if (usuario == 400) {
            res.statusCode = usuario;
            return res.json("Usuario Invalido");
        } else if (usuario == 401) {
            res.statusCode = usuario;
            return res.json("Contraseña Invalida");
        } else {
            const token = await generarToken(usuario);
            console.log(usuario[0].admin + " admin")
            return res.json({
                success: true,
                message: "",
                token: token,
                isAdmin: usuario[0].admin, // Incluye el estado de admin
                
            });
            
        }
        
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error.message);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
            token: "",
        });
    }
});

router.post("/register", async (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    const cheq = await usuarioServicios.cheqUser(first_name, last_name, username, password)
    if(cheq != true){
        return res.json(cheq)
    }
    try {
        const resultadoRegistro = await usuarioServicios.register(first_name, last_name, username, password);
        res.statusCode = 201
        return res.json({
            success: true,
            message: resultadoRegistro.message,
            userId: resultadoRegistro.userId
        });
    } catch (error) {
        console.error("Error durante el registro de usuario:", error.message);
        res.statusCode = 500
        return res.json({
            success: false,
            message: error.message
        });
    }
});

router.get("/", AuthMiddleware, async (req, res) => {
    try {
        const usuario = req.user;
        return res.json(usuario);
    } catch (error) {
        console.error("Error al obtener la información del usuario:", error.message);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/isAdmin", AuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = await usuarioServicios.isAdmin(userId);
        if (isAdmin) {
            return res.status(200).json({ isAdmin: true });
        }
        return res.status(403).json({ isAdmin: false, message: "El usuario no es admin" });
    } catch (error) {
        console.error("Error al verificar si el usuario es admin:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


export default router;
