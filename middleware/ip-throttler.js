// @desc will be used to throttle the requests
const slowDown = require('express-slow-down');

const throttle = slowDown({
    windowMs: 15*60*1000, // 15 mins
    delayAfter: 50, // allow 50 requests per 15 mins, then...
    delayMs: () => 500
})

module.exports = throttle;