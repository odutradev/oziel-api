import { Router } from "express";

import usersResource from "@resources/users/users.resource";
import manageRequest from "@middlewares/manageRequest";
import { ROLES } from "@utils/constants/roles";
import hasRole from "@middlewares/hasRole";
import upload from "@middlewares/upload";
import auth from "@middlewares/auth";

const usersRouter = Router();

usersRouter.post("/signup", manageRequest(usersResource.signUp));
usersRouter.post("/signin", manageRequest(usersResource.signIn));

usersRouter.post("/password/reset/request", manageRequest(usersResource.requestPasswordReset));
usersRouter.post("/password/reset/verify", manageRequest(usersResource.verifyResetCode));
usersRouter.post("/password/reset/confirm", manageRequest(usersResource.resetPassword));

usersRouter.patch("/profile", [auth], manageRequest(usersResource.updateProfile));
usersRouter.patch("/profile/image", [auth, upload.single("image")], manageRequest(usersResource.updateProfileImage, { upload: true }));
usersRouter.get("/me", [auth], manageRequest(usersResource.getUser));

usersRouter.get("/all", [auth, hasRole([])], manageRequest(usersResource.getAllUsers));
usersRouter.delete("/:userID", [auth, hasRole([])], manageRequest(usersResource.deleteUserById));
usersRouter.patch("/:userID", [auth, hasRole([])], manageRequest(usersResource.updateUserById));
usersRouter.get("/:userID", [auth, hasRole([])], manageRequest(usersResource.getUserById));

export default usersRouter;