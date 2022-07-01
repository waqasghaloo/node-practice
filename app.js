// Creating GET api using express JS

// Node basic GET API
// Step#1: Importing Express JS framework module

const express = require('express')
// By convention object of expressjs should be initialized with Var name 'app', by this action we are creating a server object of express
const app = express()

const config = require('config')
//This is middleware function used to get body as JSON which we would be using in reading body in POST request
app.use(express.json())

//importing a module placed on root folder of project and this returns a function
const logger = require('./logger')

//Importing Joi package for validation which has been installed with NPM
const Joi = require('joi')

//Importing third party middleware morgan - for http logging and helmet
const morgan = require('morgan')
const helmet = require('helmet')

//using third party middleware functions

app.use(function(req,res,next)
{
    console.log('Logging from middleware')
    next()
}
)

app.use(logger) //using custom middleware function



// Step#2 
//API is structured as (route, routehandler)
//Routehandler is a function which takes two parameters ; 1. req: this param consists data came in request, 2. res. this param consists
// data being sent back in response
app.get('/',(req,res)=>
{
    res.send('Hello from first get API')
}
)


// // Step#2 : Parameterized GET api
app.get('/:id',(req,res)=>
{
    res.status(200).send('Hello from first get API'+req.params.id)

}
)


// // Step#2 : Parameterized GET api
// app.get('/:id',(req,res)=>
// {
//     res.status(200).send('Hello from first get API'+req.params.id)

// }
// )

// var ages = [{id:1, name: 'Waqas'},
// {id:2, name: 'Wajahat'}
// ]

// // Step#2 : Parameterized GET api
// app.get('/:id',(req,res)=>
// {
//     var age=ages.find(c=> c.id ===parseInt( req.params.id))

//     if (!age)
//     {
//         res.status(200).send(age+'   '+req.params.id)
//     }
// }
// )

// // Step#2 : Parameterized GET api
// app.get('/:id',(req,res)=>
// {
//     var age=ages.find(c=> c.id ===parseInt( req.params.id))

//     res.status(200).send(age+'   '+req.params.id)

// }
// )

const courses = [{id:1, name: "Maths"}]

// Step# 2: POST API
// app.post('/course',(req,res)=>
// {
//     const course = {
//         id: courses.length +1,
//         name: req.body.name
//     }

//     courses.push(course)

//     res.send(course)

// }
// )


// Step# 2: POST API with custom validation
// app.post('/course',(req,res)=>
// {
//     if (!req.body.name || req.body.name.length < 3)
//     {
//         res.status(404).send('Error in course name')
//     }
//     const course = {
//         id: courses.length +1,
//         name: req.body.name
//     }

//     courses.push(course)

//     res.send(course)

// }
// )


// Step# 2 POST Api request with JOI validation
// JOI is package for validating request
//  1. Define Schema
//  2. Validate req.body using schema

app.post('/course',(req,res)=>
{
    const schema = Joi.object({
        name: Joi.string().required().min(3)
    })

    const result = schema.validate(req.params.name)

    if (result.error)
    {
        res.send(result.error)
    }
    const course = {id : courses.length + 1,
    name: req.params.name
    }

    courses.push(course)
    res.send(result.error)

}
)

// app.get('/',(req,res)=>
// {
//     res.send(200)
// }
// )


// Step# 2: Creating PUT API and this is update request
// Content to be changed will come in request body
// Which record to update will come up in URL to identify


app.put('/api/course/:id',(req,res)=>
{
    //Step# 1 Find course in datasource which needs to be changed, here we have created a list of dictionary

    let course = courses.find(c => c.id === parseInt(req.params.id))
    console.log(course)
    if (!course)
    {
        res.status(404).send('Course not found')
    }

    // Step# 2 Validate if course exists or not

    const schema = Joi.object({
        name: Joi.string().required().min(3)
    })

    const {error} = schema.validate(req.body)

    if (error)
    {
        res.status(400).send(error+'Course name is not valid')
    }

    course.name = req.body.name
    console.log(course.name)
    console.log(courses)
    res.status(200).send(course)

}
)


// Step #2: Deleting a record from dataset using DELETE requests


app.delete('/api/courses/:id',(req,res)=>
{
    const course = courses.find(c=> c.id === parseInt(req.params.id))
    console.log(course)
    console.log(courses)
    if (!course)
    {
        res.status(404).send('Course not found to be deleted')
    }

    const index = courses.indexOf(course)
    courses.splice(index,1)

    res.status(200).send(course + 'Deleted')

}
)

// Enviroment: As organization run code in different enviroment so to get in which enviroment code is running, there are two ways
// 1. Using 'process' global object of node - process.env.NODE_ENV, this will return undefined if not set
// 2. Using app.get - app.get('env') - this will return development if not set

console.log(`Node Env process: ${process.env.NODE_ENV}`)
console.log(`Node Env app    : ${app.get('env')}`)


// When we want to run some code snippet in Development enviroment only, we can just put code in below like condition.
// Standard enviroments: development, testing, staging or production 
// To change enviroment, we can do it from Shell script - using command in linux (export NODE_ENV = production)
if (app.get('env')=== 'development')
{
    app.use(morgan('tiny'))
    console.log('Running in Development Env')

}

// Every enviroment requires different settings/configurations and need to override in each enviroment depending on enviroment
// rc, config packages of node are good for managing configurations/settings for every enviroment
// install config package using - npm i -g config
// configuration for development, production and rest of standard enviroment could be saved using this approach and this is good approach
// Step# 1: Create folder in project named as 'config'
// Step# 2: Create default.json file in config 
// Step# 3: Create configuration file for each enviroment seperatly, such as, development.json (this file will consist of json object)
// Steo# 4: Accessing property of configuration using below way

console.log("Application Name: "+config.get('name'))

// Accessing nested property from configuration using dot notation

console.log(`Application Name ${config.get('mail server.server')}`)

// {"Name": "My app express - production",
// "mail server":{ "server": "linux"}}



// Best Practice: Never trust what comes in body of request, always validate
// Validation package: JOI, AJV or with custom written logic

// setting port from ENV variables

// const port =process.env.PORT || 3001

//Step# 3: Server must listen on some port
app.listen(3000)


