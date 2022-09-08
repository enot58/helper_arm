import sequelize from "./db.js";
import models from "./models/models.js"
import express, {response} from "express";
import handlebars from "express-handlebars";
import hbs from "hbs";
import Handlebars from "handlebars";
import {exportUsersToExcel} from './exportService.js'
import fs, { truncate } from 'fs'
import {exportHotMeterToExcel} from "./exportService.js";
import {exportElMeterToExcel} from "./exportService.js";

import xlsx from 'xlsx';
//=============================Работа с excel===================//









//============================================================//





const urlencodedParser = express.urlencoded({extended: false});
const app = express();

const connectBase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Соединение с БД было успешно установлено')
    } catch (e) {
        console.log('Невозможно выполнить подключение к БД: ', e)
    }
}
connectBase()
await sequelize.sync({force: false});


app.use(express.json());




// ==========================================================================================
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
// ==========================================================================================







(async () => {
    await sequelize.sync().then( () => [
        app.listen(5111, function () {
            console.log("Сервер ожидает подключения...");
        })
    ]);
})();
//=========================Excel=====================//
app.get('/getPribor', (request, response) => {
    models.MainAddMeter.findAll({
        where : {
            typeMeter: 'Счётчик тепла'
        },
        raw: true
    }).then((data) => {
        response.render('allList', {
            object:data
        })
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })

})



//===================================================//
/*
* await models.MainAddMeter.aggregate(
        'numberKdl', 'DISTINCT', { plain: false},
    )
* */
// Папка для excel
const dir = './xl'
const lengthFolder = (director) => {
    fs.readdir(dir, (err, files) => {
        return files.length;
    });
}
lengthFolder(dir);

app.get("/formlist", async (request, response) => {

    /*const users = [
        {
            id: 0,
            name: 'Peter',
            age: 31
        },
        {
            id: 1,
            name: 'John',
            age: 23
        }
    ];
    const workSheetColumnName = [
        "ID",
        "Name",
        "Age"
    ]
    const workSheetName = 'Users';
    const filePath = './xl/index.xlsx';
    exportUsersToExcel(users, workSheetColumnName, workSheetName, filePath)*/
    /*await models.MainAddMeter.findAll({
        attributes: ['numberKdl'],
        raw: true


}).then((data) => {
        console.log(data)
    }).catch((err) => {
        response.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials."
        })
    })*/

    await response.render('formList')
    /* await response.download('./xl/index.xlsx', 'index.xlsx', (err) => {
         console.log(err)
     })*/
})


const workSheetColumnName = [
    "name",
    "id",
    "parentId",
    "className",
    "marka",
    "numberShleif",
    "description",
    "active",
    "multiplier",
    "refN",
    "intervalNe",
    "ser_number",
    "interval_rec",
    "revers",
    "timeBefore",
    "numberAbonent",
    "flowGap",
    "flowGapTwo",
    "averageDischarge",
    "dataBeforePoverki",
    "dataAfterPoverki",
    "commentOne",
    "commentTwo"
]

