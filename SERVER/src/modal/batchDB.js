const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://remeeza123:Remeeza123@cluster0.jfhgc.mongodb.net/Batchmanager?retryWrites=true&w=majority")
const Schema = mongoose.Schema;

var userSchema = new Schema({
    batch: {type: Array},
    course: {type: Array},
 }, {timestamps:true})

var Batch = mongoose.model('batch', userSchema)

module.exports = Batch;
