import Model from "../models/models.js"



class IndexController {
    // Получаем всю форму и передаём последний добавленный
    async getForm(req, res) {
        try {
            const {section, floor, flat} = req.query;

            if (flat) {
                await Model.MainAddMeter.findAll({
                    where: {
                        flat: flat
                    },
                    raw: true
                }).then((data) => {
                    res.render('index', {
                        object: data
                    })
                }).catch((err) => {
                    res.status(500).send({
                        message: err.message || "Ооо.....ошибочка"
                    })
                })
            } else if (section) {
                try {
                    await Model.MainAddMeter.findAll({
                        where: {
                            section: section
                        },
                        raw: true
                    }).then((data) => {

                        res.render('index', {
                            object: data
                        })
                    }).catch((err) => {
                        res.status(500).send({
                            message: err.message || "Ооо.....ошибочка"
                        })
                    })
                } catch (e) {
                    console.log(e)
                }
            } else {
                await Model.MainAddMeter.findAll({
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    raw: true
                }).then((data) => {
                    res.render('index', {
                        object: data,
                        objectOne: data[0]
                    })
                }).catch((err) => {
                    res.status(500).send({
                        message: err.message || "Ооо.....ошибочка"
                    })
                })
            }
        } catch (e) {
            console.log(e)
        }


    }

    async create(req, res) {
        try {
            const objectSection = req.body.section;
            const objectFloor = req.body.floor;
            const objectFlat = req.body.flat;
            const typeMeter = req.body.typeMeter;
            const objectNumberMeter = req.body.numberMeter;
            const objectSumMeter = req.body.sumMeter;
            const numAsr = req.body.numberAsr;
            const numKdl = req.body.numberKdl;
            const comment = req.body.comment;

            console.log(typeMeter)

            await Model.MainAddMeter.create({
                section:objectSection,
                floor:objectFloor,
                flat:objectFlat,
                typeMeter: typeMeter.toString(),
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

        } catch (e) {
            console.log(e)
        }


    }

    async del(req, res) {
        const mainTypeMeterId = req.params.id;
        console.log(req.params)
        await Model.MainAddMeter.destroy({
            where: {id: mainTypeMeterId}
        }).then( () => {
            res.redirect('/')
        })
    }
}

export default new IndexController();