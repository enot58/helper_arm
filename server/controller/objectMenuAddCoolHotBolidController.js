
class ObjectMenuAddCoolHotBolid {

    getPage (req, res) {
        try {
            const {id} = req.params
            console.log(id)
        } catch (e) {
            console.log(e)
        }
    }


}

export default new ObjectMenuAddCoolHotBolid()