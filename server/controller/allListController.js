import Model from "../models/models.js"
import {retNumberFlat, coolOrHot, numberPlumAsr} from "../helper/helper.js"

class AllListController {
    async getPage (req, res) {
        try {
            const finish = []
            const allObject = await Model.MainAddMeter.findAll({
                order: [
                    ['flat', 'ASC']
                ],
                raw: true
            }).then((data) => {
                const {section, floor, flat, typeMeter,numberMeter,sumMeter, numberKdl, numberAsr, comment} = data
                data.map((d) => {
                    finish.push({
                        section: d.section,
                        floor: d.floor,
                        flat: retNumberFlat(d.flat),
                        typeMeter: d.typeMeter,
                        numberMeter: d.numberMeter,
                        sumMeter: d.sumMeter,
                        numberKdl: d.numberKdl,
                        numberAsr: d.numberAsr,
                        comment: d.comment,
                        chanel:`${d.numberKdl}/${d.numberAsr}/${coolOrHot(d.typeMeter, d).numPlum}`,
                        createdAt: d.createdAt
                    })
                })
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving tutorials."
                })
            })
            res.render('allList', {
                object: finish
            })
        } catch (e) {
            console.log(e)
        }
    }
}



export default new AllListController();
