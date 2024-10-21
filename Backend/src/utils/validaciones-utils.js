import { DBconfig } from "../../database/DB.js";
import pg from "pg"
export default class Validaciones{
    constructor () {
        const {Client} = pg;
        this.DBClient = new Client(DBconfig);
        this.DBClient.connect();
        
    }
    async existeObjeto(tabla, id){
        const sql = `SELECT  * FROM `+tabla+` WHERE id='${id}'`
        const response = await this.DBClient.query(sql);
        console.log(response.rowCount)
        if(response.rowCount>0){
            return true;
        }else{
            return false;
        }
    }

    async menor3(campo){
        if(campo.length < 3){
            return true;
        }else{
            return false;
        }

    }

    

    async notANumber(campo){
        return isNaN(campo);
    }
    
    async asistenciaMayorACapacidad(max_assistance, id_event_location){
        const sql = `SELECT max_capacity FROM event_locations WHERE id = '${id_event_location}'`
        const response = await this.DBClient.query(sql);     
        if(max_assistance > parseInt(response.rows[0].max_capacity)){
            return true;
        }else{
            return false;
        }

    }

    async min1Usuario(id){
            const sql = `SELECT COUNT(*) FROM event_enrollments WHERE id_Event = '${id}'`
            const response = await this.DBClient.query(sql);
            console.log(response)
            if(response.rowCount>0){
                return true;
            }else{
                return false;
            }
    }
    



}