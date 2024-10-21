import EventCategoryRepository from '../repositories/event-category-repository.js'; 
export default class EventCategoryService{
    getAllCategories = async (pageSize = 10, page = 0) =>{
        const repo = new EventCategoryRepository();
        const returnArray = await repo.getAllCategories(pageSize, page);
        return{
            collection: returnArray,
            pageSize: pageSize,
            page: page,
            nextPage: `http://localhost:3508/api/event_category/?limit=${parseInt(pageSize)}&offset=${parseInt(page) + parseInt(pageSize)}`,
        }
    }
    getCategoryById = async (id) =>{
        const repo = new EventCategoryRepository();
        const returnArray = await repo.getCategoryById(id);
        return returnArray;
    }
    crearCategory = async (name, display_order) => {
        const repo = new EventCategoryRepository();
        const returnArray = await repo.crearCategory(name, display_order);
        return returnArray;
    }
    putCategory = async (id, name, display_order)  => {
        const repo = new EventCategoryRepository();
        const returnArray = await repo.putCategory(id, name, display_order);
        return returnArray;
    }
    borrarCategory = async(id)  => {
        const repo = new EventCategoryRepository();
        const returnArray = await repo.borrarCategory(id)
        return returnArray;
    }
}