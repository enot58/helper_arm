import express from "express";
const router = express.Router();
import AllListController from "../controller/allListController.js"


router.get('/', AllListController.getPage)



export default router;
