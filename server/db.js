import {Sequelize} from "sequelize";

const sequelize = new Sequelize('askue_hbs', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: "mysql",
    define: {

    },
    logging: false
})


export default sequelize