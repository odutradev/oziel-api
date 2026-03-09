import jwt from "jsonwebtoken";
import fs from "fs/promises";

import passwordChangedTemplate from "@email/templates/passwordChanged";
import passwordResetTemplate from "@email/templates/passwordReset";
import passwordResetModel from "@database/model/passwordReset";
import stringService from "@utils/services/string.services";
import objectService from "@utils/services/object.services";
import randomService from "@utils/services/random.service";
import cryptoService from "@utils/services/crypto.service";
import imageService from "@utils/services/image.service";
import dateService from "@utils/services/date.service";
import sendEmail from "@email/functions/sendEmail";
import { hasUser } from "@database/functions/user";
import userModel from "@database/model/user";
import fileStorage from "@storage/file";

import type { ManageRequestBody } from "@middlewares/manageRequest";

const RESET_EXPIRATION_MINUTES = 15;
const MAX_RESET_ATTEMPTS = 3;
const RESET_CODE_MAX = 999999;
const RESET_CODE_MIN = 100000;
const IMAGE_QUALITY = 80;
const MAX_IMAGE_SIZE = 1024;
const IMAGE_FORMAT = "webp";

const usersResource = {
    signUp: async ({ data, manageError }: ManageRequestBody) => {
        try {
            const { id, password } = data as Record<string, string>;
            if (!id || !password) return manageError({ code: "invalid_data" });

            const findUser = await userModel.findOne({ id });
            if (!findUser) return manageError({ code: "user_not_found" });
            
            if (findUser.status !== "registered") return manageError({ code: "user_already_registered" });

            const hashedPassword = await cryptoService.hashPassword(password);

            const extra: Partial<any> = {
                firstSignup: new Date(Date.now()),
                lastUpdate: new Date(Date.now()),
                password: hashedPassword,
                status: "loggedIn"
            };

            await userModel.findOneAndUpdate({ id }, { $set: { ...extra } }, { new: true });

            const token = jwt.sign({ id: findUser._id }, process.env.SECRET || "");
            return { token };		 
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    signIn: async ({ data, manageError }: ManageRequestBody) => {
        try {
            const { id, password } = data as Record<string, string>;
            if (!id || !password) return manageError({ code: "no_credentials_sent" });

            const findUser = await userModel.findOne({ id });
            if (!findUser) return manageError({ code: "user_not_found" });
            
            if (findUser.status !== "loggedIn") return manageError({ code: "user_not_registered" });

            const isPasswordMatch = await cryptoService.comparePassword(password, findUser?.password || "");
            if (!isPasswordMatch) return manageError({ code: "invalid_credentials" });

            const token = jwt.sign({ id: findUser._id }, process.env.SECRET || "");
            return { token };		 
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    getUser: async ({ manageError, ids }: ManageRequestBody) => {
        try {
            return await hasUser({ _id: ids.userID }, manageError);
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateProfile: async ({ data, manageError, ids }: ManageRequestBody) => {
        try {
            const { userID } = ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const userExists = await hasUser({ _id: userID }, manageError);
            if (!userExists) return;

            const filteredUpdatedUser = objectService.getObject(data, ["name", "description"]) as Record<string, string>;

            if (filteredUpdatedUser.name) {
                filteredUpdatedUser.name = stringService.filterBadwords(stringService.normalizeString(filteredUpdatedUser.name));
            }

            if (filteredUpdatedUser.description) {
                filteredUpdatedUser.description = stringService.filterBadwords(stringService.normalizeString(filteredUpdatedUser.description));
            }

            return await userModel.findByIdAndUpdate(userID, { $set: { ...filteredUpdatedUser, lastUpdate: Date.now() } }, { new: true }).select("-password");
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    requestPasswordReset: async ({ data, manageError }: ManageRequestBody) => {
        try {
            const { email } = data as Record<string, string>;
            if (!email) return manageError({ code: "invalid_data" });

            const user = await userModel.findOne({ email });
            if (!user) return manageError({ code: "user_not_found" });

            await passwordResetModel.deleteMany({ 
                verified: false,
                userID: user._id
            });

            const code = randomService.getRandomNumberInRange(RESET_CODE_MIN, RESET_CODE_MAX).toString();
            const now = dateService.now();
            const expiresAt = dateService.addMinutes(new Date(), RESET_EXPIRATION_MINUTES);

            const resetRequest = new passwordResetModel({
                expiresAt,
                createdAt: now,
                verified: false,
                email: user.email,
                userID: user._id,
                attempts: 0,
                code
            });

            await resetRequest.save();

            const template = passwordResetTemplate();
            await sendEmail({
                to: user.email as string,
                subject: "Código de redefinição de senha",
                template,
                variables: {
                    expirationMinutes: RESET_EXPIRATION_MINUTES,
                    code
                }
            });

            return {
                message: "Código enviado para o email",
                expiresIn: RESET_EXPIRATION_MINUTES,
                success: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    verifyResetCode: async ({ data, manageError }: ManageRequestBody) => {
        try {
            const { email, code } = data as Record<string, string>;
            if (!email || !code) return manageError({ code: "invalid_data" });

            const user = await userModel.findOne({ email });
            if (!user) return manageError({ code: "user_not_found" });

            const now = dateService.now();

            const resetRequest = await passwordResetModel.findOne({
                expiresAt: { $gt: now },
                verified: false,
                userID: user._id
            }).sort({ createdAt: -1 });

            if (!resetRequest) return manageError({ code: "invalid_data" });

            if (resetRequest.attempts >= MAX_RESET_ATTEMPTS) {
                await passwordResetModel.deleteOne({ _id: resetRequest._id });
                return manageError({ code: "invalid_data" });
            }

            if (resetRequest.code !== code) {
                await passwordResetModel.findByIdAndUpdate(
                    resetRequest._id,
                    { $inc: { attempts: 1 } }
                );
                return manageError({ code: "invalid_credentials" });
            }

            await passwordResetModel.findByIdAndUpdate(
                resetRequest._id,
                { verified: true }
            );

            return {
                message: "Código verificado com sucesso",
                success: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    resetPassword: async ({ data, manageError }: ManageRequestBody) => {
        try {
            const { email, code, newPassword } = data as Record<string, string>;
            if (!email || !code || !newPassword) return manageError({ code: "invalid_data" });

            const user = await userModel.findOne({ email });
            if (!user) return manageError({ code: "user_not_found" });

            const now = dateService.now();

            const resetRequest = await passwordResetModel.findOne({
                expiresAt: { $gt: now },
                verified: true,
                userID: user._id,
                code
            }).sort({ createdAt: -1 });

            if (!resetRequest) return manageError({ code: "invalid_data" });

            const hashedPassword = await cryptoService.hashPassword(newPassword);

            await userModel.findByIdAndUpdate(
                user._id,
                { 
                    password: hashedPassword,
                    lastUpdate: now
                }
            );

            await passwordResetModel.deleteMany({ userID: user._id });

            const template = passwordChangedTemplate();
            await sendEmail({
                to: user.email as string,
                subject: "Senha alterada com sucesso",
                template,
                variables: {
                    time: dateService.formatTime(now),
                    date: dateService.formatDate(now),
                    userName: user.name || "Usuário"
                }
            });

            return {
                message: "Senha alterada com sucesso",
                success: true
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    },
    updateProfileImage: async ({ manageError, ids, files }: ManageRequestBody) => {
        try {
            const { userID } = ids;
            if (!userID) return manageError({ code: "invalid_params" });

            const file = files[0];
            if (!file) return manageError({ code: "invalid_data" });

            const user = await hasUser({ _id: userID }, manageError);
            if (!user) return;

            const { mimetype, path } = file;

            if (!mimetype || !path) return manageError({ code: "invalid_data" });
            if (!mimetype.startsWith("image/")) return manageError({ code: "invalid_data" });

            const originalBuffer = await fs.readFile(path);
            const isValidImage = await imageService.validateImage(originalBuffer);
            
            if (!isValidImage) return manageError({ code: "invalid_data" });

            const { buffer: compressedBuffer, mimeType, originalSize, compressedSize, compressionRatio } = await imageService.compressImage({
                maxHeight: MAX_IMAGE_SIZE,
                maxWidth: MAX_IMAGE_SIZE,
                quality: IMAGE_QUALITY,
                format: IMAGE_FORMAT,
                buffer: originalBuffer
            });

            const filePath = `users/${userID}/images/profile`;
            
            const { url } = await fileStorage.upload({
                buffer: compressedBuffer,
                mimeType,
                path: filePath,
                isPublic: true
            });

            const updatedUser = await userModel.findByIdAndUpdate(
                userID,
                { 
                    $set: { 
                        "images.profile": url,
                        lastUpdate: dateService.now()
                    }
                },
                { new: true }
            ).select("-password");

            return {
                user: updatedUser,
                url,
                compression: {
                    savedBytes: originalSize - compressedSize,
                    compressionRatio: `${compressionRatio.toFixed(2)}%`,
                    compressedSize,
                    originalSize
                }
            };
        } catch (error) {
            manageError({ code: "internal_error", error });
        }
    }
};

export default usersResource;