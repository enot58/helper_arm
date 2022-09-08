import sequelize from "../db.js";
import { Sequelize } from "sequelize";
class User extends Sequelize.Model {}
User.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    idFrom: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    numberFlat: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    sequelize, modelName: "users"/*, timestamps: true, createdAt: true*/
})

class ObjectBuilds extends Sequelize.Model {}
ObjectBuilds.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    sequelize, modelName: "object_builds"
})

class ObjectSection extends Sequelize.Model {}

ObjectSection.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    valueFlat: {
        type: Sequelize.INTEGER,
        unique: true
    }
}, {
    sequelize, modelName: "object_section"
})



class ObjectFlat extends Sequelize.Model {}

ObjectFlat.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    valueFlat: {
        type: Sequelize.INTEGER,
        unique: true
    }
}, {
    sequelize, modelName: "object_flat"
})

class ObjectFloor extends Sequelize.Model {}

ObjectFloor.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    valueFlat: {
        type: Sequelize.INTEGER,
        unique: true
    }
}, {
    sequelize, modelName: "object_floor"
})
// ===== Связь много ко многим ======== //
// Цепляем объекты к секции , этажу квартирам
class ObjectHasSection extends Sequelize.Model {}
ObjectHasSection.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey :true,
        autoIncrement: true,
        allowNull: false
    }
},{
    sequelize, modelName: 'object_has_section'
})
ObjectBuilds.belongsToMany(ObjectSection, {through: ObjectHasSection})
ObjectSection.belongsToMany(ObjectBuilds, {through: ObjectHasSection})


class ObjectHasFloor extends Sequelize.Model {}
ObjectHasFloor.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey :true,
        autoIncrement: true,
        allowNull: false
    }
},{
    sequelize, modelName: 'object_has_floor'
})
ObjectBuilds.belongsToMany(ObjectFloor, {through: ObjectHasFloor})
ObjectFloor.belongsToMany(ObjectBuilds, {through: ObjectHasFloor})



class ObjectHasFlat extends Sequelize.Model {}
ObjectHasFlat.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey :true,
        autoIncrement: true,
        allowNull: false
    }
},{
    sequelize, modelName: 'object_has_flat'
})
ObjectBuilds.belongsToMany(ObjectFlat, {through: ObjectHasFlat})
ObjectFlat.belongsToMany(ObjectBuilds, {through: ObjectHasFlat})


// Цепляем к квартирам


//==========================================//


class TypeMeter extends Sequelize.Model {}
TypeMeter.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    sequelize, modelName: "type_meter"
})

class TypePribor extends Sequelize.Model {}
TypePribor.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    sequelize, modelName: "type_pribor"
})
class MainAddMeter extends Sequelize.Model {}

MainAddMeter.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    section: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    floor: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    flat: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    typeMeter: {
        type: Sequelize.STRING,
        allowNull: true
    },
    numberMeter: {
        type: Sequelize.STRING,
        allowNull: true
    },
    sumMeter: {
        type: Sequelize.FLOAT(11),
        allowNull: true
    },
    numberKdl: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: '0'
    },
    numberAsr: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: '0'
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: true
    }

},{
    sequelize, modelName: "main_meter"
})

export default {User, ObjectBuilds, TypeMeter, TypePribor, ObjectSection, ObjectFlat, ObjectFloor, ObjectHasSection, ObjectHasFlat, ObjectHasFloor, MainAddMeter}


