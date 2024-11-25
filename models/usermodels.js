const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;

const userSchema = new schema({
    id:{type:ObjectId},
    username:{type:String},
    password:{type:String},
    fullname:{type:String}
});
const User = mongoose.model('user', userSchema);

module.exports = User;