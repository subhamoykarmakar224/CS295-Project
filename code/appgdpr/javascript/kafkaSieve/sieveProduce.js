var kafka = require('kafka-node')
Producer = kafka.Producer


const prod = async (id, prop, info) => {
    client = new kafka.KafkaClient()
    producer = new Producer(client)
    qr = {
        id: id,
        prop: prop,
        info: info
    }
    console.log('in prod')
    payloads = [
        { topic: 'query', messages: JSON.stringify(qr) }
    ];
    // console.log(payloads)
    const producerPromise = new Promise((resolve, reject) => {
      producer.on('ready', () => {
        producer.send(payloads, (err, data) => {
            console.log(data);
            resolve(data);
        });
      });
      producer.on('error', (err) =>{ 
        console.log(err);
        reject(err);
      })
    })
    console.log('heehee')
    await producerPromise;
    const closePromise = new Promise((resolve, reject) => {
        producer.close(() => {
            console.log('done prod')
            resolve('done prod')
        })
    })
    await closePromise
    console.log('heehee2')
   
  }

  module.exports = {
    prod
  }