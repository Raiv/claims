const claimController = require('../controllers/claim.ctrl')
const multipart = require('connect-multiparty')
const multipartWare = multipart()

module.exports = (router) => {
    /**
     * get all claims
     */
    router
        .route('/claims')
        .get(claimController.getAll)
    /**
     * add claim
     */
    router
        .route('/claim')
        .post(multipartWare, claimController.addClaim)
 
    /**
     * get a claim to view
     */
    router
        .route('/claim/:id')
        .get(claimController.getClaim)
}
