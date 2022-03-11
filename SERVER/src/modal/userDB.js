const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://remeeza123:Remeeza123@cluster0.jfhgc.mongodb.net/Batchmanager?retryWrites=true&w=majority")
const Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String},
    name: {type: String},
    designation: {type: String},
    gender: {type: String},
    password: {type: String},
    role: {type: String},
    batch: {type: String},
    image: {type: String},
    regimage: {type: String},
    course: {type: String},
    phone: {type: String},
    coursesd: {type: String},
    coursesend: {type: String},
    fullname:{type: String},
    approvedstatus:{type: String},
    approvedby:{type: String}
 }, {timestamps:true})

var Users = mongoose.model('users', userSchema)

module.exports = Users;
