const {model, Schema} = require("mongoose")

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
})

module.exports = model("User", userSchema) // Después mongo le pone la s (users)