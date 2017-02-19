
const callback = (resolve, reject) => (error, result) => {
    if(error != null) {
        reject(error)
    } else {
        resolve(result)
    }
}

const delay = (promiseGeneratorFunction, delay) => new Promise((resolve, reject) => {
    setTimeout(() => {
        promiseGeneratorFunction().then(resolve).catch(reject)
    }, delay)
})

module.exports = {
    callback,
    delay
}