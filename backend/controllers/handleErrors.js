/*
References:
1. https://expressjs.com/en/guide/error-handling.html


*/

let infamous404 = (req, res, next) => {
   res.status(404)
   let err = new Error(`404 Not Found ${req.originalUrl}`)
   next(err)
}

let errorHandler = (err, req, res, next) => {
   console.log(err)
   let code = res.statusCode === 200 ? 500 : res.statusCode
   res.status(code).send('Unknown Error T.T')
}

module.exports = {infamous404, errorHandler}