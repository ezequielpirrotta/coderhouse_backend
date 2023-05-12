import mongoose from 'mongoose';

const collection = 'users';

const schema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    username:{
        type: String,
        unique: true
    },
    age:Number,
    password:String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    cart: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",       
        default: ""
    },
    orders: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "tickets"       
            }   
        ]
    }
})

const userModel = mongoose.model(collection,schema);

export default userModel;