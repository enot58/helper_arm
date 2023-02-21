import express from "express";
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});
import MainEditMeterController from "../controller/mainEditMeterController.js"


router.get('/:id', MainEditMeterController.getOneMeter)
router.post('/:id', urlencodedParser, MainEditMeterController.saveOneMeter)





export default router;
