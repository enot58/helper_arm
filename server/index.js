import sequelize from "./db.js";
import models from "./models/models.js"
import express from "express";
import handlebars from "express-handlebars";
import hbs from "hbs";
import Handlebars from "handlebars";

import fs from 'fs'
import {exportHotMeterToExcel} from "./exportService.js";
import {exportElMeterToExcel} from "./exportService.js";
import router from "./routes/index.js";
import xlsx from 'xlsx'
import {getFunction} from "./helper/helperHandlebars.js";
const urlencodedParser = express.urlencoded({extended: false});
const PORT = 5123

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


app.use('/', router);

app.use(express.json());

// Папка для excel
const dir = './xl'
const lengthFolder = (director) => {
    fs.readdir(dir, (err, files) => {
        return files.length;
    });
}
lengthFolder(dir);



// ==========================================================================================
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', '../client/views');
// ==========================================================================================


(async () => {
    await sequelize.sync().then( () => [
        app.listen(PORT, function () {
            console.log(`Сервер ожидает подключения ${PORT}`);
        })
    ]);
})();
// Хелпер handlebars
getFunction();

/*app.post("/formElMeter", urlencodedParser, async (request, response) => {
    const finishArrElMeter = [];


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
})*/












