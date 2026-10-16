import express from "express";

import isEmptyBody from "../../middlewares/isEmptyBody.js";
import authControllers from "../../controllers/authControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, authControllers.signup);

authRouter.post("/signin", isEmptyBody, authControllers.signin);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

export default authRouter;
