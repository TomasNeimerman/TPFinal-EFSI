import pg from "pg";
import { DBconfig } from "../../database/DB.js";




export default class EventRepository{
    constructor () {
        const {Client} = pg;
        this.DBClient = new Client(DBconfig);

        this.DBClient.connect();
        
    }
   
    async BusquedaEvento(name, category, startDate, tag, page, pageSize) {
        let queryAgregado=``
        if(name != null){
            queryAgregado += `AND e.name = '${name}'`
        }
        if(startDate != null){
            queryAgregado += `AND e.start_date = '${startDate}'`
        }
        if(category != null){
            queryAgregado += `AND ec.name = '${category}'`
        }
        if(tag != null){
            queryAgregado += `AND t.name = '${tag}'`
        }

        const sql = `
        SELECT e.id, e.name, e.description,
        json_build_object(
            'id', ec.id,
            'name', ec.name
        ) AS event_category,
        json_build_object(
            'id', el.id,
            'name', el.name,
            'full_address', el.full_address,
            'latitude', el.latitude,
            'longitude', el.longitude,
            'max_capacity', el.max_capacity
        ) AS event_location,
        json_build_object(
            'id', l.id,
            'name', l.name,
            'latitude', l.latitude,
            'longitude', l.longitude
        ) AS location,
        json_build_object(
            'id', p.id,
            'name', p.name,
            'full_name', p.full_name,
            'latitude', p.latitude,
            'longitude', p.longitude,
            'display_order', p.display_order
        ) AS province,
        e.start_date, e.duration_in_minutes, e.price,
        e.enabled_for_enrollment, e.max_assistance,
        json_build_object(
            'username', u.username,
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name
        ) AS creator_user,
        (
            SELECT json_agg(
                json_build_object(
                    'id', tags.id,
                    'name', tags.name
                )
            )
            FROM event_tags et
            JOIN tags ON et.id_tag = tags.id
            WHERE et.id_event = e.id
        ) AS tags  
        FROM events e    
        JOIN users u ON e.id_creator_user = u.id
        JOIN event_categories ec ON e.id_event_category = ec.id
        JOIN event_locations el ON e.id_event_location = el.id 
        JOIN locations l ON el.id_location = l.id
        JOIN provinces p ON l.id_province = p.id
        WHERE 1=1 ${queryAgregado}
        LIMIT ${pageSize} OFFSET ${page};
    `;
        const response = await this.DBClient.query(sql);
        return response.rows;
    }
    
    
    //Punto 4
    async DetalleEvento(id) {
        const sql = `
          SELECT E.id, E.name, E.description, E.start_date, 
                 E.duration_in_minutes, E.price, E.enabled_for_enrollment,
                 E.max_assistance, 
                 EL.max_capacity, 
                 (SELECT COUNT(*) FROM event_enrollments EE WHERE EE.id_event = E.id) AS current_enrolled
          FROM events E
          JOIN event_locations EL ON E.id_event_location = EL.id
          WHERE E.id = '${id}'
        `;      
        const response = await this.DBClient.query(sql);
        return response.rows[0];
    }
    
    //Punto 5
    async listaUsuarios(id, first, last, username, attended, rating, pageSize, page) {
        let queryAgregado = '';
    
        if (first) {
            queryAgregado += `AND U.first_name = '${first}' `;
        }
        if (last) {
            queryAgregado += `AND U.last_name = '${last}' `;
        }
        if (username) {
            queryAgregado += `AND U.username = '${username}' `;
        }
        if (attended) {
            queryAgregado += `AND ER.attended = '${attended}' `;
        }
        if (rating) {
            queryAgregado += `AND ER.rating = '${rating}' `;
        }
    
        const sql = `
            SELECT ER.id, ER.id_event, ER.id_user,
            json_build_object(
                'id', U.id,
                'first_name', U.first_name,
                'last_name', U.last_name,
                'username', U.username
            ) AS user,
            ER.description, ER.attended, ER.rating
            FROM users U 
            JOIN event_enrollments ER ON ER.id_user = U.id 
            JOIN events E ON E.id = ER.id_event
            WHERE E.id = '${id}' 
            ${queryAgregado}
            LIMIT '${pageSize}' OFFSET '${page}';
        `;
    
        console.log(sql);
        const response = await this.DBClient.query(sql);
        return response.rows;
    }
    
    
   

