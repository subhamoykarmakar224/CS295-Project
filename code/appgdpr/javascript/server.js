const express = require('express')
const app = express()
const routesAdmin = require('./routes/routesAdmin')
const { registerDefaultAdmin } = require('./utils/UtilsAdmin')


// ========= ADMIN =========
app.use('/admin', routesAdmin)


// ========= USER =========



app.listen(5344, async () => {
    console.log('Enroll Admin!')
    res = await registerDefaultAdmin()
    console.log(res)
})
