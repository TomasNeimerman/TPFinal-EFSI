import pg from "pg";
import { DBconfig } from "../../database/DB.js";


export default class EventCategoryRepository{
    constructor () {
        const {Client} = pg;
        this.DBClient = new Client(DBconfig);
        this.DBClient.connect();
    }

    async crearCategory(name, display_order) {
        const sql = `INSERT INTO event_categories (name, display_order)
            VALUES ('${name}', '${display_order}')
            RETURNING *`;
        const response = await this.DBClient.query(sql);
        return response.rows
    }

    async getAllCategories(pageSize, page) {
        const sql = `SELECT * FROM event_categories
            LIMIT '${pageSize}' OFFSET '${page}'`;
            const response = await this.DBClient.query(sql);
            return response.rows
    }

    async getCategoryById(id,) {
        const sql = `SELECT * 
        FROM event_categories
        WHERE id = '${id}'`;
        const response = await this.DBClient.query(sql);
        return response.rows
    }

    async putCategory(id, name, display_order) {
        const sql = `UPDATE event_categories
            SET name = '${name}', display_order = '${display_order}'
            WHERE id = '${id}'
            RETURNING *`;
            const response = await this.DBClient.query(sql);
            return response.rows  
    }

    async borrarCategory(id) {
        const sql = `DELETE FROM events WHERE id_event_category = '${id}';
        DELETE FROM event_categories WHERE id = '${id}'`;
        const response = await this.DBClient.query(sql);
        return response.rows
    }


}