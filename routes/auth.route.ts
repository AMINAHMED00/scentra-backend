import { Router } from "express";
import { changePassword, getMe, Login, register, updateProfile } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router() ;

authRouter.post('/register' , register);
authRouter.post('/login' , Login) ;
authRouter.get('/me' , authMiddleware() ,getMe) ;
authRouter.patch('/update' , authMiddleware() , updateProfile);
authRouter.patch('/me/passward' , authMiddleware() , changePassword);

export default authRouter ;