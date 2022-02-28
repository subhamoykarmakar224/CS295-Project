const express = require('express')
const router = express.Router()
const {
    addSieveLogs
} = require('../utils/UtilsData')
const {prod} = require('../kafkaSieve/sieveProduce')
const {consom} = require('../kafkaSieve/sieveConsume')
const kafka = require('kafka-node')

router.post("/mget_obj", async (req, res) => {
    data = req.body
    id = data.id
    prop = data.prop
    info = data.info
    query = data.query
    updateKey = ""
    console.log(data)
    client = new kafka.KafkaClient()
    await prod(client, id, prop, info, query, updateKey)
    const sol = await consom(client)
    const result = await addSieveLogs("admin", data.id, JSON.stringify(data))
    if (result) {
        res.status(200).send({message: sol.msg, data: sol.data})
    } else {
        res.status(500).send({message: "Unable to perform request at this time"})
    }
})

router.get('/mget_entry/:id', async (req, res) => {
    const id = req.params.id
    prop = "id"
    info = id
    query = "mget_entry"
    updateKey = ""
    client = new kafka.KafkaClient()
    await prod(client, id, prop, info, query, updateKey)
    const sol = await consom(client)
    const result = await addSieveLogs("admin", id, JSON.stringify({prop: "id", info: id, query:"mget_entry"}))
    if (result) {
        res.status(200).send({message: sol.msg, data: sol.data})
    } else {
        res.status(500).send({message: "Unable to perform request at this time"})
    }
})

router.put('/mmodify_obj/:key', async (req, res) => {
    const updateKey = req.params.key
    const data = req.body
    const id = updateKey
    prop = data.prop
    info = data.info
    query = data.query
    client = new kafka.KafkaClient()
    await prod(client, id, prop, info, query, updateKey)
    const sol = await consom(client)
    const result = await addSieveLogs("admin", id, JSON.stringify({prop: "id", info: id, query:"mget_entry"}))
    if (result) {
        res.status(200).send({message: sol.msg, data: sol.data})
    } else {
        res.status(500).send({message: "Unable to perform request at this time"})
    }


})

module.exports = router