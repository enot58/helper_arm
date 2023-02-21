
class ObjectMenuAddCoolHotBolidController {

    getPage (req, res) {
        try {
            const {id} = req.params


            return res.render('objectMenuAddCoolHotBolid', {
                object: {
                    id: id
                }
            })
        } catch (e) {
            console.log(e)
        }
    }


}

export default new ObjectMenuAddCoolHotBolidController()