import moment from "moment"

export default class GetUserDTO {
    constructor(user) {
        this.name = user.first_name+' '+user.last_name,
        this.username = user.username,
        this.role = user.role
        this.last_connection = user.last_connection?moment(user.last_connection).format('DD-MM-yy, HH:mm:ss'):null 
    }
}