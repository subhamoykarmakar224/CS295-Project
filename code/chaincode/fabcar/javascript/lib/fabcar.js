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
                owner: "subhamoy",
                docType: 'sieve_log',
                id: "1",
                log: "test-1"
            },
            {
                owner: "subhamoy",
                docType: 'sieve_log',
                id: "2",
                log: "test-2"
            },
            {
                owner: "subhamoy",
                docType: 'sieve_log',
                id: "3",
                log: "test-3"
            },
            {
                owner: "subhamoy",
                docType: 'sieve_log',
                id: "4",
                log: "test-4"
            },
            {
                owner: "subhamoy",
                docType: 'sieve_log',
                id: "5",
                log: "test-5"
            }
        ]
        for (let i = 0; i < logs.length; i++) {
            await ctx.stub.putState('LOG' + i, Buffer.from(JSON.stringify(logs[i])));
            console.info('Added <--> ', logs[i]);
        }
    }

    // ============== SIEVE LOGS ==============
    async createSieveLogs(ctx, user, id, data) {
        var k = String(Date.now())
        console.log('Curr KEY: ' + k)
        const log = {
            owner: user.toLowerCase(),
            docType: 'sieve_log',
            id: id, 
            log: data
        }
        await ctx.stub.putState(k, Buffer.from(log));
    }

    async querySieveLogsByUser(ctx, user, pageSize, bookmark) {
        const queryString = "{\"selector\":{\"docType\":\"sieve_log\",\"owner\":\"" + user + "\"}}";
        const allResults = [];
        // for await (const {key, value} of ctx.stub.getQueryResultWithPagination(queryString, pageSize, bookmark)) {
            for await (const {key, value} of ctx.stub.getStateByRange('', '')) {
            if(value.type == 'sieve_log') {
                const strValue = Buffer.from(value);
                let record;
                try {
                    record = JSON.parse(strValue);
                } catch (err) {
                    console.log(err);
                    record = strValue;
                }
                allResults.push({ Key: key, Record: record });
            }
        }
        return JSON.stringify(allResults);
    }

    // ============== DB LOGS ==============



    // ============== USER QUERY LOGS ==============


}

module.exports = FabCar;
