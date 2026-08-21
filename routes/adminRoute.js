import express from "express";
import { createAccount, adminLogin, getUserProfile, updateAdminProfile } from "../controller/adminController.js";
import { verifyAuth } from "../middlewares/auth.js";

const adminRouter = express.Router();

adminRouter.get("/admin/profile", verifyAuth, getUserProfile);
adminRouter.post("/auth/signup", createAccount);
adminRouter.post("/auth/login", adminLogin);
adminRouter.put("/admin/edit/profile", verifyAuth, updateAdminProfile);

export default adminRouter ;