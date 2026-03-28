import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route';
import "dotenv/config";
import homeRouter from './routes/home.route';
import discoverRouter from './routes/discover.route';
import productRouter from './routes/product.route';
import cartRouter from './routes/cart.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// apis

app.use('/api/auth' , authRouter);
app.use('/api/home' , homeRouter);
app.use('/api/discover' , discoverRouter) ;
app.use('/api/products' , productRouter) ;
app.use('/api/cart' , cartRouter) ;

app.listen(PORT, ()=>{
      console.log(`server running at => http://localhost:${PORT} ;`);
});


export default app;