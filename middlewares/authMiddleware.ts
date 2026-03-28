import { Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
      userId: string;
      role: string;
}
export const authMiddleware = (roles :string[] = []) =>{
    return (req : Request & {user ?:JwtPayload} , res : Response , next : NextFunction) =>{
        const authHeader = req.headers.authorization ;
        if(!authHeader){
            res.status(401).json({
                msg : "No token provided"
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        try{
            const payload = jwt.verify(token , process.env.JWT_SECRET!) as JwtPayload ;
            req.user = payload ;

            // check role..
            if(roles.length && !roles.includes(payload.role)){
                res.status(403).json({
                    msg : "Forbidden"
                });
                return;
            }
            next();
        }
        catch(err){
            res.status(401).json({
                msg : "Invalid token"
            });
        }
    }
}