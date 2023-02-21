
//Функция принимает номер квартиры и возвращает с добавлением нулей
function retNumberFlat (n) {
    if (n.toString().length === 1) {
        return `00${n}`
    } if (n.toString().length === 2 ) {
        return `0${n}`
    } else {
        return `${n}`
    }
}


function numberPlumAsr (num) {
    const numPlum = num;
    return numPlum;
}

function coolOrHot (type, val) {
    if (type === 'Счётчик горячей воды') {
        return {
            cn: 'ClassName=TBolid_HotWater_Counter',
            numPlum: numberPlumAsr(val.numberAsr) + 1
        }
    } else {
        return {
            cn: 'ClassName=TBolid_ColdWater_Counter',
            numPlum: numberPlumAsr(val.numberAsr)
        }
    }
}

function coolOrHotForData (type, val) {
    if (type === 'Счётчик горячей воды') {
        return numberPlumAsr(val) + 1
    } else {
        return numberPlumAsr(val)
    }
}

function retAddressNumber (n) {
    const address = n.toString()
    const lengthAddress = address.length;
    const lengthMin = address.length - 7;

    const  result = address.slice(1, lengthAddress)

    return result;
}


export {retNumberFlat, numberPlumAsr, coolOrHot, retAddressNumber, coolOrHotForData}

