import jwt from 'jsonwebtoken';
import UsersRepository from '../repositories/users-repository.js';  

export default class UsersService {
    crearUsuario = async (first_name, last_name, username, password) => {
      const repo = new UsersRepository();
      return await repo.crearUsuario(first_name, last_name, username, password);
    }
  
    recibirToken = async (username, password) => {
      const repo = new UsersRepository();
      const validarUsuario = await repo.usuarioExiste(username, password); 
      if (validarUsuario) {
        const token = this.generarToken(validarUsuario[0].id, validarUsuario[0].username); 
        return [token.token, validarUsuario[0].username];  // Asegúrate de que estás pasando el username correcto
      } else {
        return false;
      }
  }
      generarToken = (id, username) => {
        const payload = { id, username };
        const secretKey = 'UmDoisTreisTriesDoisUmoTodoMundoSobreDoisRaizEmCadaUno';
        const options = { expiresIn: "4 Hours", issuer: 'santiago' };
        return jwt.sign(payload, secretKey, options);
      }
      validarMail = (email) => {
        const regex = /^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return regex.test(email);
      }
    
}
