import pg from 'pg';
import { DBconfig } from '../../database/DB.js';

export default class Bd {
    constructor() {
        const {Client} = pg;
        this.client = new pg.Client(DBconfig);
        this.client.connect();
    }

    async autenticarUsuario(username, password) {
        const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        try {
            const respuesta = await this.client.query(sql);
            console.log("Usuario " + username + " correcto");
            return respuesta.rows; 
        } catch (error) {
            console.error("Error al autenticar usuario:", error);
            throw new Error("Error al autenticar usuario");
        }
    }

    async autenticarRegistro(first_name, last_name, username, password) {
        const num = await this.cantUsuarios()
        let id = parseInt(num[0].count)
        const sql = `INSERT INTO users (id, first_name, last_name, username, password, admin)
            VALUES ('${id+1}', '${first_name}', '${last_name}', '${username}', '${password}', 'false')
            RETURNING id`;
            console.log(sql)
        try {
            const respuesta = await this.client.query(sql);
            return respuesta.rows[0].id;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw new Error("Error al registrar usuario");
        }
    }

    async buscarUsuarioPorUsername(username) {
        const sql = `SELECT * FROM users WHERE username = '${username}' `
        try {
            const respuesta = await this.client.query(sql);
            return respuesta.rows;
        } catch (error) {
            console.error("Error al buscar usuario por nombre de usuario:", error);
            throw new Error("Error al buscar usuario por nombre de usuario");
        }
    }

    async cantUsuarios(){
        const sql = `SELECT COUNT(*) FROM users`
        try{
            const num = await this.client.query(sql)
            return num.rows
        } catch(error){
            console.error("Error contando usuarios")
            return("Error contando usuarios")
        }
    }

    async isAdmin(id){
        const sql = `SELECT * FROM users WHERE id='${id}' and admin=true`
        const response = await this.DBClient.query(sql);
        return response.rows
    }
}
