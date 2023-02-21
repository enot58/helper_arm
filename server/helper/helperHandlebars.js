import Handlebars from "handlebars";

const getFunction = () => {
    return Handlebars.registerHelper('genSelect', (object) => {

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
}


export {getFunction}