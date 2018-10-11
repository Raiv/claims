const Claim = require('../models/claim')

module.exports = {
    addClaim: (req, res, next) => {
        let { id,date,text } = req.body
        new Claim(id,date,text).save((err, outClaim) => {
            if (err)
                res.send(err)
            else if (!outClaim)
                res.send(400)
            else {
                res.send(outClaim)
            }
            next()
        })
        
    },
    getAll: (req, res, next) => {
        Claim.findAll((err, claim)=> {
            if (err)
                res.send(err)
            else if (!claim)
                res.send(404)
            else
                res.send(claim)
            next()            
        })
    },
    /**
     * article_id
     */
    getClaim: (req, res, next) => {
        Claim.findById(req.params.id,(err, claim)=> {
            if (err)
                res.send(err)
            else if (!article)
                res.send(404)
            else
                res.send(claim)
            next()            
        })
    }
}