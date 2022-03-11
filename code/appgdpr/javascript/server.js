const express = require('express')
const app = express()
const routesAdmin = require('./routes/routesAdmin')
const routesData = require('./routes/routesData')
const routesSieve = require('./routes/routesSieve')
const { registerDefaultAdmin } = require('./utils/UtilsAdmin')
const { countLogs, insertLog } = require('./db')


app.use(express.json())

// ========= ADMIN =========
app.use('/admin', routesAdmin)
app.use('/log', routesData)
app.use('/sieve', routesSieve)


// ========= USER =========



app.listen(5344, async () => {
    console.log('Enroll Admin!')
    res = await registerDefaultAdmin()
    console.log(res)
    // syncLogs()
})

const getCountLogs = async () => {
    var cnt = new Promise(function (resolve, reject) {
        countLogs(resolve, reject)
    })
    await cnt
    var count = 0
    await cnt.then(res => {
        // console.log('res in getcount server', res)
        count = res
    }).catch((e) => {
        console.log(e)
        return 0
    })
    // console.log('count in server function: ', count)
    return count
}

const syncLogs = async () => { 
    var s = setInterval(async () => {
        var count = await getCountLogs()
        console.log('countin sync log: ', count)
        // while (count !== 0) {
        await insertLog()
        count = await getCountLogs()
        console.log('countin whilesync log: ', count)
        // }
    }, 10000)
    
}
