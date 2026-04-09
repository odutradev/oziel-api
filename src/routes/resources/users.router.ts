import { Router } from "express";

import usersResource from "@resources/users/users.resource";
import manageRequest from "@middlewares/manageRequest";
import hasRole from "@middlewares/hasRole";
import upload from "@middlewares/upload";
import auth from "@middlewares/auth";

const usersRouter = Router();

usersRouter.post("/auth/register", manageRequest(usersResource.signUp));
usersRouter.post("/auth/login", manageRequest(usersResource.signIn));

usersRouter.post("/auth/password-reset/request", manageRequest(usersResource.requestPasswordReset));
usersRouter.post("/auth/password-reset/verify", manageRequest(usersResource.verifyResetCode));
usersRouter.post("/auth/password-reset/confirm", manageRequest(usersResource.resetPassword));

usersRouter.patch("/me/profile", [auth], manageRequest(usersResource.updateProfile));
usersRouter.patch("/me/profile/avatar", [auth, upload.single("image")], manageRequest(usersResource.updateProfileImage, { upload: true }));
usersRouter.get("/me/details", [auth], manageRequest(usersResource.getUser));

usersRouter.get("/", [auth, hasRole([])], manageRequest(usersResource.getAllUsers));
usersRouter.get("/:userID", [auth, hasRole([])], manageRequest(usersResource.getUserById));
usersRouter.patch("/:userID", [auth, hasRole([])], manageRequest(usersResource.updateUserById));
usersRouter.delete("/:userID", [auth, hasRole([])], manageRequest(usersResource.deleteUserById));

export default usersRouter;