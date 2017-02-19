const mongoDB = require("mongodb")
const {callback, delay} = require("./general")
const config = require("../../config.json")

const connectToMongoDB = (url, remainingAttempts = 2) => (new Promise((resolve, reject) => {
    console.log(`Connecting to MongoDB on: ${url}`)

    mongoDB.MongoClient.connect(url, callback(resolve, reject))
}))
    .then(db => {
        console.log("Successfully connected to MongoDB")
        return db
    })
    .catch(error => {
        console.warn("Unable to connect to MongoDB")

        if(remainingAttempts > 0) {
            console.warn(
                `Reattempting to connect to MongoDB in ${config.reconnectionAttemptDelay}ms`
            )

            return delay(
                () => connectToMongoDB(url, remainingAttempts-1),
                config.reconnectionAttemptDelay
            )
        } else {
            console.error("Failed to connect to MongoDB")
            return Promise.reject(error)
        }
    })

const connectToDB = () => {
    const {protocol, host, port, dbName} = config.database
    const dbUrl = `${protocol}://${host}:${port}/${dbName}`

    return connectToMongoDB(dbUrl)
}

module.exports = {
    connectToDB
}