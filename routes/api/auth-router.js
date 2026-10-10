import express from "express";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import authControllers from "../../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, authControllers.signup);

authRouter.post("/signin", isEmptyBody, authControllers.signin);

export default authRouter;
