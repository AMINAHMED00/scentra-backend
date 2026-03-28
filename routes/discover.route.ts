import { Router } from "express";
import { getDiscoverData } from "../controllers/discover.controller";

const discoverRouter = Router() ;

discoverRouter.get('/' , getDiscoverData);

export default discoverRouter ;