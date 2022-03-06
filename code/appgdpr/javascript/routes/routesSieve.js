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
            // console.log(buff.length)
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
                    buff.splice(j, 1)
                    clearInterval(get_data)
                    resolve(result)
                    break
                }
            }
            i++;
        }, 10)
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

    get_data(1000, uid, qid).then((result) => {
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
    get_data(1000, id, qid).then((result) => {
        res.status(200).send(result)
    }).catch(() => {
        res.status(500).send({msg: "Ruh roh"});
    })
})

router.get('/mget_entry/:device_id/:id', async (req, res) => {
    const entry = req.params.id
    const device_id = req.params.device_id
    prop = "id"
    info = entry
    query = "mget_entry"
    updateKey = ""
    qid = "mget_entry" + device_id + Date.now()
    client = new kafka.KafkaClient()
    await prod(client, device_id, prop, info, query, updateKey, qid)
    get_data(1000, device_id, qid).then((result) => {
        res.status(200).send(result)
    }).catch(() => {
        res.status(500).send({msg: "Ruh roh"});
    })
})

//edit
router.put('/mmodify_obj/:device_id/:id', async (req, res) => {
    const updateKey = req.params.id
    const data = req.body
    const id = req.params.device_id
    prop = data.prop
    info = data.info
    query = data.query
    qid = "mmodify_obj" + id + Date.now()
    client = new kafka.KafkaClient()
    await prod(client, id, prop, info, query, updateKey, qid)
    const sol = await consom(client)
    get_data(1000, id, qid).then((result) => {
        res.status(200).send(result)
    }).catch(() => {
        res.status(500).send({msg: "Ruh roh"});
    })
})

//edit
router.put('/mmodify_metaobj/:device_id/:id', async (req, res) => {
    const updateKey = req.params.id
    const data = req.body
    const id = req.params.device_id
    prop = data.prop
    info = data.info
    query = data.query
    client = new kafka.KafkaClient()
    qid = "mmodify_metaobj" + id + Date.now()
    await prod(client, id, prop, info, query, updateKey, qid)
    const sol = await consom(client)
    get_data(1000, id, qid).then((result) => {
        res.status(200).send(result)
    }).catch(() => {
        res.status(500).send({msg: "Ruh roh"});
    })
})

// edit
router.delete('/mdelete_obj/:device_id/:id', async (req, res) => {
    const updateKey = req.params.id
    const id = req.params.device_id
    prop = ''
    info = ''
    query = 'mdelete_obj'
    client = new kafka.KafkaClient()
    qid = "mdelete_obj" + id + Date.now()
    await prod(client, id, prop, info, query, updateKey, qid)
    const sol = await consom(client)
    get_data(1000, id, qid).then((result) => {
        res.status(200).send(result)
    }).catch(() => {
        res.status(500).send({msg: "Ruh roh"});
    })


})

module.exports = router