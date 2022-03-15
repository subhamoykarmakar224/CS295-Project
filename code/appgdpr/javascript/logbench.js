var axios = require("axios");

const buff = []
var result = 0
const number = 100

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
                // console.log(buff)
            })
            .catch(function (error) {
                console.log(error);
            });



    } catch (err) {
        console.log(err)
    }


}

const doRequests = async (number) => {
    for (let i = 0; i < number; i++) {
        console.log(i)
        await sendRequest()
    }
}

const getLogs = async (number) => {
    return new Promise(async (resolve) => {
        console.log('getlogs called')
        let counter = 0
        var s = setInterval(async () => {
            if (counter === number || buff.length === 0) {
                console.log('found!')
                console.log('result is: ', result)
                clearInterval(s)
                resolve(result)
            }

            const res = await axios.get('http://localhost:5344/log/all/admin')
            console.log('res got')
            console.log(buff.length)
            if (res.status === 200) {
                const deleteBuff = []
                for (let i = 0; i < res.data.length; i++) {
                    // console.log("res.data: ", res.data[i].Key)
                    for (let j = 0; j < buff.length; j++) {
                        // console.log("buffj: ", buff[j].qid)
                        if (res.data[i].Key === buff[j].qid) {
                            const time = new Date().valueOf() - buff[j].startTime
                            result = result + time
                            deleteBuff.push(j)
                            counter = counter + 1
                            console.log('found')
                        }
                    }
                    // delete after we cleared the buffer for an item
                    for (let a = 0; a < deleteBuff.length; a++) {
                        buff.splice(deleteBuff[a], 1)
                    }
                }
                if (counter === number || buff.length === 0) {
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
        doRequests(number)
        await getLogs(number).then(() => {
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




