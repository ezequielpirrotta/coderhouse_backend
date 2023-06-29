import mongoose from 'mongoose';

const collection = 'user';

const schema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    username:{
        type: String,
        unique: true,
        require: true
    },
    age:Number,
    password:{
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ["admin", "user", "premium"],
        default: "user"
    },
    cart: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"      
    },
    orders: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "tickets"       
            }   
        ]
    },
    documents: {
        type: [
            {
                name: {
                    type:String,
                    unique: true
                },
                reference: String
            }
        ]
    },
    last_connection: String
})

const userModel = mongoose.model(collection,schema);

export default userModel;