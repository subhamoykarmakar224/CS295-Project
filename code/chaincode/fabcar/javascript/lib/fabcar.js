// https://hyperledger.github.io/fabric-chaincode-node/release-2.1/api/fabric-shim.ChaincodeStub.html

const { Contract } = require('fabric-contract-api');
const shim = require('fabric-shim')

class FabCar extends Contract {

    async initLedger(ctx) {
        // let ret = ctx.stub.getFunctionAndParameters();
        // console.log(ret)
        // console.log('CHAINCODE INITIALIZED...')
        // return shim.success();
        const logs = [
            {
                id:"",
                owner: "subhamoy",
                docType: 'sieve_log',
                data: "test-1"
            },
            {
                id:"",
                owner: "subhamoy",
                docType: 'sieve_log',
                data: "test-2"
            },
            {
                id:"",
                owner: "subhamoy",
                docType: 'sieve_log',
                data: "test-3"
            },
            {
                id:"",
                owner: "subhamoy",
                docType: 'sieve_log',
                data: "test-4"
            },
            {
                id:"",
                owner: "subhamoy",
                docType: 'sieve_log',
                data: "test-5"
            }
        ]
        for (let i = 0; i < logs.length; i++) {
            var id = 'log-' + i.toString();
            logs[i].id = id
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(logs[i])));
            console.info('Added <--> ', logs[i]);
        }
        return shim.success(Buffer.from('Initialized Successful.'));
    }

    // ============== SIEVE LOGS ==============
    async createSieveLogs(ctx, user, r_id, log_data) {
        const log = {
            id: r_id, 
            owner: user.toLowerCase(),
            docType: 'sieve_log',
            data: log_data
        }
        const parsed = JSON.parse(log_data)
        const key = parsed.qid
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(log)));
    }

    // async querySieveLogsByUser(ctx, user, pageSize, bookmark) {
    async querySieveLogsByUser(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);

        // const queryString = "{\"selector\":{\"docType\":\"sieve_log\",\"owner\":\"" + user + "\"}}";
        // const allResults = [];
        // // for await (const {key, value} of ctx.stub.getQueryResultWithPagination(queryString, pageSize, bookmark)) {
        //     for await (const {key, value} of ctx.stub.getStateByRange('', '')) {
        //     if(value.type == 'sieve_log') {
        //         const strValue = Buffer.from(value);
        //         let record;
        //         try {
        //             record = JSON.parse(strValue);
        //         } catch (err) {
        //             console.log(err);
        //             record = strValue;
        //         }
        //         allResults.push({ Key: key, Record: record });
        //     }
        // }
        // return JSON.stringify(allResults);
    }

    // ============== DB LOGS ==============



    // ============== USER QUERY LOGS ==============


}

module.exports = FabCar;
