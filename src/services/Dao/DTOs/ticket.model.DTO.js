export default class ProductDTO {
    constructor(user) {
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.username = user.mail,
        this.age = user.age,
        this.password = user.password
    }
}