app.post("/formlist",urlencodedParser, async (request, response) => {
    const finishArr = [];
    await models.MainAddMeter.findAll({
        where: {
            numberKdl: request.body.numberKdl
        },
        raw:true
    }).then (async (data) => {

        await data.map((d) => {

            function numberPlumAsr (num) {
                const numPlum = num * 2;
                return numPlum;
            }
            function coolOrHot (type) {
                if (type === 'Счётчик горячей воды') {

                    return {
                        cn: 'ClassName=TBolid_HotWater_Counter',
                        numPlum: numberPlumAsr(d.numberAsr) + 2
                    }
                } else {
                    return {
                        cn: 'ClassName=TBolid_ColdWater_Counter',
                        numPlum: numberPlumAsr(d.numberAsr) + 1
                    }
                }
            }
            function retNumberFlat (n) {
                if (n.toString().length === 1) {

                    return `00${n}`
                } if (n.toString().length === 2 ) {
                    return `0${n}`
                } else {
                    return `${n}`
                }
            }

            finishArr.push({
                name: d.typeMeter,
                id: 'ID=',
                parentId: 'ParentID=',
                className: coolOrHot(d.typeMeter).cn,
                marka: 'Марка счетчика=',
                numberShleif: `Номер шлейфа=${coolOrHot(d.typeMeter).numPlum}`,
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
        console.log(finishArr)
    }).catch((err) => {
        response.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials."
        })
    })
    const workSheetName = 'ASR';
    const filePath = './xl/index.xlsx';
    await exportUsersToExcel(finishArr, workSheetColumnName, workSheetName, filePath)
    await response.download('./xl/index.xlsx', 'index.xlsx', (err) => {
        console.log(err)
    })
    /*response.redirect('formList')*/
})

// Заголовки для тепла Берилл
/*const workSheetColumnNameHotMeter = [
    "name",
    "id",
    "parentId",
    "className",
    "address",
    "description",
    "active",
    "survey",
    "reportRate",
    "interval_rec",
    "refT",
    "fRef",
    "unit",
    "addressFlowRate",
    "numberSurvey",
    "numberSubscriber",
    "flowGap",
    "flowGapTwo",
    "averageDischarge",
    "dataBeforePoverki",
    "dataAfterPoverki",
    "commentOne",
    "commentTwo"
]

app.post("/formHotMeter", urlencodedParser, async (request, response) => {
    const finishArrHotMeter = [];
    await models.MainAddMeter.findAll({
        where: {
            typeMeter: 'Счётчик тепла',
            section: request.body.formHotMeter
        },
        raw: true
    }).then(async (data) => {

        await data.map((d) => {

            function retNumberFlat (n) {
                if (n.toString().length === 1) {

                    return `00${n}`
                } if (n.toString().length === 2 ) {
                    return `0${n}`
                } else {
                    return `${n}`
                }
            }

            finishArrHotMeter.push({
                name:d.typeMeter,
                id:'ID=',
                parentId:'ParentID=',
                className:'ClassName=TMBusUniversal_Heat_Counter',
                address:'Адрес=0',
                description:`Описание=Счётчик тепла_${retNumberFlat(d.flat)}`,
                active:'Активность=Нет',
                survey:'Опрос по=Опросному номеру',
                reportRate:'Частота опроса, минуты=1400',
                interval_rec:'Интервал записи показаний, мин=1440',
                refT:'Коэффициент трансформации=0.000000859845',
                fRef:'Фиксированный коэффициент трансформации=Вт*ч в Гкал',
                unit:'Единицы измерения=Гкал',
                addressFlowRate:'Адрес расхода=',
                numberSurvey:`Опросный номер=${d.numberMeter}`,
                numberSubscriber:'Номер счетчика у абонента=',
                flowGap:'Интервал отсутствия расхода, часы=0',
                flowGapTwo:'Интервал превышения расхода, часы=0',
                averageDischarge:'Допустимая величина расхода за интервал=0',
                dataBeforePoverki:'Дата предыдущей поверки, ДД.ММ.ГГГГ=',
                dataAfterPoverki:'Дата следующей поверки, ДД.ММ.ГГГГ=',
                commentOne:`Комментарий=Секция №${d.section}_этаж_${d.floor}`,
                commentTwo:`Комментарий 2=Начальные показания_${d.sumMeter}/${d.comment}`
            })

        })


    }).catch((err) => {
        response.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials."
        })
    })
    const workSheetName = 'Тепло';
    const filePath = './xl/index.xlsx';
    await exportHotMeterToExcel(finishArrHotMeter, workSheetColumnNameHotMeter, workSheetName, filePath)
    await response.download('./xl/index.xlsx', 'hot.xlsx', (err) => {
        console.log(err)
    })
   /!* response.redirect('formList')*!/
})*/

/*// Заголовки для тепла Пульсар Sanext
const workSheetColumnNameHotMeter = [
    "name",
    "id",
    "parentId",
    "className",
    "address",
    "description",
    "active",
    //"survey",
    //"reportRate",
    "interval_rec",
    //"refT",
    //"fRef",
    "unit",
    //"addressFlowRate",
    //"numberSurvey",
    "serialNumber",
    "numberSubscriber",
    "flowGap",
    "flowGapTwo",
    "averageDischarge",
    "dataBeforePoverki",
    "dataAfterPoverki",
    "commentOne",
    "commentTwo"
]

app.post("/formHotMeter", urlencodedParser, async (request, response) => {
    const finishArrHotMeter = [];
    await models.MainAddMeter.findAll({
        where: {
            typeMeter: 'Счётчик тепла',
            section: request.body.formHotMeter
        },
        raw: true
    }).then(async (data) => {

        await data.map((d) => {

            function retNumberFlat (n) {
                if (n.toString().length === 1) {

                    return `00${n}`
                } if (n.toString().length === 2 ) {
                    return `0${n}`
                } else {
                    return `${n}`
                }
            }

            finishArrHotMeter.push({
                name:'Компактный теплосчетчик, SANEXT',
                id:'ID=',
                parentId:'ParentID=',
                className:'ClassName=TPulsar_CompactHeatCounter',
                address:`Адрес прибора=${d.numberMeter}`,
                description:`Описание=Компактный теплосчетчик, SANEXT_${retNumberFlat(d.flat)}`,
                active:'Активность=Нет',
                //survey:'Опрос по=Опросному номеру',
                reportRate:'Частота опроса, минуты=60',
                interval_rec:'Интервал записи показаний, мин=1440',
                //refT:'Коэффициент трансформации=0.000000859845',
                //fRef:'Фиксированный коэффициент трансформации=Вт*ч в Гкал',
                unit:'Единицы измерения=Гкал',
                serialNumber: 'Серийный номер=',
                //addressFlowRate:'Адрес расхода=',
                //numberSurvey:`Опросный номер=${d.numberMeter}`,
                numberSubscriber:'Номер счетчика у абонента=',
                flowGap:'Интервал отсутствия расхода, часы=0',
                flowGapTwo:'Интервал превышения расхода, часы=0',
                averageDischarge:'Допустимая величина расхода за интервал=0',
                dataBeforePoverki:'Дата предыдущей поверки, ДД.ММ.ГГГГ=',
                dataAfterPoverki:'Дата следующей поверки, ДД.ММ.ГГГГ=',
                commentOne:`Комментарий=Секция №${d.section}_этаж_${d.floor}`,
                commentTwo:`Комментарий 2=Начальные показания_${d.sumMeter}/${d.comment}`
            })

        })


    }).catch((err) => {
        response.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials."
        })
    })
    const workSheetName = 'Тепло';
    const filePath = './xl/index.xlsx';
    await exportHotMeterToExcel(finishArrHotMeter, workSheetColumnNameHotMeter, workSheetName, filePath)
    await response.download('./xl/index.xlsx', 'hot.xlsx', (err) => {
        console.log(err)
    })
    /!* response.redirect('formList')*!/
})*/
// Заголовки Пульсар Weser

const workSheetColumnNameHotMeter = [
    "name",
    "id",
    "parentId",
    "className",
    "xml",
    "idef",
    "address",
    "description",
    "active",
    "reportRate",
    "interval_rec",
    "refT",

    //"survey",


    //"fRef",
    //"unit",
    //"addressFlowRate",
    //"numberSurvey",
    "serialNumber",
    "numberSubscriber",
    "flowGap",
    "flowGapTwo",
    "averageDischarge",
    "dataBeforePoverki",
    "dataAfterPoverki",
    "commentOne",
    "commentTwo"
]

app.post("/formHotMeter", urlencodedParser, async (request, response) => {
    const finishArrHotMeter = [];
    await models.MainAddMeter.findAll({
        where: {
            typeMeter: 'Счётчик тепла',
            section: request.body.formHotMeter
        },
        raw: true
    }).then(async (data) => {

        await data.map((d) => {



            function retAddressNumber (n) {
                const address = n.toString()
                const lengthAddress = address.length;
                const lengthMin = address.length - 7;

                const  result = address.slice(1, lengthAddress)

                return result;
            }

            function retNumberFlat (n) {
                if (n.toString().length === 1) {

                    return `00${n}`
                } if (n.toString().length === 2 ) {
                    return `0${n}`
                } else {
                    return `${n}`
                }
            }

            finishArrHotMeter.push({
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






            })

        })


    }).catch((err) => {
        response.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials."
        })
    })
    console.log(finishArrHotMeter)
    const workSheetName = 'Тепло';
    const filePath = './xl/index.xlsx';
    await exportHotMeterToExcel(finishArrHotMeter, workSheetColumnNameHotMeter, workSheetName, filePath)
    await response.download('./xl/index.xlsx', 'hot.xlsx', (err) => {
        console.log(err)
    })
    //response.redirect('formList')
})



