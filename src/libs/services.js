const kafkaNode = require("kafka-node")
const moment = require("moment")
const config = require("../../config.json")

const getServiceList = ({db}) =>
{
    const {collectionName} = config.database

    return db.collection(collectionName).distinct("name")
        .then(docs =>
            Promise.all(
                docs.map(name =>
                    db.collection(collectionName)
                        .find({name})
                        .sort({timeStamp: -1})
                        .limit(1)
                        .toArray()
                )
            )
        )
        .then(services => services.map(serviceArray => {
                const [service] = serviceArray

                return {
                    name: service.name,
                    lastReported: service.timeStamp
                }
            })
        )
}

const listenToMessages = ({db}) =>
{
    const listenToServicePingMessages = onMessage =>
    {
        const MESSAGE_EVENT_TRIGGER = "message"
        const {Client, Consumer} = kafkaNode
        const {host, port, servicePing} = config.messageBus

        const zooKeeperURL = `${host}:${port}`

        const client = new Client(zooKeeperURL)
        const consumer = new Consumer(client, [servicePing])

        consumer.on(MESSAGE_EVENT_TRIGGER, onMessage)

        console.log("Listening to messages...")
    }

    const transformMessage = message =>
    {
        const value = JSON.parse(message.value)

        return Object.assign({}, value, {timeStamp: moment(value.timeStamp).toDate()})
    }

    const onServicePingMessage = message =>
    {
        const {collectionName} = config.database

        db.collection(collectionName).insertOne(transformMessage(message))
            .then(({result}) =>
            {
                console.log(result)
            })
    }

    listenToServicePingMessages(onServicePingMessage)
}

module.exports = {
    listenToMessages,
    getServiceList
}