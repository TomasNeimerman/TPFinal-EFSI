import jwt from "jsonwebtoken";
import "dotenv/config";

export default async function encriptartoken(token) {
  const secretKey = "contraseña123";
  let payloadOriginal = null;

  try {
    payloadOriginal = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    console.error(error);
  }
  return payloadOriginal;
}