// Заголовки для электрики
const workSheetColumnNameElMeter = [
    "name",
    "id",
    "parentId",
    "className",
    "MagicXML",
    "idef",
    "address",
    "password",
    "description",
    "active",
    "survey",
    "interval_rec",
    "refT",
    "serialNumber",
    "numberSubscriber",
    "flowGap",
    "flowGapTwo",
    "averageDischarge",
    "dataBeforePoverki",
    "dataAfterPoverki",
    "commentOne",
    "commentTwo",
    "typeSerialNumber",
    "recordParams",
    "requestParameter"
]
app.post("/formElMeter", urlencodedParser, async (request, response) => {
    const finishArrElMeter = [];
    /*{
        id: 40,
            section: 1,
        floor: 10,
        flat: 3,
        typeMeter: 'Счётчик электроэнергии',
        numberMeter: '11111123456789',
        sumMeter: 111,
        numberKdl: 0,
        numberAsr: 0,
        comment: '',
        createdAt: 2022-05-19T07:25:43.000Z,
        updatedAt: 2022-05-19T07:25:43.000Z
    },*/

    await models.MainAddMeter.findAll({
        where: {
            typeMeter: 'Счётчик электроэнергии',
            section: request.body.formElMeter
        },
        raw: true
    }).then(async (data) => {

        await data.map((d) => {
            function retAddressNumber (n) {
                const address = n.toString()
                const lengthAddress = address.length;
                const lengthMin = address.length - 9;

                const  result = address.substr(lengthMin, lengthAddress)

                return result;
            }
            function retNumberFlat (n) {
                if (n.toString().length === 1) {

                    return `00${n}`
                } if (n.toString().length === 2 ) {
                    return `0${n}`
                } else {
                    return `${n}`
                }
            }


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





    }).catch((err) => {
        response.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials."
        })
    })
    const workSheetName = 'Электрика';
    const filePath = './xl/index.xlsx';
    await exportElMeterToExcel(finishArrElMeter, workSheetColumnNameElMeter, workSheetName, filePath)
    await response.download('./xl/index.xlsx', 'el.xlsx', (err) => {
        console.log(err)
    })
})

