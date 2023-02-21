import {coolOrHotForData} from "../helper.js";

class Device {
    constructor(name, id, parentId, className, address, description) {
        this.name = name
        this.id = id
        this.parentId = parentId
        this.className = className
        this.address = address
        this.description = description
    }

    getUniversal_Heat_Counter (flat, number, section, floor) {
        return {
            name: `Счётчик тепла`,
            id: "ID=",
            parentId: "ParentID=",
            className: "ClassName=TMBusUniversal_Heat_Counter",
            address: "Адрес=0",
            description: `Описание=Счётчик тепла_${flat}`,
            active: "Активность=Нет",
            surveyOn: "Опрос по=Опросному номеру",
            samplingFrequency: "Частота опроса, минуты=60",
            recordingInterval: "Интервал записи показаний, мин=1440",
            transformationRatio: "Коэффициент трансформации=0.000000859845",
            fixedTransformationRatio: "Фиксированный коэффициент трансформации=Вт*ч в Гкал",
            units: "Единицы измерения=Гкал",
            expenseAddress: "Адрес расхода=",
            interrogationNumber: `Опросный номер=1${number}`,
            building: "Здание=-",
            entrance: "Подъезд=-",
            flat: "Квартира=-",
            subscriber: "Абонент=-",
            counterNumber: "Номер счетчика у абонента=",
            noFlowInterval: "Интервал отсутствия расхода, часы=0",
            overflowInterval: "Интервал превышения расхода, часы=0",
            permissibleFlowRate: "Допустимая величина расхода за интервал=0",
            dateOfPreviousVerification: "Дата предыдущей поверки, ДД.ММ.ГГГГ=",
            dateOfNextVerification: "Дата следующей поверки, ДД.ММ.ГГГГ=",
            commentOne: `Комментарий=Секция ${section}`,
            commentTwo: `Комментарий 2= Этаж ${floor}`
        }
    }

    getTMagicDevice_Teplo_Counter (flat, number, section, floor) {
        return {
            one: "",
            two: "",
            name: `Weser, Пульсар_ ${flat}`,
            id: "ID=",
            parentId: "ParentID=",
            className: "ClassName=TMagicDevice_Teplo_Counter",
            magicXml: "MagicXML=weser_pulsar_heatmeter.device",
            idef: "idef=WESER_PULSAR",
            address: `Адрес=${number}`,
            description: `Описание=Weser, Пульсар_ ${flat}`,
            active: "Активность=Нет",
            samplingFrequency: "Частота опроса, минуты=60",
            recordingInterval: "Интервал записи показаний, мин=1440",
            transformationRatio: "Коэффициент трансформации=1",
            serialNumber: "Серийный номер=",
            building: "Здание=-",
            entrance: "Подъезд=-",
            flat: "Квартира=-",
            subscriber: "Абонент=-",
            counterNumber: "Номер счетчика у абонента=",
            noFlowInterval: "Интервал отсутствия расхода, часы=0",
            overflowInterval: "Интервал превышения расхода, часы=0",
            dateOfPreviousVerification: "Дата предыдущей поверки, ДД.ММ.ГГГГ=",
            dateOfNextVerification: "Дата следующей поверки, ДД.ММ.ГГГГ=",
            commentOne: `Комментарий=Секция ${section}`,
            commentTwo: `Комментарий 2= Этаж ${floor}`
        }
    }

    getSummAsr(type, number, sum) {
        console.log(type)
        console.log(number)
        console.log(sum)
        let channel = new Map();
        channel.set(coolOrHotForData(type, number), sum)

        let newChannel = Object.fromEntries(channel)

        return newChannel
    }

}


export {Device};
