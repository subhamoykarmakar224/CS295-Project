var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./dblogs/dblogs.db');
const {
    addSieveLogs
} = require('./utils/UtilsData')
function storeLogs(id, log) {
    db.serialize(function () {
        // db.run("CREATE TABLE lorem (info TEXT)");
        db.run("CREATE TABLE if not exists logs (sqn INTEGER PRIMARY KEY autoincrement, id TEXT, log TEXT, time TIMESTAMP default current_timestamp)")

        // var stmt = db.prepare("INSERT INTO logs (?, ?)");
        // stmt.run(id, log);
        console.log(id, log)
        console.log('inside storelogs')
        db.run(`INSERT INTO logs(id, log) VALUES(?, ?)`, [id, log])
    })
}

const countLogs = async (resolve, reject) => {
    // console.log('countlogs called')
    db.serialize(async function () {
        db.run("CREATE TABLE if not exists logs (sqn INTEGER PRIMARY KEY autoincrement, id TEXT, log TEXT, time TIMESTAMP default current_timestamp)")
        const res = new Promise(async (resolve, reject) => {
            db.get("SELECT COUNT(*) as count FROM logs", [], (err, row) => {
                // console.log(row.count)
                // console.log(row)
                if (typeof row === 'undefined' || row === null) {
                    // console.log('resolving here')
                    resolve(0)
                }
                // console.log('false')
                // console.log('resloving theerrere')
                resolve(row.count)
            })
        })
        await res
        res.then((count) => {
            // console.log('count in res.then: ', count)
            resolve(count)
        })

    })
}

function freeze(time) {
    const stop = new Date().getTime() + time;
    while (new Date().getTime() < stop);
}

const performInsert = async (resolve, reject, row) => {
    addSieveLogs("admin", row.id, row.log).then((body) => {
        console.log("YEYEYEYEEYE")
        resolve(body)
    }).catch((body) => reject(body))
}

const insertLog = async () => {

    // const res = new Promise(async (resolve, reject) => {
    const resList = []
    db.each("SELECT * FROM logs order by time limit 100", async (err, row) => {
        // console.log(row.id, row.log)
        const sol = new Promise(async (resolve, reject) => {
            // console.log(row)
            // console.log("freeze 3s");
            // freeze(3000);
            // console.log("done");
            const prom = new Promise(async (resolve, reject) => {
                performInsert(resolve, reject, row)
            })
            
            await prom
            console.log('if yeeyeyeye prints after then this doesnt work')
            console.log(row.sqn)
            prom.then((body) => {
                resList.push(row.sqn)
                resolve(body)
            }).catch((body) => {
                console.log('WHY WHY WHY WHY WHY')
                console.log(body)
                reject(body)
            })

        })
        await sol
    }, () => { db.run("DELETE from logs where sqn in (" + resList.join(", ") + ")") })
    // console.log(resList)
    // resolve(resList)
    // })
    // await res
    // res.then(list => console.log("DELETE from logs where sqn in (" + list.join(", ") + ")"))

    // db.run("DELETE from logs where sqn in (" + list.join(", ") + ")")
}
module.exports = {
    storeLogs,
    countLogs,
    insertLog
}