// Получить дерево
// Заголовки дерева
const workSheetColumnTree = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',

]
app.post('/wantTree',urlencodedParser, async (request, response) => {
    const headerTree = [];
    const twoArrTree = [];
    const threeArrTree = [];
    const finishArrTree = [];

    await models.MainAddMeter.findAll({
        where: {
            flat: 10
        },
        raw: true
    }).then((data) => {
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })

    response.redirect('formList')
})


app.get("/", async (request, response) => {


    const {section} = request.query;
    const {floor} = request.query;
    const {flat} = request.query;

    if (flat) {
        await models.MainAddMeter.findAll({

            where: {
                flat: flat
            },
            raw: true
        })
            .then((data) => {
                response.render('index', {
                    object: data
                })
            })
            .catch((err) => {
                response.status(500).send({
                    message: err.message || "Some error occurred while retrieving tutorials."
                })
            })
    } else {
        await models.MainAddMeter.findAll({

            order: [
                ['updatedAt', 'DESC']
                //['createdAt', 'DESC']
                //['flat', 'ASC']
            ],
            raw: true
        })
            .then((data) => {
                response.render('index', {
                    object: data
                })
            })
            .catch((err) => {
                response.status(500).send({
                    message: err.message || "Some error occurred while retrieving tutorials."
                })
            })
    }


    /*if (section && floor) {
        await models.MainAddMeter.findAll({
            where: {
                section: section,
                floor: floor,
            },
            order: [
                //['createdAt', 'DESC']
                ['flat', 'ASC']
            ],
            raw: true
        })
            .then((data) => {
                response.render('index', {
                    object: data
                })
            })
            .catch((err) => {
                response.status(500).send({
                    message: err.message || "Some error occurred while retrieving tutorials."
                })
            })
    } else {
        await models.MainAddMeter.findAll({
            order: [
                ['createdAt', 'DESC']
                //['flat', 'ASC']
            ],
            raw: true
        })
            .then((data) => {
                response.render('index', {
                    object: data
                })
            })
            .catch((err) => {
                response.status(500).send({
                    message: err.message || "Some error occurred while retrieving tutorials."
                })
            })
    }
*/

    /*try {
        if (section && floor && flat) {
            await models.MainAddMeter.findAll({
                where: {
                    section: section,
                    floor: floor,
                    flat: flat
                },
                order: [
                    //['createdAt', 'DESC']
                    ['flat', 'ASC']
                ],
                raw: true
            })
                .then((data) => {
                    response.render('index', {
                        object: data
                    })
                })
                .catch((err) => {
                    response.status(500).send({
                        message: err.message || "Some error occurred while retrieving tutorials."
                    })
                })
        } if (section && floor) {
            await models.MainAddMeter.findAll({
                where: {
                    section: section,
                    floor: floor,
                },
                order: [
                    //['createdAt', 'DESC']
                    ['flat', 'ASC']
                ],
                raw: true
            })
                .then((data) => {
                    response.render('index', {
                        object: data
                    })
                })
                .catch((err) => {
                    response.status(500).send({
                        message: err.message || "Some error occurred while retrieving tutorials."
                    })
                })
        } if (section && flat){
            await models.MainAddMeter.findAll({
                where: {
                    section: section,
                    flat: flat
                },
                order: [
                    //['createdAt', 'DESC']

                    ['flat', 'ASC']
                ],
                raw: true
            })
                .then((data) => {
                    response.render('index', {
                        object: data
                    })
                })
                .catch((err) => {
                    response.status(500).send({
                        message: err.message || "Some error occurred while retrieving tutorials."
                    })
                })
        } if (floor && flat) {
            await models.MainAddMeter.findAll({
                where: {
                    floor: floor,
                    flat: flat
                },
                order: [
                    //['createdAt', 'DESC']
                    ['floor', 'ASC'],
                    ['flat', 'ASC']
                ],
                raw: true
            })
                .then((data) => {
                    response.render('index', {
                        object: data
                    })
                })
                .catch((err) => {
                    response.status(500).send({
                        message: err.message || "Some error occurred while retrieving tutorials."
                    })
                })
        } if (section) {
            await models.MainAddMeter.findAll({
                where: {
                    section: section,
                },
                order: [
                    //['createdAt', 'DESC']
                    ['floor', 'ASC'],
                    ['flat', 'ASC']
                ],
                raw: true
            })
                .then((data) => {
                    response.render('index', {
                        object: data
                    })
                })
                .catch((err) => {
                    response.status(500).send({
                        message: err.message || "Some error occurred while retrieving tutorials."
                    })
                })
        } if (floor) {
            await models.MainAddMeter.findAll({
                where: {
                    floor: floor
                },
                order: [
                    //['createdAt', 'DESC']
                    ['flat', 'ASC']
                ],
                raw: true
            })
                .then((data) => {
                    response.render('index', {
                        object: data
                    })
                })
                .catch((err) => {
                    response.status(500).send({
                        message: err.message || "Some error occurred while retrieving tutorials."
                    })
                })
        } if (flat) {
            await models.MainAddMeter.findAll({
                where: {
                    flat: flat
                },
                order: [
                    //['createdAt', 'DESC']
                    ['flat', 'ASC']
                ],
                raw: true
            })
                .then((data) => {
                    response.render('index', {
                        object: data
                    })
                })
                .catch((err) => {
                    response.status(500).send({
                        message: err.message || "Some error occurred while retrieving tutorials."
                    })
                })
        } else {
            await models.MainAddMeter.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: 40,
                raw: true
            })
                .then((data) => {
                    response.render('index', {
                        object: data
                    })
                })
                .catch((err) => {
                    response.status(500).send({
                        message: err.message || "Some error occurred while retrieving tutorials."
                    })
                })
        }
    } catch (e) {
        console.log(e)*/

    /*await models.MainAddMeter.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 40,
        raw: true
    })
        .then((data) => {
            response.render('index', {
                object: data
            })
        })
        .catch((err) => {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            })
        })
}*/


})



