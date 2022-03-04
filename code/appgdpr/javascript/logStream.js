const kafka = require('kafka-node')
Consumer = kafka.Consumer
const {
    addSieveLogs
} = require('./utils/UtilsData')

const consom = async (client) => {
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
        const result = await addSieveLogs("admin", logM.querier, logM.log)
        if(result.success) {
            console.log('yay')
        } else {
            console.log('nay')
        }
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