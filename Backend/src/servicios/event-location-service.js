import EventLocationRepository from './../../src/repositories/event-loaction-repository.js'; 
export default class EventLocationService{
    getAllEventlocations = async (page, pageSize) =>{
        const repo = new EventLocationRepository();
        const returnArray = await repo.getAllEventlocations(page, pageSize);
        return{
            collection: returnArray,
            pageSize: pageSize,
            page: page,
            nextPage: `http://localhost:3508/api/event_location/?limit=${parseInt(pageSize)}&offset=${parseInt(page+1) * parseInt(pageSize)}`,
        }
    }
    getEventLocationById = async (Id) =>{
        const repo = new EventLocationRepository();
        const returnArray = await repo.getEventLocationById(Id);
        return returnArray;
    }
    crearEventLocation = async (id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) =>{
        const repo = new EventLocationRepository();
        const returnArray = await repo.crearEventLocation(id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
        return returnArray;
    }
    putEventLocation = async (id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user) =>{
        const repo = new EventLocationRepository();
        const returnArray = await repo.putEventLocation(id, id_location, name, full_address, max_capacity, latitude, longitude, id_creator_user);
        return returnArray;
    }
    borrarEventLocation = async (id) =>{
        const repo = new EventLocationRepository();
        const returnArray = await repo.putEventLocation(id);
        return returnArray;
    }


}