app.post("/",urlencodedParser, async (request, response)=> {

    const objectSection = request.body.section;
    const objectFloor = request.body.floor;
    const objectFlat = request.body.flat;
    const typeMeter = request.body.typeMeter;
    const objectNumberMeter = request.body.numberMeter;
    const objectSumMeter = request.body.sumMeter;
    const numAsr = request.body.numberAsr;
    const numKdl = request.body.numberKdl;
    const comment = request.body.comment;

    await models.MainAddMeter.create({
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
        response.redirect('/')
    }).catch((err) => {
        console.log(err)
    })

} )
// Удаляем тип счётчика
app.post('/deleteMainMeter/:id', async (request, response) => {
    const mainTypeMeterId = request.params.id;
    console.log(request.params)
    await models.MainAddMeter.destroy({
        where: {id: mainTypeMeterId}
    }).then( () => {
        response.redirect('/')
    })
})


app.get("/mainEditMeter/:id", async (request, response) => {
    const mainTypeMeterId = request.params.id;
    console.log(request.params)
    await models.MainAddMeter.findAll({
        where: {
            id: mainTypeMeterId
        },
        raw: true
    })
        .then((data) => {
            console.log(data)
            response.render('mainEditMeter', {
                object: data
            })
        })
        .catch((err) => {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            })
        })

})
app.post("/mainEditMeter/:id",urlencodedParser, async (request, response)=> {

    const objectSection = request.body.section;
    const objectFloor = request.body.floor;
    const objectFlat = request.body.flat;
    const typeMeter = request.body.typeMeter;
    const objectNumberMeter = request.body.numberMeter;
    const objectSumMeter = request.body.sumMeter;
    const numKdl = request.body.numberKdl;
    const numAsr = request.body.numberAsr;
    const newEditMainMeterId = request.params.id;
    const comment = request.body.comment;
    console.log(newEditMainMeterId)

    const oldMainMeter = await models.MainAddMeter.findOne({
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
        response.redirect('/')
    }).catch((err) => {
        console.log(err)
    })

} )
//Все данные Лист
/*{
    id: 102,
    section: 1,
    floor: 8,
    flat: 256,
    typeMeter: 'Счётчик горячей воды',
    numberMeter: '214646037',
    sumMeter: 0.117,
    numberKdl: 2,
    numberAsr: 14,
    comment: '',
    createdAt: 2022-04-29T12:09:59.000Z,
    updatedAt: 2022-04-29T12:09:59.000Z
  },*/
