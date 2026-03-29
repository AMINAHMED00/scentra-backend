import { Request , Response } from "express";
import { order_services } from "../services/order.service";

const orderService = new order_services() ;

export const placeOrder = async (req : any , res : Response) => {

    try {
        const userId = req.user.userId ;
        const { addressId , delivery_method , payment_method } = req.body ;

        if(!addressId || !delivery_method || !payment_method){
            res.status(400).json({
                msg : "All fields are required"
            });
            return;
        }

        const order = await orderService.placeOrderService(userId , addressId , delivery_method , payment_method) ;

        res.status(201).json(order) ;
    }
    catch(err : any){
        res.status(500).json({
            msg : err.message
        });
    }
}

export const getOrderHistory  = async (req : any , res : Response) => {

    try {
        const userId = req.user.userId ;

        const orders = await orderService.getOrderHistoryService(userId) ;
        res.status(200).json(orders) ;
    }
    catch(err : any){
        res.status(500).json({
            msg : err.message
        });
    }
}

export const getOrderById = async (req : any , res : Response) => {

    try {
        const userId = req.user.userId ;
        const orderId = req.params.id ;

        const order = await orderService.getOrderByIdService(userId , orderId) ;
        res.status(200).json(order) ;
    }
    catch(err : any){
        res.status(500).json({
            msg : err.message
        });
    }
}