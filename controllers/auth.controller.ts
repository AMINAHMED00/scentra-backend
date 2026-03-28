import { Request , Response } from "express";
import { auth_services } from "../services/auth.service";

const authService = new auth_services() ;

export const register = async (req: Request, res: Response) => {

    try {
        const { full_name, email, password } = req.body;

        if(!full_name || !email || !password){
            res.status(400).json({
                msg : "All fields are required"
            });
            return;
        }

        const result = await authService.registerService(full_name, email, password);

        res.status(201).json({
            msg : "User registered successfully",
            data : result
        });
    }
    catch(err : any){
        res.status(400).json({
            msg : err.message 
        });
    }
}

export const Login = async (req : Request , res : Response) =>{

    try {
        const {email , password} = req.body ;
        
        if(!email || !password){
            res.status(400).json({
                msg : "Email and password are required"
            });
            return;
        }

        const result = await authService.loginService(email , password) ;

        res.status(200).json({
            result
        });
    }
    catch(err : any){
        res.status(400).json({
            msg : err.message
        });
    }
}

export const getMe = async(req : any , res : Response) =>{
    try {

        const userId = req.user.userId ;
        const user = await authService.getMeService(userId) ;

        res.status(200).json({
            user
        });
    }
    catch(err : any){
        res.status(400).json({
            msg : err.message 
        });
    }
}

export const updateProfile = async(req : any ,  res : Response) =>{

    try{
        const userId = req.user.userId ;
        const {full_name , phone} = req.body ;

        const result = await authService.updateProfileService(userId , {full_name , phone});

        res.status(200).json({
            result
        });
    }
    catch(err : any){
        res.status(400).json({
            msg : err.message
        });
    }
}

export const changePassword  = async(req : any , res : Response) =>{

    try{
        const userId = req.user.userId ;
        const { old_password, new_password } = req.body;

        if(!old_password || !new_password){
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        await authService.changePasswordService(userId , old_password , new_password) ;

        res.status(200).json({
            msg : "Password changed successfully"
        });
    }
    catch(err : any){
        res.status(400).json({
            msg : err.message
        });
    }
}