import express from "express";
const router = express.Router();
import indexRouter from "./indexRouter.js";
import mainEditMeterRouter from "./mainEditMeterRouter.js"
import allListRouter from "./allListRouter.js"
import formListRouter from "./formListRouter.js"
import objectMenuAddCoolHotBolidRouter from "./objectMenuAddCoolHotBolidRouter.js";


router.use('/', indexRouter)
router.use('/mainEditMeter', mainEditMeterRouter)
router.use('/allList', allListRouter)
router.use('/formList', formListRouter)
router.use('/objectMenuAddCoolHotBolid', objectMenuAddCoolHotBolidRouter)

export default router;
