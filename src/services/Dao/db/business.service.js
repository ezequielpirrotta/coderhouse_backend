import businessModel from '../models/business.model.js';

class BusinessService {
    
    getAll = async () => {
        let businesses = await businessModel.find();
        return businesses.map(business=>business.toObject());
    };
    save = async (business) => {
        let result = await businessModel.create(business);
        return result;
    };
    findById = async (id) => {
        const result = await businessModel.findOne({_id: id});
        return result;
    };
    update = async (id, business) => {
        console.log("Update user with filter and value:");
        
        let result = await businessModel.updateOne(filter, value);
        return result;
    }
};
export default UserService;