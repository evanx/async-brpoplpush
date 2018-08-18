const brpoplpush = (client, ...args) => new Promise(
    (resolve, reject) =>
        client.brpoplpush(...args, 
            (err, result) => err ? reject(err) : resolve(result)
        )
    )

const consumer = async ({ props, logger, client, service }) => {
    const requestId = await brpoplpush(client, 'hreq:q', 'hreq:p:q', props.popTimeoutSeconds)
    if (!requestId) {
        logger.warn('No service request')
    } else {
        logger.debug({ requestId })
        const [req] = await rtx(client, tx => {
            tx.hgetall(`hreq:${requestId}:h`)
        })
        logger.debug({ req })
        await service({ props, logger, client, req })
    }
}

module.exports = consumer