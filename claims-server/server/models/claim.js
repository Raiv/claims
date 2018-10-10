'use strict';

const fabricUser = require("../fabric/fabricuser").FabricUser;

class Claim {
    constructor(id,date,text) {
        this.id = id;
        this.text = text;
        this.date = date;
    }

    static findAll(){
        return fabricUser.query("queryAllClaims");
    }

    static findById(claimid){
        return fabricUser.query("queryClaim",claimid);
    }

    save(claimid,date,text){
        
        return FabricUser.invoke("createClaim",claimid,date,text);
    }
 
    display() {
        console.log(this.id +" "+ this.text+" "+this.date);
    }
 }


module.exports = Claim;