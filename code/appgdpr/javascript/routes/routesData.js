const express = require('express')
const router = express.Router()


// 
router.get('/logs', async (req, res, next) => {
    if(is_valid_admin) {
        res.send('TODO: SHOW LOGS')
    } else {
        res.send('ERROR: NOT A VALID USER')
    }
})

module.exports = router
