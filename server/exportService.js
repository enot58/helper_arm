import xlsx from 'xlsx';
import path from 'path';












const exportExcelWater = (data, workSheetColumnNames, workSheetName, filePath) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [...workSheetColumnNames, ... data];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}


const exportExcelHot = (data, workSheetColumnNames, workSheetName, filePath) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [...workSheetColumnNames, ... data];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}

const exportWaterMetersToExcel = (finishArr, workSheetColumnNames, workSheetName, filePath) => {
    const data = finishArr.map(fA => {
        return [
            fA.one,
            fA.two,
            fA.three,
            fA.name,
            fA.id,
            fA.parentId,
            fA.className,
            fA.marka,
            fA.numberShleif,
            fA.description,
            fA.active,
            fA.multiplier,
            fA.refN,
            fA.intervalNe,
            fA.ser_number,
            fA.interval_rec,
            fA.revers,
            fA.timeBefore,
            fA.numberAbonent,
            fA.flowGap,
            fA.flowGapTwo,
            fA.averageDischarge,
            fA.dataBeforePoverki,
            fA.dataAfterPoverki,
            fA.commentOne,
            fA.commentTwo
        ];
    });
    exportExcelWater(data, workSheetColumnNames, workSheetName, filePath);
    return true
}

const exportHotMeterToExcel = (finishArrHotMeter, workSheetColumnNameHotMeter, workSheetName, filePath) => {
    /*const data = finishArrHotMeter.map(fA => {
        return [
            fA.name,
            fA.id,
            fA.parentId,
            fA.className,
            fA.xml,
            fA.idef,
            fA.address,
            fA.description,
            fA.active,
            //fA.survey,
            fA.reportRate,
            fA.interval_rec,
            fA.refT,
            //fA.fRef,
            //fA.unit,
            fA.serialNumber,
            //fA.addressFlowRate,
            //fA.numberSurvey,
            fA.numberSubscriber,
            fA.flowGap,
            fA.flowGapTwo,
            fA.averageDischarge,
            fA.dataBeforePoverki,
            fA.dataAfterPoverki,
            fA.commentOne,
            fA.commentTwo
        ];
    });*/
    //const arrHeader = Object.keys(finishArrHotMeter[0])


    const data = finishArrHotMeter.map((val) => {
        return Object.values(val)

    })



    exportExcelHot(data, workSheetColumnNameHotMeter, workSheetName, filePath);
    return true
}











const exportElMeterToExcel = (finishArrElMeter, workSheetColumnNameElMeter, workSheetName, filePath) => {
    const data = finishArrElMeter.map(fA => {
        return [
            fA.name,
        fA.id,
        fA.parentId,
        fA.className,
        fA.MagicXML,
        fA.idef,
        fA.address,
        fA.password,
        fA.description,
        fA.active,
        fA.survey,
        fA.interval_rec,
        fA.refT,
        fA.serialNumber,
        fA.numberSubscriber,
        fA.flowGap,
        fA.flowGapTwo,
        fA.averageDischarge,
        fA.dataBeforePoverki,
        fA.dataAfterPoverki,
        fA.commentOne,
        fA.commentTwo,
        fA.typeSerialNumber,
        fA.recordParams,
        fA.requestParameter
        ];
    });

    exportExcel(data, workSheetColumnNameElMeter, workSheetName, filePath);
    return true
}




export {exportWaterMetersToExcel, exportHotMeterToExcel, exportElMeterToExcel}