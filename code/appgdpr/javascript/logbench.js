var axios = require("axios");

const buff = []
var result = 0
const numberofentries = 100
let counter = 0
const sendRequest = async () => {
    try {
        console.log('send request called')
        var data = JSON.stringify({
            "id": "6",
            "prop": "purpose",
            "info": "79",
            "query": "mget_obj"
        });
        var config = {
            method: 'post',
            url: 'http://localhost:5344/sieve/mget_obj',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        await axios(config)
            .then(function (res) {
                console.log('res: ', res.status)
                if (res.status === 200) {
                    console.log(res.data.qid)
                    buff.push({
                        qid: res.data.qid,
                        startTime: new Date().valueOf()
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });



    } catch (err) {
        console.log(err)
    }


}

const doRequests = async (numberofentries) => {
    for (let i = 0; i < numberofentries; i++) {
        console.log(i)
        await sendRequest()
    }
}

const getLogs = async (numberofentries) => {
    return new Promise(async (resolve) => {
        console.log('getlogs called')
        var s = setInterval(async () => {
            if (counter === numberofentries) {
                console.log('found!')
                console.log('result is: ', result)
                clearInterval(s)
                resolve(result)
            }

            const res = await axios.get('http://localhost:5344/log/all/admin')
            console.log('res got')
            console.log(buff.length)
            console.log('counter, number: ', counter, numberofentries)
            if (res.status === 200) {
                
                for (let i = 0; i < res.data.length; i++) {
                    const deleteBuff = []
                    // console.log('i: ', i)
                    // console.log("res.data: ", res.data[i].Key)
                    for (let j = 0; j < buff.length; j++) {
                        // console.log("buffj: ", buff[j].qid)
                        if (res.data[i].Key === buff[j].qid) {
                            console.log("God make this code work please")
                            const time = new Date().valueOf() - buff[j].startTime
                            result = result + time
                            deleteBuff.push(j)
                            console.log('len: ', deleteBuff.length)
                            counter++
                            console.log('found')
                        }
                    }
                    // delete after we cleared the buffer for an item
                    for (let a = 0; a < deleteBuff.length; a++) {
                        console.log('deletebuff')
                        console.log('d.len', deleteBuff.length)
                        buff.splice(deleteBuff[a], 1)
                    }
                }
                if (counter === numberofentries) {
                    console.log('found!')
                    console.log('result is: ', result)
                    clearInterval(s)
                    resolve(result)
                }
            }
        },
            1000)
    })


}

const runBench = async () => {
    return new Promise(async (resolve) => {
        doRequests(numberofentries)
        await getLogs(numberofentries).then(() => {
            console.log('flyin or actually paused? who knows PauseChamp')
            resolve('done')
        })
        
    })

}

const main = async () => {
    const startTime = new Date().valueOf()
    const bench = runBench()
    await bench
    console.log('took this time to run : ', new Date().valueOf() - startTime)
}

main()




