import CartDTO from "../services/Dao/DTOs/cart.model.DTO";

export default class CartRepository {
    constructor(dao){
        this.dao = dao;
    }
    getCarts = async () => {
        let result = await this.dao.get();
        return result;
    }
    createCart = async (cart) => {
        let cartToInsert = new CartDTO(cart);
        let result = await this.dao.create(cartToInsert);
        return result;
    }
}