var kafka = require('kafka-node')
Consumer = kafka.Consumer
// client = new kafka.KafkaClient()

const consom = async () => {
    client = new kafka.KafkaClient()
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    consumer = new Consumer(
        client,
        [
            { topic: 'results', partition: 0 }
        ],
        {
            autoCommit: false
        }
    );
    console.log('consoom')
    const consumerPromise = new Promise((resolve, reject) => {
        consumer.on('message', async function (message) {
            resolve(JSON.parse(message.value));
        });
    })
    await consumerPromise;
    console.log('heehee1')
    consumerPromise.then((data) => console.log(data))
    const consoomClose = new Promise((resolve, reject) => {
        consumer.close(true, () => resolve("done okchamp"))

    })
    await consoomClose
    consoomClose.then((str) => console.log(str))
    console.log('heehee3')

}

module.exports = {
    consom
}