app.get('/allList', async (request, response) => {
    const finish = []
    const allObject = await models.MainAddMeter.findAll({
        order: [
            ['flat', 'ASC']
        ],
        raw: true
    }).then((data) => {

        function retNumberFlat (n) {
            if (n.toString().length === 1) {

                return `00${n}`
            } if (n.toString().length === 2 ) {
                return `0${n}`
            } else {
                return `${n}`
            }
        }
        const {section, floor, flat, typeMeter,numberMeter,sumMeter, numberKdl, numberAsr, comment} = data
        data.map((d) => {

            function numberPlumAsr (num) {
                const numPlum = num * 2;
                return numPlum;
            }
            function coolOrHot (type) {
                if (type === 'Счётчик горячей воды') {

                    return {
                        cn: 'ClassName=TBolid_HotWater_Counter',
                        numPlum: numberPlumAsr(d.numberAsr) + 2
                    }
                } else {
                    return {
                        cn: 'ClassName=TBolid_ColdWater_Counter',
                        numPlum: numberPlumAsr(d.numberAsr) + 1
                    }
                }
            }function numberPlumAsr (num) {
                const numPlum = num * 2;
                return numPlum;
            }
            function coolOrHot (type) {
                if (type === 'Счётчик горячей воды') {

                    return {
                        cn: 'ClassName=TBolid_HotWater_Counter',
                        numPlum: numberPlumAsr(d.numberAsr) + 2
                    }
                } else {
                    return {
                        cn: 'ClassName=TBolid_ColdWater_Counter',
                        numPlum: numberPlumAsr(d.numberAsr) + 1
                    }
                }
            }

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
                chanel:`${d.numberKdl}/${d.numberAsr}/${coolOrHot(d.typeMeter).numPlum}`,
                createdAt: d.createdAt
            })
        })
        /*response.render('allList', {
            object: data
        })*/
    }).catch(err => {
        response.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials."
        })
    })
    response.render('allList', {
        object: finish
    })

})





// Отдаём на фронт страницу и рендерим страницу
app.get("/addObject", async (request, response) => {
    await models.ObjectBuilds.findAll({raw: true})
        .then((data) => {
            response.render('addObject', {
                object: data
            })
        })
        .catch((err) => {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            })
        })
})
// Получаем данные и одаём в БД
app.post("/addObject", urlencodedParser, async (request, response) => {
    const objectName = request.body.name;
    const objectAddress = request.body.address;
    const objectFlat = request.body.flat;
    const objectSection = request.body.section;
    const objectFloor = request.body.floor;
    await models.ObjectBuilds.create({
        name: objectName,
        address: objectAddress,
        flat: objectFlat,
        section: objectSection,
        floor: objectFloor
    }).then(() => {
        response.redirect('/addObject')
    }).catch((err) => {
        console.log(err)
    })
    console.log(request.body)
})
// Удаляем объект
app.post('/deleteObject/:id', async (request, response) => {
    const objectId = request.params.id;
    console.log(request.params)
    await models.ObjectBuilds.destroy({
        where: {id: objectId}
    }).then( () => {
        response.redirect('/addObject')
    })
})

// Редактирование объекта
app.get('/editObject/:id', async (request,  response) => {
    const objectId = request.params.id;
    await models.ObjectBuilds.findAll({
        where: {
            id: objectId
        },
        raw: true
    }).then((data) => {
        console.log(data)
        response.render('editObject', {
            objectOld: data
        })
    }).catch((err) => {
        console.log(err)
    })

})

app.post('/editObject/:id',urlencodedParser, async (request, response) => {
    const newObjectName = request.body.newName;
    const newObjectAddress = request.body.newAddress;
    const newObjectFlat = request.body.flat;
    const newObjectSection = request.body.section;
    const newObjectFloor = request.body.floor;
    const newEditObjectId = request.params.id;
    console.log(newEditObjectId)

    const oldObject = await models.ObjectBuilds.findOne({
        where: {
            id: newEditObjectId
        }
    })

    await oldObject.update({
        name: newObjectName,
        address: newObjectAddress,
        flat: newObjectFlat,
        section: newObjectSection,
        floor: newObjectFloor
    }).then(() => {
        response.redirect(`/editObject/${newEditObjectId}`)
    }).catch((err) => {
        console.log(err)
    })
})

/*
Handlebars.registerHelper('genSection', (objectOld) => {
    const sectionObject = objectOld[0].section
    const arr = [
        `
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Секция № ${sectionObject}
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    dsafdagf
                </div>
            </div>
        </div>
    `
    ]

    const sectionHtml = `
        <div class="row">
        <div class="col">
            col 1
        </div>
    </div>
    `
    const arrSection = []
    // Перебор секций
    for (let i = 0; i < sectionObject; i++) {
        arrSection.push(
`
<div class="row">
    <div class="col">

    </div>
</div>`)
    }




    return new Handlebars.SafeString(arrSection);


})
*/

