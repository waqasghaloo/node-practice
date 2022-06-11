//Importing core module of http which will be used for creating a server
const http = require('http')

//Creating a server, on which route handler has been created/API but this approach
//is not recommended as moultiple condition are required to create APIs here
const server = http.createServer((req,res)=>
{
    if (req.url === '/')
    {
        res.write('Hello World')
    }
})

//Server must listen on some port and is listening on 3000
server.listen(3000)