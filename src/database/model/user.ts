import mongoose from "mongoose";

import { ROLES, ROLES_ARRAY, USER_STATUS_ARRAY, USER_STATUS } from "@utils/types/models/user";
import dateService from "@utils/services/date.service";

const userSchema = new mongoose.Schema({
    order: Number,
    name: String,
    role: {
        type: String,
        enum: ROLES_ARRAY,
        default: ROLES.NORMAL,
    },
    status: {
        type: String,
        enum: USER_STATUS_ARRAY,
        default: USER_STATUS.REGISTERED,
    },
    createAt: {
        type: Date,
        default: () => dateService.now(),
    },
    lastUpdate: Date,
    firstSignup: Date,
    lastGetUser: Date,
    description: String,
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