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
    password:String, //Se deja plano por el momento.
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    } 
})

const userModel = mongoose.model(collection,schema);

export default userModel;