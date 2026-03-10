import { Router } from "express";

import treasuryRouter from "./resources/treasury.router";
import controlAccess from "@middlewares/controlAccess";
import usersRouter from "./resources/users.router";

const router = Router();

router.get("/ping", (req, res) => {
    res.sendStatus(200);
});

router.get("/validate/control-access", controlAccess, (req, res) => {
    res.sendStatus(200);
});

router.use("/treasury", [controlAccess], treasuryRouter);
router.use("/users", [controlAccess], usersRouter);

export default router;