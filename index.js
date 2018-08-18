const brpoplpush = (client, ...args) => new Promise(
    (resolve, reject) =>
        client.brpoplpush(...args, 
            (err, result) => err ? reject(err) : resolve(result)
        )
    )

module.exports = brpoplpush
