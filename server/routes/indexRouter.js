import express from "express";
const router = express.Router();
import IndexController from "../controller/indexController.js"
import indexTwoController from "../controller/indexTwoController.js";
const urlencodedParser = express.urlencoded({extended: false});


//router.get('/', IndexController.getForm);
router.get('/', indexTwoController.getPageAndObjects);
router.get('/:id', indexTwoController.getOneObject);
//router.post('/', urlencodedParser, IndexController.create)
router.post('/', urlencodedParser, indexTwoController.createObject)
router.post('/deleteMainMeter/:id', IndexController.del)


export default router;