    //punto 8
    async crearEvent(name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user) {
    
    const sql = `
        INSERT INTO events (name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user)
        VALUES ('${name}', '${description}', '${id_event_category}', '${id_event_location}', '${start_date}', '${duration_in_minutes}', '${price}', '${enabled_for_enrollment}', '${max_assistance}', '${id_creator_user}')
        RETURNING *
    `;
    console.log(sql)
    const response = await this.DBClient.query(sql);
    return response.rows[0]
    }

    async putEvent(eventId, name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user) {
    const sql = `
        UPDATE events
        SET name = '${name}', description = '${description}', id_event_category = '${id_event_category}', id_event_location = '${id_event_location}', start_date = '${start_date}', duration_in_minutes = '${duration_in_minutes}', 
        price = '${price}', enabled_for_enrollment = '${enabled_for_enrollment}', max_assistance = '${max_assistance}', id_creator_user = '${id_creator_user}'
        WHERE id = '${eventId}'
        RETURNING * `;
        console.log(sql)
    const response = await this.DBClient.query(sql);
    return response.rows[0]
    
    }
    async borrarEvent(eventId) {
    const sql = `
        DELETE FROM event_tags WHERE id_event = '${eventId}'; DELETE FROM event_enrollments WHERE id_event = '${eventId}'; DELETE FROM events WHERE id = '${eventId}' `;
    await this.DBClient.query(sql);
}

//punto 9
async registerUser(id_event, id_user, description, attended = false, observations, rating, registration_date_time) {
    const sqlCheckEnrollment = `
        SELECT * FROM event_enrollments 
        WHERE id_event = '${id_event}' AND id_user = '${id_user}'
    `;
    const existingEnrollment = await this.DBClient.query(sqlCheckEnrollment);
    if (existingEnrollment.rows.length > 0) {
        throw new Error("Ya estás inscrito en este evento.");
    }

    // Validar que el valor attended sea booleano
    if (typeof attended !== 'boolean') {
        throw new Error("El valor de 'attended' debe ser true o false.");
    }

    const sql = `
        INSERT INTO event_enrollments (id_event, id_user, description, registration_date_time, attended, observations, rating)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [id_event, id_user, description, registration_date_time, attended, observations, rating];
    const response = await this.DBClient.query(sql, values);
    return response.rows;
}



async unregisterUser(id_event, id_user){

        const sql = `
            DELETE FROM event_enrollments
            WHERE id_event = '${id_event}' and id_user = '${id_user}'`;
            console.log(sql)
        const response = await this.DBClient.query(sql);
        return response.rows
}
async isUserEnrolled(id_event, id_user) {
    const sql = `
      SELECT * FROM event_enrollments 
      WHERE id_event = '${id_event}' AND id_user = '${id_user}'`;
    const response = await this.DBClient.query(sql);
    return response.rows.length > 0;
  }

//Punto 10
async ratingEvento(id_event, rating){
    const inscripto = incripto(id_event)
    if(!inscripto){
        response.status(404).json({message: "El usuario no esta inscripto al evento"})
    }else{
        const sql = `UPDATE event_enrollments
        SET rating = $1
        RETURNING *`
        const { rows } = await this.DBClient.query(sql, [rating]);
        if(result.rows.length > 0){
            return rows[0];
        }else{
            return console.error("Sad Papu :V");
        }
    }

}

async inscripto(id_event){
    const id_user = req.user.id;
    const sql = `SELECT * 
    FROM event_enrollments ee
    INNER JOIN events e ON e.'${id_event}'=ee.'${id_event}' 
    INNER JOIN users u ON u'${id_user}'=ee.'${id_user}'`
    if(await this.DBClient.query(sql)){
        return true;
    }else{
        return false;
    }
}
}




