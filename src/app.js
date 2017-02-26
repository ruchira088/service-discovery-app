const express = require("express")
const bodyParser = require("body-parser")
const http = require("http")
const {connectToDB} = require("./libs/database")
const {listenToMessages} = require("./libs/services")
const {PATH, getServicesRouter} = require("./routes/services")
const config = require("../config.json")
const packageDetails = require("../package.json")

const PORT = process.env.HTTP_PORT || config.httpPort
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/details", (request, response) => {
    const {name, version, description, author, license} = packageDetails

    response.json({name, version, description, author, license})
})

connectToDB()
    .then(db =>
    {
        listenToMessages({db})

        app.use(PATH, getServicesRouter({db}))

        http.createServer(app).listen(PORT, () => {
            console.log(`Server is listening on port: ${PORT}`)
        })
    })
    .catch(error => {
        console.error(`Unable to start server: ${error.message}`)
        process.exit(1)
    })
