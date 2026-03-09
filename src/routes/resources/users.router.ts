import { Router } from "express";

import usersResource from "@resources/users/users.resource";
import manageRequest from "@middlewares/manageRequest";
import upload from "@middlewares/upload";
import auth from "@middlewares/auth";

const usersRouter = Router();

usersRouter.post("/auth/signup", manageRequest(usersResource.signUp));
usersRouter.post("/auth/signin", manageRequest(usersResource.signIn));

usersRouter.post("/password/reset/request", manageRequest(usersResource.requestPasswordReset));
usersRouter.post("/password/reset/verify", manageRequest(usersResource.verifyResetCode));
usersRouter.post("/password/reset/confirm", manageRequest(usersResource.resetPassword));

usersRouter.patch("/profile/image", [auth, upload.single("image")], manageRequest(usersResource.updateProfileImage, { upload: true }));
usersRouter.patch("/profile/update", [auth], manageRequest(usersResource.updateProfile));
usersRouter.get("/auth/me", [auth],  manageRequest(usersResource.getUser));

export default usersRouter;