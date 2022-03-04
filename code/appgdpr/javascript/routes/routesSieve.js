const express = require('express')
const router = express.Router()
const {
    addSieveLogs
} = require('../utils/UtilsData')
const { prod } = require('../kafkaSieve/sieveProduce')
const { consom } = require('../kafkaSieve/sieveConsume')
const kafka = require('kafka-node')

const buff = []

const get_data = function (limit, uid, qid, callback) {
    var i = 0
    return new Promise(function (resolve, reject) {
        var get_data = setInterval(function () {
            console.log('Loop: ' + i);
            var result = {}
            if (i === limit - 1) {
                clearInterval(get_data)
                reject(result)
            }
            for (var j = 0; j < buff.length; j++) {
                if (buff[j].uid == uid && buff[j].qid == qid) {
                    result = {
                        'result': buff[j].mallData,
                        'timestamp': buff[j].timestamp
                    }
                    clearInterval(get_data)
                    resolve(result)
                    break
                }
            }
            i++;
        }, 100)
    });
}

router.post("/data", async (req, res) => {
    buff.push({
        uid: req.body.uid,
        qid: req.body.qid,
        msg: req.body.msg,
        mallData: req.body.md,
        metaData: req.body.metaData,
        timestamp: Date.now()
    })
    res.status(200).send()
})

router.get("/dude", (req, res) => {
    uid = req.headers.uid
    qid = req.headers.qid

    get_data(20, uid, qid).then((result) => {
        res.status(200).send(result)
    })
})

router.post("/mget_obj", async (req, res) => {
    data = req.body
    id = data.id
    prop = data.prop
    info = data.info
    query = data.query
    qid = "mget_obj" + id + Date.now()
    updateKey = ""
    // const result = addSieveLogs("admin", data.id, JSON.stringify(data))
    client = new kafka.KafkaClient()
    await prod(client, id, prop, info, query, updateKey, qid)
    // const sol = await consom(client)
    get_data(100, id, qid).then((result) => {
        res.status(200).send(result)
    }).catch(() => {
        res.status(500).send({msg: "Ruh roh"});
    })
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
    const result = await addSieveLogs("admin", id, JSON.stringify({ prop: "id", info: id, query: "mget_entry" }))
    if (result) {
        res.status(200).send({ message: sol.msg, data: sol.data })
    } else {
        res.status(500).send({ message: "Unable to perform request at this time" })
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
    const result = await addSieveLogs("admin", id, JSON.stringify({ prop: "id", info: id, query: "mget_entry" }))
    if (result) {
        res.status(200).send({ message: sol.msg, data: sol.data })
    } else {
        res.status(500).send({ message: "Unable to perform request at this time" })
    }
})

router.put('/mmodify_metaobj/:key', async (req, res) => {
    const updateKey = req.params.key
    const data = req.body
    const id = updateKey
    prop = data.prop
    info = data.info
    query = data.query
    client = new kafka.KafkaClient()
    await prod(client, id, prop, info, query, updateKey)
    const sol = await consom(client)
    const result = addSieveLogs("admin", id, JSON.stringify({ prop: "id", info: id, query: "mget_entry" }))
    if (result) {
        res.status(200).send({ message: sol.msg, data: sol.data })
    } else {
        res.status(500).send({ message: "Unable to perform request at this time" })
    }
})

router.delete('/mdelete_obj/:key', async (req, res) => {
    const updateKey = req.params.key
    const id = updateKey
    prop = ''
    info = ''
    query = 'mdelete_obj'
    client = new kafka.KafkaClient()
    await prod(client, id, prop, info, query, updateKey)
    const sol = await consom(client)
    console.log(sol)
    const result = addSieveLogs("admin", id, JSON.stringify({ prop: "id", info: id, query: "mget_entry" }))
    if (sol.msg == 'Succ') {
        res.status(200).send({ message: sol.msg, data: sol.data })
    } else {
        res.status(500).send({ message: "Unable to perform request at this time" })
    }


})

module.exports = router