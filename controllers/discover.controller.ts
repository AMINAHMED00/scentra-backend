import { Request , Response } from "express";
import {discover_services} from "../services/discover.service";

const discoverService = new discover_services() ;

export const getDiscoverData = async(req : Request , res : Response) => {
    try {
        const result = await discoverService.getDiscoverData() ;

        res.status(200).json({
            data : result
        }); 
    }
    catch(err : any){
        res.status(400).json({
            msg : err.message
        });
    }
}