import pg from "pg";
import { DBconfig } from "../../database/DB.js";

export default class ProvinceRepository{
    constructor () {
        const {Client} = pg;
        this.DBClient = new Client(DBconfig);
        this.DBClient.connect();
    }
 
    //Punto 7
     async crearProvince(name, fullName, latitude, longitude, display_order) {
        const intlatitude = parseInt(latitude);
        const intlongitude = parseInt(longitude)
        const sql = `INSERT INTO provinces (name, full_name, latitude, longitude, display_order)
            VALUES ('${name}', '${fullName}', ${intlatitude}, ${intlongitude}, ${display_order})
            RETURNING *`;
            console.log(sql)
            const response = await this.DBClient.query(sql);
            return response.rows
        
    }

    async getAllProvinces(pageSize, page) {
        const offset = pageSize * page;

        const sql = `SELECT * FROM provinces
            ORDER BY id
            LIMIT ${pageSize} OFFSET ${page}`;
        const response = await this.DBClient.query(sql);
        return response.rows
    }

    async getProvinceById(id) {
        const sql = `SELECT * FROM provinces
            WHERE id = ${id}`;
       
        const response = await this.DBClient.query(sql);
        return response.rows
    }

    async getAllLocationsByProvinceId(id, page, pageSize){
        const sql = `SELECT  L.id AS location_id, L.name AS location_name, L.latitude, L.longitude, P.id AS province_id, P.name AS province_name
    FROM Locations L 
    INNER JOIN Provinces P ON L.id_province = P.id 
    WHERE P.id = ${id}
    LIMIT ${pageSize} OFFSET ${page}
    `;
        console.log(sql)
    
        const response = await this.DBClient.query(sql);
        return response.rows

    }

    async putProvince(id, name, fullName, latitude, longitude) {
        const intlatitude = parseInt(latitude);
        const intlongitude = parseInt(longitude)
        const sql = `UPDATE provinces
            SET name = '${name}', full_name = '${fullName}', latitude = ${intlatitude}, longitude = ${intlongitude}
            WHERE id = ${id}
            RETURNING *`;
            const response = await this.DBClient.query(sql);
            return response.rows
        
    }

    

    async borrarProvince(id) {
        const sql = `DELETE FROM provinces
            WHERE id = ${id}`;
            console.log(sql)
            const response = await this.DBClient.query(sql);
            return response.rows
    }
}

