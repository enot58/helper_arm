import express from "express";
const router = express.Router();
import indexRouter from "./indexRouter.js";
import mainEditMeterRouter from "./mainEditMeterRouter.js"
import allListRouter from "./allListRouter.js"
import formListRouter from "./formListRouter.js"


router.use('/', indexRouter)
router.use('/mainEditMeter', mainEditMeterRouter)
router.use('/allList', allListRouter)
router.use('/formList', formListRouter)


export default router;
