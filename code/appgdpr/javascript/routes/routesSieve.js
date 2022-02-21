const express = require('express')
const router = express.Router()
const {
    addSieveLogs
} = require('../utils/UtilsData')
const {prod} = require('../kafkaSieve/sieveProduce')
const {consom} = require('../kafkaSieve/sieveConsume')

router.get("/mget_obj", async (req, res) => {
    data = req.body
    id = data.id
    prop = data.prop
    info = data.info
    console.log("id: " + id + " prop: " + prop + " info: " + info)
    await prod(id, prop, info)
    await consom()
    res.status(200).send({message:"good"})

})

module.exports = router