/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

  // The Init method is called when the Smart Contract 'fabcar' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info('=========== Instantiated fabcar chaincode ===========');
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'fabcar'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async queryClaim(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting ClaimNumber ex: CLAIM1');
    }
    let claimNumber = args[0];

    let claimAsBytes = await stub.getState(claimNumber); //get the car from chaincode state
    if (!claimAsBytes || claimAsBytes.toString().length <= 0) {
      throw new Error(claimNumber + ' does not exist: ');
    }
    console.log(claimAsBytes.toString());
    return claimAsBytes;
  }

  static makeNoise() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let genLength =Math.random() * 50+5;
    for (let i = 0; i < genLength; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
   }

   
  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    const HOUR =1000*60*60;
    const DAY=HOUR*24;
    for (let i = 0; i < 10; i++) {
      let claim ={
        date: (Date.now()-DAY+HOUR*i),
        text: Chaincode.makeNoise(),
        docType: 'claim'
      }
      await stub.putState('CLAIM' + i, Buffer.from(JSON.stringify(claim)));
      console.info('Added <--> ', claim);
    }
    console.info('============= END : Initialize Ledger ===========');
  }

  async createClaim(stub, args) {
    console.info('============= START : Create Claim ===========');
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 5');
    }

    var claim = {
      docType: 'claim',
      date: args[1],
      text: args[2],
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(claim)));
    console.info('============= END : Create Car ===========');
  }

  async queryAllClaims(stub, args) {

    let query ={
      selector:{
        docType:"claim"
      }
    }
    let iterator = await stub.getQueryResult(JSON.stringify(query));

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        try {
          jsonRes = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
        jsonRes.claimNumber = res.value.key;
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

};

shim.start(new Chaincode());
