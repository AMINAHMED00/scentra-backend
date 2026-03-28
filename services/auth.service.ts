import {prisma}  from "../model/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class auth_services {
    constructor(){}

    async registerService (full_name : string , email : string , password : string){

        const existingUser = await prisma.user.findUnique({
            where : {
                email : email
            }
        });

        if(existingUser){
            throw new Error("User already exists");
        }

        const password_hash : string = await bcrypt.hash(password , 10) ;

        const user = await prisma.user.create({
            data: { full_name, email, password_hash }
        });

        await prisma.cart.create({
            data : {
                user_id : user.id
            }
        });

        await prisma.wishlist.create({
            data : {
                user_id : user.id
            }
        });

        return {            
            user : {
                id : user.id,
                full_name : user.full_name,
                email : user.email,
                role : user.role
            }
        }
    }

    async loginService (email : string , password : string){

        const user = await prisma.user.findUnique({
            where : {
                email : email
            }
        });

        if (!user){
            throw new Error("Invalid email");
        }

        const ispasswordValid = await bcrypt.compare(password , user.password_hash);

        if(!ispasswordValid){
            throw new Error("Invalid password");
        }

        const token = jwt.sign(
            {
                userId : user.id,
                email: user.email,
                role : user.role
            },
            process.env.JWT_SECRET!,
            {
                expiresIn : "7d"
            }
        );

        return {
            token,
            user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            }
        }
    }

    async getMeService (userId : string){

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }, 
            select : {
                id: true,
                full_name: true,
                email: true,
                phone: true,
                role: true,
                points: true,                
                created_at: true,
                _count: {
                    select: {
                    orders: true,
                    reviews: true,
                    },
                },
            }
        });

        if(!user)
            throw new Error("User not found");

        return user ;
    }

    async updateProfileService (userId : string , data : {
        full_name?:string,
        phone?:string
    }){
        const user = await prisma.user.update({
            where : {
                id : userId
            },
            data,
            select :{
                id: true,
                full_name: true,
                email: true,
                phone: true,
            }
        });

        return user ;
    }

    async changePasswordService (userId : string , oldpass : string , newpass : string){

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        });

        if(!user) throw new Error ("User not found");

        const isMatch = await bcrypt.compare(oldpass , user.password_hash);

        if(!isMatch) throw new Error("Old password is incorrect");

        const password_hash = await bcrypt.hash(newpass , 10) ;

        await prisma.user.update({
            where : {
                id : userId
            },
            data : {
                password_hash
            }
        });
    }
}