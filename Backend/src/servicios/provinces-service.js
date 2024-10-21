import ProvinceRepository from './../../src/repositories/province-repository.js';  

export default class ProvinceService{

    getAllProvinces = async (pageSize, page) =>{
        const repo = new ProvinceRepository();
        const returnArray = await repo.getAllProvinces(pageSize, page);
        return {
            collection: returnArray,
            pageSize: pageSize,
            page: page,
            nextPage: `http://localhost:3508/api/province/?limit=${parseInt(pageSize)}&offset=${parseInt(page) + parseInt(pageSize)}`,
        };
    }
    getProvinceById = async (id) =>{
        const repo = new ProvinceRepository();
        const returnArray = await repo.getProvinceById(id);
        return returnArray;
    }
    getAllLocationsByProvinceId = async (id, pageSize, page) =>{
        const repo = new ProvinceRepository();
        const returnArray = await repo.getAllLocationsByProvinceId(id, pageSize, page);
        return {
            collection: returnArray,
            pageSize: pageSize,
            page: page,
            nextPage: `http://localhost:3508/api/province/${id}/locations/?limit=${parseInt(pageSize)}&offset=${parseInt(page) + parseInt(pageSize)}`,
        };
    }

    crearProvince = async (name, fullName, latitude, longitude, display_order) => {
        const repo = new ProvinceRepository();
        const returnArray = await repo.crearProvince(name, fullName, latitude, longitude, display_order);
        return returnArray;
    }
    putProvince = async (id, name, fullName, latitude, longitude)  => {
        const repo = new ProvinceRepository();
        const returnArray = await repo.putProvince(id, name, fullName, latitude, longitude);
        return returnArray;
    }
    borrarProvince = async(id)  => {
        const repo = new ProvinceRepository();
        const returnArray = await repo.borrarProvince(id)
        return returnArray;
    }
    
    

}