Handlebars.registerHelper('genSelect', (object) => {

    const d = object[0].typeMeter;
    console.log(d)
    const selectS = `
        <select name="typeMeter" class="form-select mt-2" aria-label="Default select example">
                <option selected>Выбор счётчика</option>
                <option value="Счётчик горячей воды">Счётчик горячей воды</option>
                <option value="Счётчик холодной воды">Счётчик холодной воды</option>
                <option value="Счётчик электроэнергии">Счётчик электроэнергии</option>
                <option value="Счётчик тепла">Счётчик тепла</option>
            </select>
    `
    const selectHot = `
            <select name="typeMeter" class="form-select mt-2" aria-label="Default select example">
                <option>Выбор счётчика</option>
                <option selected value="Счётчик горячей воды">Счётчик горячей воды</option>
                <option value="Счётчик холодной воды">Счётчик холодной воды</option>
                <option value="Счётчик электроэнергии">Счётчик электроэнергии</option>
                <option value="Счётчик тепла">Счётчик тепла</option>
            </select>
            `
    const coolHot = `
            <select name="typeMeter" class="form-select mt-2" aria-label="Default select example">
                <option>Выбор счётчика</option>
                <option value="Счётчик горячей воды">Счётчик горячей воды</option>
                <option selected value="Счётчик холодной воды">Счётчик холодной воды</option>
                <option value="Счётчик электроэнергии">Счётчик электроэнергии</option>
                <option value="Счётчик тепла">Счётчик тепла</option>
            </select>`

    const energ = `
            <select name="typeMeter" class="form-select mt-2" aria-label="Default select example">
                <option>Выбор счётчика</option>
                <option value="Счётчик горячей воды">Счётчик горячей воды</option>
                <option value="Счётчик холодной воды">Счётчик холодной воды</option>
                <option selected value="Счётчик электроэнергии">Счётчик электроэнергии</option>
                <option value="Счётчик тепла">Счётчик тепла</option>
            </select>`
    const hotMeter = `
            <select name="typeMeter" class="form-select mt-2" aria-label="Default select example">
                <option>Выбор счётчика</option>
                <option value="Счётчик горячей воды">Счётчик горячей воды</option>
                <option value="Счётчик холодной воды">Счётчик холодной воды</option>
                <option value="Счётчик электроэнергии">Счётчик электроэнергии</option>
                <option selected value="Счётчик тепла">Счётчик тепла</option>
            </select>`

    switch (d) {
        case 'Выбор счётчика':
            return new Handlebars.SafeString(selectS);
        case 'Счётчик горячей воды':
            return new Handlebars.SafeString(selectHot);
        case 'Счётчик холодной воды':
            return new Handlebars.SafeString(coolHot);
        case 'Счётчик электроэнергии':
            return new Handlebars.SafeString(energ);
        case 'Счётчик тепла':
            return new Handlebars.SafeString(hotMeter);
    }
})








//===========================================================//

// Отдаём счётчик на фронт
app.get('/addType', async (request, response) => {

    await models.TypeMeter.findAll({raw: true})
        .then((data) => {
            response.render('addType', {
                type: data
            })
        })
        .catch((err) => {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            })
        })


})
// Удаляем тип счётчика
app.post('/deleteTypeMeter/:id', (request, response) => {
    const typeMeterId = request.params.id;
    console.log(request.params)
    models.TypeMeter.destroy({
        where: {id: typeMeterId}
    }).then( () => {
        response.redirect('/addType')
    })
})



app.post('/addType',urlencodedParser, async (request, response) => {


    const typeMeter = request.body.meterType;
    models.TypeMeter.create({
        name: typeMeter
    }).then((data) => {
        console.log(data);
        response.redirect('/addType')
    })

})







//==========================================================//

// Добавляем приборы
app.get('/addTypePribor', async (request, response) => {



    await models.TypePribor.findAll({raw: true})
        .then((data) => {
            response.render('addTypePribor', {
                type: data
            })
        })
        .catch((err) => {
            response.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            })
        })


})
// Удаляем тип счётчика
app.post('/deleteTypePribor/:id', (request, response) => {
    const typePriborId = request.params.id;
    console.log(request.params)
    models.TypePribor.destroy({
        where: {id: typePriborId}
    }).then( () => {
        response.redirect('/addTypePribor')
    })
})



app.post('/addTypePribor',urlencodedParser, async (request, response) => {


    const typePribor = request.body.priborType;
    models.TypePribor.create({
        name: typePribor
    }).then((data) => {
        console.log(data);
        response.redirect('/addTypePribor')
    })

})


let wb = xlsx.readFile('./test.xlsx');

let ws = wb.Sheets["Устройства"]
let data = xlsx.utils.sheet_to_json(ws)

