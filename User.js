const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    zipcode: Number
})

const userSchema = new mongoose.Schema({
    name: {type: String, minLength: 1},
    age: {
        type: Number,
        min: 1,
        max: 100,
        validate: {
            validator: v => v % 2 ==- 0,
            message: props => `${props.value} is not an even number`,
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    bestFriend: mongoose.SchemaTypes.ObjectId,
    hobbies: [String],
    address: addressSchema
});

module.exports = mongoose.model("User", userSchema);