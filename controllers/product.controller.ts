import { Request , Response } from "express";
import { product_services } from "../services/product.service";

const productService = new product_services() ;

export const getProducts = async (req : Request , res : Response) => {

    try {
        const {brand_id, gender, fragrance_family, search, page, limit} = req.query ;

        const products = await productService.search_product({
            brand_id : brand_id as string ,
            gender : gender as string ,
            fragrance_family : fragrance_family as string ,
            search : search as string ,
            page : parseInt(page as string) || 1 ,
            limit : parseInt(limit as string) || 10
        });

       res.status(200).json(products) ;

    } 
    catch (error : any) {
        res.status(500).json({ error : error.message }) ;
    }
}

export const getProductById = async (req : any , res : Response) => {

    try {
        const  id : string = req.params.id ;

        const product = await productService.getProductByIdService(id) ;
        res.status(200).json(product) ;
    }
    catch (error : any) {
        res.status(500).json({ error : error.message }) ;
    }
}

// Admin only
export const createProduct = async (req : any , res : Response) => {

    try {
        const productData = req.body ;
        const product = await productService.createProductService(productData) ;
        res.status(201).json(product) ;
    }
    catch (error : any) {
        res.status(500).json({ error : error.message }) ;
    }
}

export const updateProduct = async (req : any , res : Response) => {

    try {
        const product_id = req.params.id ;
        const data = req.body ;
        const updatedProduct = await productService.updateProductService(product_id , data) ;
        res.status(200).json(updatedProduct) ;
    }
    catch (error : any) {
        res.status(500).json({ error : error.message }) ;
    }
}

export const deleteProduct = async (req : any , res : Response) => {

    try {
        const product_id = req.params.id ;
        await productService.deleteProductService(product_id) ;
        res.status(200).json({ message : "Product deleted successfully" }) ;
    }
    catch (error : any) {
        res.status(500).json({ error : error.message }) ;
    }
}

export const getProductReviews = async (req : any , res : Response) => {

    try {
        const product_id = req.params.id ;
        const reviews = await productService.getProductReviewsService(product_id) ;
        res.status(200).json(reviews) ;
    }
    catch (error : any) {
        res.status(500).json({ error : error.message }) ;
    }
}

export const addProductReview = async (req : any , res : Response) => {

    try {
        const product_id = req.params.id ;
        const user_id = req.user.userId ;
        const { rating , comment } = req.body ;

        if(!rating){
            res.status(400).json({ error : "Rating is required" }) ;
            return ;
        }

        const review = await productService.addProductReviewService(user_id , product_id , rating , comment) ;
        res.status(201).json(review) ;
    }
    catch (error : any) {
        res.status(500).json({ error : error.message }) ;
    }
}