console.log(data[0]['Квартира']);

function cutString (name) {
    let newStr = name.split('_')
    return newStr[1]
}

//cutString(data[0]['Квартира'])



 async function addHome(arr) {


    for (let i = 0; i < arr.length; i++) {

        let meters = data[i]['Устройство']
        let numberMeter = data[i]['Серийный номер']
        let flat = cutString(data[i]['Квартира'])
        let summ = data[i]['Сумма']



        await models.MainAddMeter.create({
            flat: flat,
            typeMeter: meters,
            numberMeter: numberMeter,
            sumMeter: summ
        }).then(() => {
            console.log(`Добавлена квартира №${flat}`)
        }).catch((err) =>{
            console.log(err)
        })

    }
}

//addHome(data)
let wbTwo = xlsx.readFile('./kdl_6.xlsx');

let wsTwo = wbTwo.Sheets["Sheet1"]
let dataTwo = xlsx.utils.sheet_to_json(wsTwo)


async function findAndAdd (arr, numberKdl) {

    for (let i = 0; i < arr.length; i++) {
        let numberShl = dataTwo[i]['Номер шлейфа']
        let serNumber = dataTwo[i]['Серийный номер']

        const oldMain = await models.MainAddMeter.findOne({
            where: {
                numberMeter: serNumber
            }
        }).catch((err) => {
            console.log(err)
        })

        await oldMain.update({
            numberKdl: numberKdl,
            numberAsr: numberShl
        }).then(() => {
            console.log(`Yes`)
        }).catch((err) => {
            console.log(err)
        })

    }


}

async function dropHome(arr) {

    for (let i = 0; i < arr.length; i++) {

        let numberMeter = data[i]['Серийный номер']

        const oneFlat = await models.MainAddMeter.findOne({
            numberMeter: numberMeter
        })

        if (oneFlat) {
            await models.MainAddMeter.destroy({
                where: {
                    id: oneFlat.id
                }
            }).then(() =>{
                console.log("Удалена")
            })
        }
    }
}


//findAndAdd(dataTwo, 6)
//dropHome(data)

//=====================Показания

// Определяем дату и время

let now = new Date();
// console.log(now.getMonth())
// Функция для даты
function newDate (value) {
    let i = value.toString();
    console.log(i.length)
    if (i.length < 2) {
        return "0" + i;
    } else {
        return i;
    }
}

//console.log(newDate(now.getDate()))
// Далее файл обновляется
function updateFile(name) {
    fs.writeFile(name, "Здесь текст", (err) => {
        if (err) throw err;
        console.log("Файл обновлён")
    })
}
// Функция добавляет заголовок, должна запускаеться один раз
function fileHandlerTwo(name){
    fs.appendFile(`${name}.dat`, `{"Time":"${newDate(now.getDay())}.${newDate(now.getMonth())}.${now.getFullYear()} ${newDate(now.getHours())}:${newDate(now.getMinutes())}:${newDate(now.getSeconds())}","Показания":[`, (err) => {
        if(err) throw err;
        console.log('Data has been added!');
    });
}
//fileHandlerTwo('hello')



// Здесь массив
async function oneFunc (numberKdl, nameFile) {

    fileHandlerTwo(nameFile)




    const oneKdl = await models.MainAddMeter.findAll({
        where: {
            numberKdl: numberKdl
        },
        raw: true
    }).then((data) => {

        let i = 1;
        data.map((d) => {

            if (i === data.length) {
                function updateFile(name) {
                    fs.appendFile(`${name}.dat`,`{"${d.numberAsr}":${d.sumMeter}}]}` , (err) => {
                        if (err) throw err;
                        // console.log("Файл обновлён")
                    })
                }
                updateFile(nameFile);
            } else {
                function updateFile(name) {
                    fs.appendFile(`${name}.dat`,`{"${d.numberAsr}":${d.sumMeter}},` , (err) => {
                        if (err) throw err;
                        // console.log("Файл обновлён")
                    })
                }
                updateFile(nameFile);
            }

            /*if (i != data.length) {
                function updateFile(name) {
                    fs.appendFile(`${name}.dat`,`{"${d.numberAsr}":${d.sumMeter}},` , (err) => {
                        if (err) throw err;
                        // console.log("Файл обновлён")
                    })
                }
                updateFile(nameFile);
            } else if (i === data.length) {
                function updateFile(name) {
                    fs.appendFile(`${name}.dat`,`{"${d.numberAsr}":${d.sumMeter}}]}` , (err) => {
                        if (err) throw err;
                        // console.log("Файл обновлён")
                    })
                }
                updateFile(nameFile);
            }*/

            i = i + 1;

        })
        console.log(i)

    })

}



//oneFunc(6, 'kdl_6')

