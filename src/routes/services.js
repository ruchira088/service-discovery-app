const express = require("express")

const PATH = "/services"

const getServicesRouter = ({db}) => {
    const servicesRouter = express.Router()

    servicesRouter.get("/", (request, response) => {
        response.json({result: "Services Router"})
    })

    return servicesRouter
}

module.exports = {
    PATH,
    getServicesRouter
}