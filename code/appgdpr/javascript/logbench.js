var axios = require("axios");

const buff = []
var result = 0
const number = 1

const sendRequest = async () => {
    try{
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
            data : data
          };
          console.log('here')
          axios(config)
          .then(function (res) {
            console.log('res: ', res.status)
            if (res.status === 200) {
                buff.push({
                    qid: res.data.qid,
                    startTime: new Date().valueOf() 
                })
            }
            console.log(buff)
          })
          .catch(function (error) {
            console.log(error);
          });
          
        
        
    } catch(err) {
        console.log(err)
    }
   
    
}

const doRequests = async (number) => {
    for (let i = 0; i < number; i++) {
        await sendRequest()
    }
}

const getLogs = async (number) => {
    let counter = 0
    console.log('ing etlogs')
    var s = setInterval(async () => {
        if (counter === number) {
            console.log('found!')
            console.log(result)
            clearInterval(s)
        }

        const res = await axios.get('http://localhost:5344/log/all/admin')
        if (res.status === 200) {
            const deleteBuff = []
            for (let i = 0; i < res.data.length; i++) {
                for (let j = 0; j < buff.length; j++) {
                    if (res.data[i].Key === buff[j].qid) {
                        const time = new Date().valueOf() - buff[j].startTime
                        result = result + time
                        deleteBuff.push(j)
                        counter = counter + 1
                    }
                }
                // delete after we cleared the buffer for an item
                for (let a = 0; a < deleteBuff.length; a++) {
                    buff.splice(deleteBuff[a], 1)
                }
            }
        }
    }, 
    100)
    console.log(result)
}

const main = async () => {
    doRequests(number)
    getLogs(number)


}

main()



  
 