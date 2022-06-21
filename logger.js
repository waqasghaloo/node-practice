// Custom Middleware function

function log(req,res,next)
{
    console.log('Logging from Custom function')
    next()
}

module.exports = log