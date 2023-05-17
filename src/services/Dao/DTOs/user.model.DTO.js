export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.username = user.mail,
        this.age = user.age,
        this.password = user.password,
        this.cart = user.cartId?user.cartId:null
        this.role = user.role? user.role : null;
    }
}