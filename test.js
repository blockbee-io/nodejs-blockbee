const BlockBee = require('./index')
const test = require('node:test')

const apiKey = '' // <- Insert your API Key here to run tests.

test('Test requesting service info', async (t) => {
    const info = await BlockBee.getInfo()
    if (info === null) throw new Error('fail')
})

test('Test requesting coin info', async (t) => {
    const info = await BlockBee.getInfo('btc')
    if (info === null) throw new Error('fail')
})

test('Test requesting supported cryptocurrencies', async (t) => {
    const supportedCoins = await BlockBee.getSupportedCoinsTest(apiKey)
    if (supportedCoins === null) throw new Error('fail')
})

test('Test generating address', async (t) => {
    const bb = new BlockBee('polygon_pol', null, 'https://webhook.site/19a994f1-54eb-47dc-8516-4107851f9a5s', {
        order_id: 1235,
    }, {
        convert: 1,
        multi_chain: 1,
    }, apiKey)

    const address = await bb.getAddress()
    if (address === null) throw new Error('fail')
})

test('Test getting logs', async (t) => {
    const bb = new BlockBee('polygon_pol', null, 'https://webhook.site/19a994f1-54eb-47dc-8516-4107851f9a5s', {
        order_id: 1235,
    }, {
        convert: 1,
        multi_chain: 1,
    }, apiKey)

    const logs = await bb.checkLogs()
    if (logs === null) throw new Error('fail')
})


test('Test getting QrCode', async (t) => {
    const bb = new BlockBee('polygon_pol', null, 'https://webhook.site/19a994f1-54eb-47dc-8516-4107851f9a5f', {}, {
        convert: 1,
        multi_chain: 1,
    }, apiKey)

    const qrCode = await bb.getQrcode(2, 300)
    if (qrCode === null) throw new Error('fail')
})

test('Test getting getEstimate', async (t) => {
    const estimate = await BlockBee.getEstimate('polygon_pol', apiKey,1, 'default')
    if (estimate === null) throw new Error('fail')
})

test('Test getting getConvert', async (t) => {
    const convert = await BlockBee.getConvert('polygon_pol', 300,'USD', apiKey)
    if (convert === null) throw new Error('fail')
})

test('Test creating Payout Request', async (t) => {
    const requests = {
        '0xA6B78B56ee062185E405a1DDDD18cE8fcBC4395d': 0.2,
        '0x18B211A1Ba5880C7d62C250B6441C2400d588589': 0.1
    }

    const payout = await BlockBee.createPayout('polygon_pol', requests, apiKey, false)
    if (payout === null) throw new Error('fail')
})

test('Test fetching Payout list', async (t) => {
    const payout = await BlockBee.listPayouts('bep20_usdt', 'all', 1, apiKey, true)
    if (payout === null) throw new Error('fail')
})

test('Get Payout Wallet / and balance', async (t) => {
    const wallet = await BlockBee.getPayoutWallet('polygon_pol', apiKey, true)
    if (wallet === null) throw new Error('fail')
})

test('Create Payout by IDs', async (t) => {
    const ids = [
        'b88972c9-058a-47a2-8e5e-8ee601cdb7d8'
    ]

    const payout = await BlockBee.createPayoutByIds(apiKey, ids)
    if (payout === null) throw new Error('fail')
})

test('Process Payout by ID', async (t) => {
    const payout = await BlockBee.processPayout(apiKey, '3da6bff6-f0f7-4f93-8512-b4611d80077e')
    if (payout === null) throw new Error('fail')
})

test('Check Payout status by ID', async (t) => {
    const status = await BlockBee.checkPayoutStatus(apiKey, '3da6bff6-f0f7-4f93-8512-b4611d80077e')
    if (status === null) throw new Error('fail')
})

test('Test generating a payment link', async (t) => {
    const paymentLink = await BlockBee.paymentRequest(
        'https://example.com',
        'https://example.com',
        10,
        apiKey,
        {
            order_id: 12345
        }
    )
    if (paymentLink === null) throw new Error('fail')
})

test('Test fetching payment logs', async (t) => {
    const token = 'OcRrZGsKQFGsoi0asqZkr97WbitMxFMb'
    const paymentLogs = await BlockBee.paymentLogs(token, apiKey)
    if (paymentLogs === null) throw new Error('fail')
})

test('Test generating a deposit link', async (t) => {
    const depositLink = await BlockBee.depositRequest(
        'https://arianoangelo.com/',
        apiKey,
        {
            deposit_id: 100,
        }
    )
    if (depositLink === null) throw new Error('fail')
})

test('Test fetching deposit logs', async (t) => {
    const token = 'jv12du8IWqS96WVDjZK2J285WOBOBycc'
    const depositLogs = await BlockBee.depositLogs(token, apiKey)
    if (depositLogs === null) throw new Error('fail')
})
