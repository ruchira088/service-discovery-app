const express = require("express")
const {getServiceList} = require("../libs/services")

const PATH = "/services"

const getServicesRouter = ({db}) => {
    const servicesRouter = express.Router()

    servicesRouter.get("/", (request, response) =>
    {
        getServiceList({db})
            .then(result => {
                   response.json(result)
            })
    })

    return servicesRouter
}

module.exports = {
    PATH,
    getServicesRouter
}