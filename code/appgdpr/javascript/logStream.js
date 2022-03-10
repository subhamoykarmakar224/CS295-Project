const kafka = require('kafka-node')
Consumer = kafka.Consumer
const {
    addSieveLogs
} = require('./utils/UtilsData')
const {storeLogs} = require('./db')

function freeze(time) {
    const stop = new Date().getTime() + time;
    while(new Date().getTime() < stop);       
}
const consom = async (client) => {
    var counter = 0
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    consumer = new Consumer(
        client,
        [
            { topic: 'logResults', partition: 0 }
        ],
        {
            autoCommit: false,
        }
    );
    console.log('listening to logResults')
    consumer.on('message', async function (message) {
        const logM = JSON.parse(message.value);
        console.log(logM)
        counter = counter + 1
        // console.log("freeze 3s");
        // freeze(3000);
        // console.log("done");
        await storeLogs(logM.querier, logM.log)
        // console.log('out of await')
        // if(result.success) {
        //     console.log('yay')
        //     console.log(counter)
        // } else {
        //     console.log('nay')
        // }
    });
    // const sol = {}
    // consumerPromise.then((data) => {
    //     sol.data = data.md
    //     sol.msg = data.message
    // })
    // const consoomClose = new Promise((resolve, reject) => {
    //     consumer.close(true, () => resolve("done okchamp"))

    // })
    // await consoomClose
    // consoomClose.then((str) => console.log(str))
    // return sol
}
client = new kafka.KafkaClient()
consom(client)