import Models from "../models/models.js";

class IndexTwoController {

   async getPageAndObjects (req, res) {
        try {
            // Получаем все объекты
            const objects = await Models.ObjectBuilds.findAll({raw: true})
            return res.render('indexTwo', {
                objects: objects
            })
        } catch (e) {
            console.log(e)
        }
    }

    async createObject (req, res) {
        try {

            const {nameObject, descriptionObject} = req.body
            const object = await Models.ObjectBuilds.create({
                name: nameObject,
                description: descriptionObject
            })
            return res.redirect('/')

        } catch (e) {
            console.log(e)
        }
   }


    async getOneObject (req, res) {
       try {

           const {id} = req.params
           console.log(id)
           return  res.render('objectMenu', {
               object: {
                   id: id
               }
           })
       } catch (e) {
           console.log(e)
       }

    }



}

export default new IndexTwoController();