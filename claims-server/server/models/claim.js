'use strict';

const fabricUser = require("../fabric/fabricuser");

class Claim {
    constructor(id,date,text) {
        this.id = id;
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
        
        return FabricUser.invoke(cb,"createClaim",this.id,this.date,this.text);
    }
 
    display() {
        console.log(this.id +" "+ this.text+" "+this.date);
    }
 }


module.exports = Claim;