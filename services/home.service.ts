import {prisma} from "../model/prisma";

export class home_services {
    constructor(){}   
    
    async getHomeData (){

         // Banners
        const banners = await prisma.banner.findMany({
            include : {
                product :{
                    select : {
                        id : true,
                        name : true,
                        image_url : true,
                },
            },
        }
        });

         // New Arrivals
        const products = await prisma.product.findMany({
            orderBy : {
                created_at : "desc"
            },
            include : {
                brand : {
                    select : {
                        name : true
                    }
                },
                sizes : {
                    select : {
                        size : true,
                        price : true,
                    },
                    orderBy : {
                        price : "asc"
                    }
                }
            }
        });

       
        
        return {
            banners,
            new_arrivals : products,            
        };
    }
}