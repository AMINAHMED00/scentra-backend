import { Router } from "express";
import { getProducts, getProductById, getProductReviews, addProductReview, createProduct, deleteProduct, updateProduct } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const productRouter = Router() ;

productRouter.get("/" , getProducts) ;
productRouter.get("/:id" , getProductById) ;
productRouter.get('/:id/reviews', getProductReviews);

productRouter.post('/:id/reviews' , addProductReview) ;

productRouter.post('/' , authMiddleware(["admin"]) , createProduct) ;
productRouter.patch('/:id' , authMiddleware(["admin"]) , updateProduct) ;
productRouter.delete('/:id' , authMiddleware(["admin"]) , deleteProduct) ;

export default productRouter ;