import pg from "pg";
import { DBconfig } from "../../database/DB.js";

export default class UsersRepository {
  constructor() {
    const { Client } = pg;
    this.DBClient = new Client(DBconfig);
    this.DBClient.connect();
  }

  async crearUsuario(first_name, last_name, username, password) {
    await this.DBClient.query(`SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) FROM users) + 1);`);
    const sql = `INSERT INTO users (id, first_name, last_name, username, password)
                 VALUES (nextval('users_id_seq'), '${first_name}', '${last_name}', '${username}', '${password}')
                 RETURNING *;`;
    console.log(sql);
    const response = await this.DBClient.query(sql);
    console.log(`Usuario '${username}' creado correctamente`);
    return response.rows;
  }

  async usuarioExiste(username, password) {
    const sql = `SELECT * 
                 FROM users 
                 WHERE username = '${username}' 
                 AND password = '${password}';`;
    console.log(sql);
    const response = await this.DBClient.query(sql);
    
    if (response.rows.length === 0) {
      return false;
    } else {
      return response.rows;
    }
  }
}
