import jwt from "jsonwebtoken";
import "dotenv/config";

export default async function generarToken(usuario) {
    
    const options = {
        expiresIn: "1h", 
        issuer: "Fede_Simon",
    };
    
    const payload = {
        id: usuario[0].id,
        username: usuario[0].username,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, options);
    return token;
}
