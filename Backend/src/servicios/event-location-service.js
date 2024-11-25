import EventLocationRepository from './../../src/repositories/event-loaction-repository.js';

export default class EventLocationService {
    getAllEventlocations = async (page, pageSize) => {
        const repo = new EventLocationRepository();
        const returnArray = await repo.getAllEventLocations(page, pageSize);
        return {
            collection: returnArray,
            pageSize: pageSize,
            page: page,
            nextPage: `http://localhost:3508/api/event_location/?limit=${parseInt(pageSize)}&offset=${parseInt(page+1) * parseInt(pageSize)}`,
        };
    };

    getEventLocationById = async (id) => {
        const repo = new EventLocationRepository();
        return await repo.getEventLocationById(id);
    };

    crearEventLocation = async (id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) => {
        const repo = new EventLocationRepository();
        return await repo.crearEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
    };

    putEventLocation = async (id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) => {
        const repo = new EventLocationRepository();
        return await repo.putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
    };

    async borrarEventLocation(id) {
        const repo = new EventLocationRepository();
        await repo.borrarEventLocation(id);
    }
}
