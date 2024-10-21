// Importa la función de verificación de token
import DecryptToken from "../auth/encriptartoken.js";

// Define el middleware de autorización
export default function authorization(req, res, next) {
    if (!req.headers.authorization) {
        res.status(401).send('forbidden');
    } else {
        const token = req.headers.authorization.split(' ')[1]; // Obtén el token de la cabecera de autorización
        DecryptToken(token)
            .then(payload => {
                if (payload != null) {
                    req.user = payload; 
                    next();
                } else {
                    res.status(401).send("Error con el Token");
                }
            })
            .catch(error => {
                console.error("Error durante la verificación del token:", error);
                res.status(401).send("Error con el Token");
            });
    }
}
