import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        unique: true,
        type: String
    },
    order: Number,
    name: String,
    role: {
        enum: ["normal", "admin"],
        default: "normal",
        type: String,
    },
    status: {
        enum: ["loggedIn", "registered", "blocked"],
        default: "registered",
        type: String,
    },
    createAt: {
        default: Date.now(),
        type: Date,
    },
    lastUpdate: {
        type: Date,
    },
    firstSignup: {
        type: Date,
    },
    lastGetUser: {
        type: Date,
    },
    description: {
        type: String
    },
    images: {
        profile: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;