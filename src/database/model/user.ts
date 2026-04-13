import mongoose from "mongoose";

import { ROLES, ROLES_ARRAY, USER_STATUS_ARRAY, USER_STATUS } from "@utils/types/models/user";
import dateService from "@utils/services/date.service";

const userSchema = new mongoose.Schema({
    order: { type: Number },
    name: { type: String },
    role: { type: String, enum: ROLES_ARRAY, default: ROLES.NORMAL },
    status: { type: String, enum: USER_STATUS_ARRAY, default: USER_STATUS.REGISTERED },
    createAt: { type: Date, default: () => dateService.now() },
    lastUpdate: { type: Date },
    firstSignup: { type: Date },
    lastGetUser: { type: Date },
    description: { type: String },
    images: { profile: { type: String } },
    password: { type: String },
    email: { type: String, unique: true, sparse: true },
    cpfOrRg: { type: String },
    hrControl: {
        isMonitored: { type: Boolean, default: false },
        familyMembers: { type: Number },
        address: { type: String },
        phone: { type: String }
    }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;