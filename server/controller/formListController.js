import Model from "../models/models.js"
import sequelize from "../db.js";
import {coolOrHot, retNumberFlat, retAddressNumber} from "../helper/helper.js";
import {exportWaterMetersToExcel, exportElMeterToExcel} from "../exportService.js";
import {workSheetColumnName} from "../helper/headersMeter.js";
import {workSheetColumnNameHotMeter} from "../helper/headersMeter.js";
import {exportHotMeterToExcel} from "../exportService.js";
import {workSheetColumnNameElMeter} from "../helper/headersMeter.js";
import {Device} from "../helper/device/index.js";
import fs from "fs";
import path from "path";


class FormListController {
    async getPage (req, res) {
        try {

            await Model.MainAddMeter.findAll({

                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('section')) ,'section'],
                ],
                raw: true
            }).then((data) => {
                res.render('formList', {
                    sections: data
                })
            }).catch((err) => {
                console.log(err)
            })
        } catch (e) {
            console.log(e)
        }
    }

    async getKdl (req, res) {
        try {
            const {section} = req.query

            const allKdl = Model.MainAddMeter.findAll({
                where: {section: section},
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('numberKdl')) ,'numberKdl'],
                ],
                raw: true
            }).then((data) => {
                let newData = []
                let z = data.filter((n) => {
                    return n.numberKdl > 0
                })
                res.json(z)

            })


        } catch (e) {
            console.log(e)
        }
    }

    async getKDLdat (req, res) {
        try {
            let {formWaterMeterSection} = req.body
            let {formWaterMeterKdl} = req.body
            let arrReturnSumm = []



            const summChannel = await Model.MainAddMeter.findAll({
                where: {
                    numberKdl: formWaterMeterKdl,
                    section: formWaterMeterSection
                },
                raw: true
            }).then((data) => {
                data.map((d) => {
                    const summReturn = new Device()
                    arrReturnSumm.push(summReturn.getSummAsr(d.typeMeter, d.numberAsr, d.sumMeter))
                })
            })

            let strArrReturnSumm = JSON.stringify(arrReturnSumm)
            const filePath = './datTxt/index.txt';
            fs.writeFile(
                filePath,
                strArrReturnSumm,
                'utf8',
                (err) => {
                    if (err) throw err;
                    console.log("Done")
                    res.download(filePath, 'index.txt', (err) => {
                        console.log(err)
                    })
                }
            )


        } catch (e) {
            console.log(e)
        }
    }


    async getWater (req, res) {

        try {

            const {formWaterMeter, numberKdl} = req.body;


            const finishArr = [];
            // Подготовим заголовки
            // Первая строка
            let title = ["Дерево устройств"]
            // Вторая строка
            let waterTwoString = [
                "секция_TEST_C2000-Ethernet_вода",
                "ID=",
                "ClassName=TC2000EthernetChannel",
                "Активность=Нет",
                "Описание=секция_TEST_C2000-Ethernet_вода",
                "IP Адрес=192.168.10.1",
                "Порт=1",
                "Режим работы=Надёжный",
                "Операторы=",
                "Комментарий="
            ]
            // Третья строка
            let waterThreeString = [
                "",
                "[RS-485] Болид",
                "ID=",
                "ParentID=",
                "ClassName=TOrion_RS485_Interface",
                "Активность=Нет",
                "Описание=[RS-485] Болид",
                "Тайм-аут чтения, мсек=5000",
                "Пауза между командами, мс=4",
                "Число неответов до потери=4",
                "Комментарий="
            ]
            // Четвёртая строка
            let waterFourString = [
                "",
                "",
                "С2000-КДЛ",
                "ID=",
                "ParentID=",
                "ClassName=TKDLRegistrator",
                `Адрес прибора=${numberKdl}`,
                "Активность=Нет",
                `Описание=С2000-КДЛ_${numberKdl}`,
                "Частота опроса, мин=0",
                "Комментарий="
            ]
            let mainArr = [title, waterTwoString, waterThreeString,waterFourString]
            await Model.MainAddMeter.findAll({
                where: {
                    numberKdl: numberKdl,
                    section: formWaterMeter
                },
                raw:true
            }).then((data) => {
                //console.log(data)
                data.map((d) => {
                    console.log(d)
                    finishArr.push({
                        one:"",
                        two:"",
                        three: "",
                        name: d.typeMeter,
                        id: 'ID=',
                        parentId: 'ParentID=',
                        className: coolOrHot(d.typeMeter, d).cn,
                        marka: 'Марка счетчика=',
                        numberShleif: `Номер шлейфа=${coolOrHot(d.typeMeter, d).numPlum}`,
                        description: `Описание=${d.typeMeter}_${retNumberFlat(d.flat)}`,
                        active: 'Активность=Нет',
                        multiplier: 'Множитель пересчета импульсов=1000',
                        refN: 'Коэффициент трансформации=1',
                        intervalNe: 'Допустимый интервал недостоверности счета=3600',
                        ser_number: `Серийный номер=${d.numberMeter}`,
                        interval_rec: 'Интервал записи показаний, мин=1440',
                        revers: 'Обратный счет=Нет',
                        timeBefore: 'Время до потери счётчика, часов=24',
                        numberAbonent: 'Номер счетчика у абонента=',
                        flowGap: 'Интервал отсутствия расхода, часы=0',
                        flowGapTwo: 'Интервал превышения расхода, часы=0',
                        averageDischarge: 'Допустимая величина расхода за интервал=0',
                        dataBeforePoverki: 'Дата предыдущей поверки, ДД.ММ.ГГГГ=',
                        dataAfterPoverki: 'Дата следующей поверки, ДД.ММ.ГГГГ=',
                        commentOne: `Комментарий=АСР №${d.numberKdl}/${d.numberAsr}_секция № ${d.section}_ этаж ${d.floor}`,
                        commentTwo: `Комментарий 2=Начальные показания : ${d.sumMeter}/ ${d.comment}`
                    })

                })

                // Здесь с excel
                const workSheetName = 'ASR';
                const filePath = './xl/index.xlsx';
                //exportWaterMetersToExcel(finishArr, workSheetColumnName, workSheetName, filePath)

                if (exportWaterMetersToExcel(finishArr, mainArr, workSheetName, filePath)) {
                    res.download('./xl/index.xlsx', `Вода_секция_${formWaterMeter}_KDL_${numberKdl}.xlsx`, (err) => {
                        console.log(err)
                    })
                } else {
                    res.send({message: "Ошибочка"})
                }

            }).catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving tutorials."
                })
            })


        } catch (e) {
            console.log(e)
        }
    }

    async getHotMeter (req, res) {
        try {
            // Подготовим заголовки
            // Первая строка
            let title = ["Дерево устройств"]
            // Вторая строка
            let waterTwoString = [
                "секция_TEST_C2000-Ethernet_тепло",
                "ID=",
                "ClassName=TC2000EthernetChannel",
                "Активность=Нет",
                `Описание=секция_${req.body.formHotMeter}_TEST__C2000-Ethernet_тепло`,
                "IP Адрес=192.168.10.1",
                "Порт=1",
                "Режим работы=Надёжный",
                "Операторы=",
                "Комментарий="
            ]
            // Третья строка
                let waterThreeString = [
                "",
                "[RS-485/MBus] Weser, Пульсар",
                "ID=",
                "ParentID=",
                "ClassName=TMagicDevice_RS485_Interface",
                "MagicXML=weser_pulsar_heatmeter.device",
                "Активность=Нет",
                "Скорость порта=9600",
                "Описание=[RS-485/MBus] Weser, Пульсар",
                'Число неответов до потери=3',
                "Пауза между командами, мсек=100",
                "Тайм-аут чтения, мсек=3000",
                "Задержка между счётчиками, мсек=100",
                "Четность=NOPARITY",
                "Совместимость с Карат-911=Нет",
                "Режим работы=Основной",
                "Комментарий="
            ]

            let mainArr = [title, waterTwoString, waterThreeString]
            const finishArrHotMeter = [];
            await Model.MainAddMeter.findAll({
                where: {
                    typeMeter: 'Счётчик тепла',
                    section: req.body.formHotMeter
                },
                raw: true
            }).then((data) => {
                //console.log(data)
                const pulsar = new Device()
                data.map((d) => {
                    finishArrHotMeter.push(pulsar.getTMagicDevice_Teplo_Counter(retNumberFlat(d.flat), d.numberMeter, d.section, d.floor))
                    /*finishArrHotMeter.push({
                        name:'Weser, Пульсар',
                        id:'ID=',
                        parentId:'ParentID=',
                        className:'ClassName=TMagicDevice_Teplo_Counter',
                        xml: 'MagicXML=weser_pulsar_heatmeter.device',
                        idef: 'idef=WESER_PULSAR',
                        address:`Адрес=${retAddressNumber(d.numberMeter)}`,
                        description:`Описание=Weser, Пульсар_${retNumberFlat(d.flat)}`,
                        active:'Активность=Нет',
                        reportRate:'Частота опроса, минуты=60',
                        interval_rec:'Интервал записи показаний, мин=1440',
                        refT: 'Коэффициент трансформации=1',
                        serialNumber: 'Серийный номер=',
                        numberSubscriber:'Номер счетчика у абонента=',
                        flowGap:'Интервал отсутствия расхода, часы=0',
                        flowGapTwo:'Интервал превышения расхода, часы=0',
                        averageDischarge:'Допустимая величина расхода за интервал=0',
                        dataBeforePoverki:'Дата предыдущей поверки, ДД.ММ.ГГГГ=',
                        dataAfterPoverki:'Дата следующей поверки, ДД.ММ.ГГГГ=',
                        commentOne:`Комментарий=Секция №${d.section}_этаж_${d.floor}`,
                        commentTwo:`Комментарий 2=Начальные показания_${d.sumMeter}/${d.comment}`
                        //survey:'Опрос по=Опросному номеру',
                        //refT:'Коэффициент трансформации=0.000000859845',
                        //fRef:'Фиксированный коэффициент трансформации=Вт*ч в Гкал',
                        //unit:'Единицы измерения=Гкал',
                        //addressFlowRate:'Адрес расхода=',
                        //numberSurvey:`Опросный номер=${d.numberMeter}`,
                    })*/
                })

                const workSheetName = 'Тепло';
                const filePath = './xl/index.xlsx';

                if (exportHotMeterToExcel(finishArrHotMeter, mainArr, workSheetName, filePath)) {
                    res.download('./xl/index.xlsx', `Тепло_Секция_${req.body.formHotMeter}.xlsx`, (err) => {
                        console.log(err)
                    })
                } else {
                    res.send({message: "Ошибочка"})
                }

            }).catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving tutorials."
                })
            })
        } catch (e) {
            console.log(e)
        }

    }

    async getElMeter (req, res) {
        const finishArrElMeter = [];
        await Model.MainAddMeter.findAll({
            where: {
                typeMeter: 'Счётчик электроэнергии',
                section: req.body.formElMeter
            },
            raw: true
        }).then((data) => {

            data.map((d) => {
                console.log(d)
                finishArrElMeter.push({
                    name:'Энергомера СЕ102М',
                    id:'ID=',
                    parentId:'ParentID=',
                    className:'ClassName=TMagicDevice_Electro_Counter',
                    MagicXML:'MagicXML=energomera.device',
                    idef:'idef=ENERGOMERA102_ECOUNTER',
                    address:`Адрес=${retAddressNumber(d.numberMeter)}`,
                    password:'Пароль=777777',
                    description:`Описание=Энергомера СЕ102М_${retNumberFlat(d.flat)}`,
                    active:'Активность=Нет',
                    survey:'Частота опроса, минуты=60',
                    interval_rec:'Интервал записи показаний, мин=1440',
                    refT:'Коэффициент трансформации=1',
                    serialNumber:'Серийный номер=',
                    numberSubscriber:'Номер счетчика у абонента=',
                    flowGap:'Интервал отсутствия расхода, часы=0',
                    flowGapTwo:'Интервал превышения расхода, часы=0',
                    averageDischarge:'Допустимая величина расхода за интервал=0',
                    dataBeforePoverki:'Дата предыдущей поверки, ДД.ММ.ГГГГ=',
                    dataAfterPoverki:'Дата следующей поверки, ДД.ММ.ГГГГ=',
                    commentOne:`Комментарий=Секция №${d.section}_этаж_${d.floor}`,
                    commentTwo:`Комментарий 2=Начальные показания_${d.sumMeter}/${d.comment}`,
                    typeSerialNumber:'Тип серийного номера=Технологический',
                    recordParams:'Записывать технологические параметры=Нет',
                    requestParameter:'Запросить технологические параметры=Нет'
                })
            })

            const workSheetName = 'Электрика';
            const filePath = './xl/index.xlsx';

            if (exportElMeterToExcel(finishArrElMeter, workSheetColumnNameElMeter, workSheetName, filePath)) {
                res.download('./xl/index.xlsx', 'index.xlsx', (err) => {
                    console.log(err)
                })
            } else {
                res.send({message: "Ошибочка"})
            }
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            })
        })
    }




}


export default new FormListController();