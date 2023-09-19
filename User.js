const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    zipcode: Number
})

const userSchema = new mongoose.Schema({
    name: { type: String },
    age: {
        type: Number,
        min: 1,
        max: 100,
        validate: {
            validator: v => v % 2 == 1,
            message: props => `${props.value} is not an odd number`,
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String
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
    bestFriend: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    hobbies: [String],
    address: addressSchema
});

userSchema.methods.sayHi = function() {
    console.log(`Hi my name is ${this.name}`)
}

module.exports = mongoose.model("User", userSchema);