import Model from "../models/models.js";



class MainEditMeterController {

    async getOneMeter (req, res) {
        const mainTypeMeterId = req.params.id;
        await Model.MainAddMeter.findAll({
            where: {
                id: mainTypeMeterId
            },
            raw: true
        })
            .then((data) => {
                console.log(data)
                res.render('mainEditMeter', {
                    object: data
                })
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving tutorials."
                })
            })
    }

    async saveOneMeter (req, res) {
        const objectSection = req.body.section;
        const objectFloor = req.body.floor;
        const objectFlat = req.body.flat;
        const typeMeter = req.body.typeMeter;
        const objectNumberMeter = req.body.numberMeter;
        const objectSumMeter = req.body.sumMeter;
        const numKdl = req.body.numberKdl;
        const numAsr = req.body.numberAsr;
        const newEditMainMeterId = req.params.id;
        const comment = req.body.comment;

        const oldMainMeter = await Model.MainAddMeter.findOne({
            where: {
                id: newEditMainMeterId
            }
        })

        await oldMainMeter.update({
            section:objectSection,
            floor:objectFloor,
            flat:objectFlat,
            typeMeter: typeMeter,
            numberMeter:objectNumberMeter,
            sumMeter:objectSumMeter,
            numberKdl: numKdl,
            numberAsr: numAsr,
            comment: comment
        }).then(() => {
            res.redirect('/')
        }).catch((err) => {
            console.log(err)
        })


    }


}


export default new MainEditMeterController();
