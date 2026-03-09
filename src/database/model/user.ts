import mongoose from "mongoose";

import dateService from "@utils/services/date.service";

const userSchema = new mongoose.Schema({
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
        default: () => dateService.now(),
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
        type: String,
        unique: true
    },
    cpfOrRg: {
        type: String
    }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;