import express from "express";
const router = express.Router();
import IndexController from "../controller/indexController.js"
const urlencodedParser = express.urlencoded({extended: false});


router.get('/', IndexController.getForm);
router.post('/', urlencodedParser, IndexController.create)
router.post('/deleteMainMeter/:id', IndexController.del)



export default router;
