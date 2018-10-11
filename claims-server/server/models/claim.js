'use strict';

const fabricUser = require("../fabric/fabricuser");

class Claim {
    constructor(claimNumber,date,text) {
        this.claimNumber = claimNumber;
        this.text = text;
        this.date = date;
    }

    static findAll(cb){
        let claim= fabricUser.query(cb,"queryAllClaims");

    }

    static findById(cb,claimid){
        return fabricUser.query(cb,"queryClaim",claimid);
    }

    save(cb){
        
        return fabricUser.invoke(cb,"createClaim",this.claimNumber,this.date,this.text);
    }
 
    display() {
        console.log(this.claimNumber +" "+ this.text+" "+this.date);
    }
 }


module.exports = Claim;