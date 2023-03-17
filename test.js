const BlockBee = require('./index')
const test = require('node:test')

const apiKey = '' // <- Insert your API Key here to run tests.

test('Test requesting supported cryptocurrencies', async (t) => {
    const _r = await BlockBee.getSupportedCoins(apiKey)

    if (_r === null) throw new Error('fail')
})

test('Test generating address', async (t) => {
    const bb = new BlockBee('polygon_matic', '', 'https://webhook.site/19a994f1-54eb-47dc-8516-4107851f9a5s', {
        order_id: 1235,
    }, {
        convert: 1,
        multi_chain: 1,
    }, apiKey)

    const address = await bb.getAddress()

    if (address === null) throw new Error('fail')
})

test('Test getting logs', async (t) => {
    const bb = new BlockBee('polygon_matic', '', 'https://webhook.site/19a994f1-54eb-47dc-8516-4107851f9a5s', {
        order_id: 1235,
    }, {
        convert: 1,
        multi_chain: 1,
    }, apiKey)

    const logs = await bb.checkLogs()

    if (logs === null) throw new Error('fail')
})


test('Test getting QrCode', async (t) => {
    const bb = new BlockBee('polygon_matic', '', 'https://webhook.site/19a994f1-54eb-47dc-8516-4107851f9a5f', {}, {
        convert: 1,
        multi_chain: 1,
    }, apiKey)

    /**
     * First is important to run getAddress otherwise the remaining requests won't function
     */
    await bb.getAddress()

    const qrCode = await bb.getQrcode(1, 300)

    if (qrCode === null) throw new Error('fail')
})

test('Test getting getEstimate', async (t) => {
    const estimate = await BlockBee.getEstimate('polygon_matic', apiKey,1, 'default')

    if (estimate === null) throw new Error('fail')
})

test('Test getting getConvert', async (t) => {
    const convert = await BlockBee.getConvert('polygon_matic', 300,'USD', apiKey)

    if (convert === null) throw new Error('fail')
})
