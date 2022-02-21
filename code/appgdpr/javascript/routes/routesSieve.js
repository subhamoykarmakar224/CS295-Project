const express = require('express')
const router = express.Router()
const {
    addSieveLogs
} = require('../utils/UtilsData')
const {prod} = require('../kafkaSieve/sieveProduce')
const {consom} = require('../kafkaSieve/sieveConsume')
const kafka = require('kafka-node')

router.get("/mget_obj", async (req, res) => {
    data = req.body
    id = data.id
    prop = data.prop
    info = data.info
    client = new kafka.KafkaClient()
    await prod(client, id, prop, info)
    const sol = await consom(client)
    res.status(200).send({message: sol.msg, data: sol.data})

})

module.exports = router