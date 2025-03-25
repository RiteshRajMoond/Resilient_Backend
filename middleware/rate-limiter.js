const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    limit: 100, 
    message: "Too many requests"
})

module.exports = limiter;