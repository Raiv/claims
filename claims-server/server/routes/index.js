const claims = require('./claim.route')

module.exports = (router) => {
    claims(router)
}