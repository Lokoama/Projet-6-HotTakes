const mongoose = require ("mongoose")
const uniqueValidator = require('mongoose-unique-validator');

//Schema pour l'utilisateur
const userSchema = mongoose.Schema ({
    email: {type : String, required: true, unique: true},
    password: {type : String, required: true}
});

//Utlisation de mongoose-unique-validator pour qu'il ne puisse y avoir qu'aucun utilisateur est le même mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)