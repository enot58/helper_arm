import express from "express";
import objectMenuAddCoolHotBolidController from "../controller/objectMenuAddCoolHotBolidController.js";
const router = express.Router();


router.get('/:id', objectMenuAddCoolHotBolidController.getPage)



export default router;