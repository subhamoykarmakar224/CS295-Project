var kafka = require('kafka-node')



const prod = async (client, id, prop, info) => {
    Producer = kafka.Producer
    producer = new Producer(client)
    qr = {
        id: id,
        prop: prop,
        info: info
    }
    payloads = [
        { topic: 'query', messages: JSON.stringify(qr) }
    ];
    // console.log(payloads)
    const producerPromise = new Promise((resolve, reject) => {
      producer.on('ready', () => {
        producer.send(payloads, (err, data) => {
            resolve(data);
        });
      });
      producer.on('error', (err) =>{ 
        console.log(err);
        reject(err);
      })
    })
    await producerPromise;
    const closePromise = new Promise((resolve, reject) => {
        producer.close(() => {
            resolve('done prod')
        })
    })
    await closePromise
   
  }

  module.exports = {
    prod
  }