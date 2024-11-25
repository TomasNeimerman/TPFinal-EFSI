import pg from "pg";
import { DBconfig } from "../../database/DB.js";

export default class EventLocationRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBconfig);
        this.DBClient.connect();
    }

    async getAllEventLocations(page, pageSize) {
        const sql = `
            SELECT * FROM event_locations
            LIMIT '${pageSize}' OFFSET '${page}'
        `;
        const response = await this.DBClient.query(sql);
        return response.rows;
    }

    async getEventLocationById(id) {
        const sql = `
            SELECT * FROM event_locations
            WHERE id = '${id}'
        `;
        const response = await this.DBClient.query(sql);
        return response.rows;
    }

    async crearEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) {
        const sql = `
            INSERT INTO event_locations (id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user)
            VALUES ('${id_location}', '${name}', '${full_address}', '${max_capacity}', '${latitude}', '${longitude}', '${id_creator_user}')
            RETURNING *
        `;
        const response = await this.DBClient.query(sql);
        return response.rows;
    }

    async putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) {
        const sql = `
            UPDATE event_locations
            SET 
                id_location = '${id_location}', 
                name = '${name}', 
                full_address = '${full_address}', 
                max_capacity = '${max_capacity}', 
                latitude = '${latitude}', 
                longitude = '${longitude}', 
                id_creator_user = '${id_creator_user}'
            WHERE id = '${id}'
            RETURNING *
        `;
        const response = await this.DBClient.query(sql);
        return response.rows;
    }

    async borrarEventLocation(id) {
        const sqlDeleteTags = `
            DELETE FROM event_tags
            WHERE id_event IN (
                SELECT id FROM events WHERE id_event_location = '${id}'
            );
        `;
        await this.DBClient.query(sqlDeleteTags);
    
        const sqlDeleteEvents = `
            DELETE FROM events
            WHERE id_event_location = '${id}';
        `;
        await this.DBClient.query(sqlDeleteEvents);
    
        const sqlDeleteLocation = `
            DELETE FROM event_locations
            WHERE id = '${id}';
        `;
        await this.DBClient.query(sqlDeleteLocation);
    }
    
}
