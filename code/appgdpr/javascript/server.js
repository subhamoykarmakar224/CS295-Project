const express = require('express')
const app = express()
const routesAdmin = require('./routes/routesAdmin')
const routesData = require('./routes/routesData')
const { registerDefaultAdmin } = require('./utils/UtilsAdmin')


app.use(express.json())

// ========= ADMIN =========
app.use('/admin', routesAdmin)
app.use('/log', routesData)


// ========= USER =========



app.listen(5344, async () => {
    console.log('Enroll Admin!')
    res = await registerDefaultAdmin()
    console.log(res)
})
