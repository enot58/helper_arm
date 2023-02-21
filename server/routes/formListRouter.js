import express from "express";
const router = express.Router();
import FormListController from "../controller/formListController.js"
const urlencodedParser = express.urlencoded({extended: false});

router.get('/', FormListController.getPage)
router.post('/formGetWater', urlencodedParser, FormListController.getWater)
router.post('/formHotMeter', urlencodedParser, FormListController.getHotMeter)
router.post('/formElMeter', urlencodedParser, FormListController.getElMeter)
router.post('/wantTree', urlencodedParser, FormListController.getKDLdat)
router.get('/kdl', FormListController.getKdl)



export default router;
