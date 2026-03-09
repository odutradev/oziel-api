import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    attempts: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
});

passwordResetSchema.index({ userID: 1, createdAt: -1 });
passwordResetSchema.index({ email: 1, createdAt: -1 });
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const passwordResetModel = mongoose.model("passwordReset", passwordResetSchema);

export default passwordResetModel;