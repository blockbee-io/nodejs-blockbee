/**
 * BlockBee's Node.js Library
 * @author BlockBee <info@blockbee.io>
 */
class BlockBee {
    static #baseURL = 'https://api.blockbee.io'

    constructor( coin, ownAddress, callbackUrl, parameters = {}, bbParams = {}, apiKey ) {
        if ( !apiKey ) {
            throw new Error('Missing API Key')
        }

        BlockBee.getSupportedCoins(apiKey).then(validCoins => {
            if ( !validCoins.hasOwnProperty(coin) ) {
                throw new Error('The cryptocurrency/token requested is not supported.')
            }
        })

        this.coin = coin
        this.ownAddress = ownAddress
        this.callbackUrl = callbackUrl
        this.parameters = parameters
        this.bbParams = bbParams
        this.apiKey = apiKey
        this.paymentAddress = ''
    }

    /**
     * Gets all the supported cryptocurrencies and tokens from the API
     * @param apiKey
     * @returns {Promise<{}|null>}
     */
    static async getSupportedCoins( apiKey ) {
        const info = await this.getInfo(null, true, apiKey)

        if ( !info ) {
            return null
        }

        delete info['fee_tiers']

        const coins = {}

        for ( const chain of Object.keys(info) ) {
            const data = info[chain]
            const isBaseCoin = data.hasOwnProperty('ticker')

            if ( isBaseCoin ) {
                coins[chain] = data
            } else {
                const baseTicker = `${chain}_`
                Object.entries(data).forEach(( [token, subData] ) => {
                    coins[baseTicker + token] = subData
                })
            }
        }

        return coins
    }

    /**
     * Actually makes the request to the API returning the address.
     * It's necessary to run this before running the other non-static functions
     * @returns {Promise<*|null>}
     */
    async getAddress() {
        if ( !this.coin || !this.callbackUrl || !this.apiKey ) {
            return null
        }

        let callbackUrl = new URL(this.callbackUrl)
        const parameters = this.parameters

        if ( Object.entries(parameters).length > 0 ) {
            Object.entries(parameters).forEach(( [k, v] ) => callbackUrl.searchParams.append(k, v))
        }

        const params = this.ownAddress
            ? {
                ...this.bbParams, ...{
                    callback: encodeURI(callbackUrl.toString()),
                    address: this.ownAddress,
                    apikey: this.apiKey
                }
            } : {
                ...this.bbParams, ...{
                    callback: encodeURI(callbackUrl.toString()),
                    apikey: this.apiKey
                }
            }

        const response = await BlockBee.#_request_get(this.coin, 'create', params)

        if ( response.status === 'success' ) {
            const addressIn = response.address_in

            this.paymentAddress = addressIn
            return addressIn
        }

        return null
    }

    /**
     * Checks the logs related to a request.
     * (Can be used to check for callbacks)
     * @returns {Promise<any|null>}
     */
    async checkLogs() {
        if ( !this.coin || !this.callbackUrl ) {
            return null
        }

        let callbackUrl = new URL(this.callbackUrl)
        const parameters = this.parameters

        if ( Object.entries(parameters).length > 0 ) {
            Object.entries(parameters).forEach(( [k, v] ) => callbackUrl.searchParams.append(k, v))
        }

        callbackUrl = encodeURI(callbackUrl.toString())

        const params = {
            callback: callbackUrl,
            apikey: this.apiKey
        }

        const response = await BlockBee.#_request_get(this.coin, 'logs', params)

        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    /**
     * Gets the QRCode for a payment.
     * @param value
     * @param size
     * @returns {Promise<any|null>}
     */
    async getQrcode( value = null, size = 512 ) {
        let address = this.paymentAddress

        if ( !address ) {
            address = await this.getAddress()
        }

        const params = {
            address: address,
            apikey: this.apiKey
        }

        if ( value ) {
            params['value'] = value
        }

        params['size'] = size

        const response = await BlockBee.#_request_get(this.coin, 'qrcode', params)

        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    /**
     * Get information related to a cryptocurrency/token.
     * If coin=null it calls the /info/ endpoint returning general information
     * @param coin
     * @param assoc
     * @param apiKey
     * @returns {Promise<any|null>}
     */
    static async getInfo( coin = null, assoc = false, apiKey ) {
        const params = {}

        if ( !apiKey ) {
            throw new Error('API Key is Empty')
        }

        params['apikey'] = apiKey

        if ( !coin ) {
            params['prices'] = 0
        }

        const response = await this.#_request_get(coin, 'info', params)

        if ( !coin || response.status === 'success' ) {
            return response
        }

        return null
    }

    /**
     * Gets an estimate of the blockchain fees for the coin provided.
     * @param coin
     * @param apiKey
     * @param addresses
     * @param priority
     * @returns {Promise<any|null>}
     */
    static async getEstimate( coin, apiKey, addresses = 1, priority = 'default' ) {
        if ( !apiKey ) {
            throw new Error('API Key is Empty')
        }

        const response = await BlockBee.#_request_get(coin, 'estimate', {
            addresses,
            priority,
            apikey: apiKey
        })

        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    /**
     * This method allows you to easily convert prices from FIAT to Crypto or even between cryptocurrencies
     * @param coin
     * @param value
     * @param from
     * @param apiKey
     * @returns {Promise<any|null>}
     */
    static async getConvert( coin, value, from, apiKey ) {
        if ( !apiKey ) {
            throw new Error('API Key is Empty')
        }

        const response = await BlockBee.#_request_get(coin, 'convert', {
            value,
            from,
            apikey: apiKey
        })

        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    static async createPayout( coin, requests, apiKey, process = false ) {
        if ( !requests ) {
            throw new Error('No requests provided')
        }

        const body = {
            'outputs': requests
        }

        let endpoint = 'payout/request/bulk'

        if ( process ) {
            endpoint = endpoint + '/process'
        }

        const response = await BlockBee.#_request_post(coin, endpoint, apiKey, body, true)
        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    static async listPayouts( coin, status, page, apiKey, requests = false ) {
        const params = {}

        if ( status ) {
            params.status = status
        }

        if ( page ) {
            params.p = page
        }

        let endpoint = 'payout/list'

        if ( requests ) {
            endpoint = 'payout/request/list'
        }

        const response = await this.#_request_get(coin, endpoint, {...params, apikey: apiKey})

        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    static async getPayoutWallet( coin, apiKey, balance = false ) {
        let wallet = await this.#_request_get(coin, 'payout/address', {apikey: apiKey})

        if ( wallet.status !== 'success' ) {
            return null
        }

        const output = {address: wallet.address}

        if ( balance ) {
            wallet = await this.#_request_get(coin, 'payout/balance', {apikey: apiKey})
            if ( wallet.status === 'success' ) {
                output.balance = wallet.balance
            }
        }

        return output
    }

    static async createPayoutByIds( apiKey, ids = [] ) {
        if ( ids.length === 0 ) {
            throw new Error('Please provide the Payout Request(s) ID(s)')
        }

        const response = await this.#_request_post('', 'payout/create', apiKey, {request_ids: ids.join(',')})

        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    static async processPayout( apiKey, id ) {
        const response = await this.#_request_post('', 'payout/process', apiKey, {payout_id: id})

        return response.status === 'success' ? response : null
    }

    static async checkPayoutStatus( apiKey, id ) {
        if ( !id ) {
            throw new Error('Please provide the Payout ID')
        }

        const response = await this.#_request_post('', 'payout/status', apiKey, {payout_id: id})

        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    /**
     * Requests a Payment Link
     * @returns {Promise<*|null>}
     */
    static async paymentRequest( redirectUrl, notifyUrl, value, apiKey, params = {}, bbParams = {} ) {
        if ( !notifyUrl || !redirectUrl || !value || !apiKey ) {
            return null
        }

        redirectUrl = new URL(redirectUrl)
        notifyUrl = new URL(notifyUrl)

        if ( Object.entries(params).length > 0 ) {
            Object.entries(params).forEach(( [k, v] ) => redirectUrl.searchParams.append(k, v))
            Object.entries(params).forEach(( [k, v] ) => notifyUrl.searchParams.append(k, v))
        }

        const reqParams = {
            ...bbParams, ...{
                redirect_url: encodeURI(redirectUrl.toString()),
                notify_url: encodeURI(notifyUrl.toString()),
                value: value,
                apikey: apiKey
            }
        }

        const response = await BlockBee.#_request_get('', 'checkout/request', reqParams)
        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    /**
     * Fetch payment logs
     * @param {string} token
     * @param {string} apiKey
     * @returns {Promise<null|Object>}
     */
    static async paymentLogs( token, apiKey ) {
        if ( !token ) {
            throw new Error('Token is Empty')
        }

        const params = {
            apikey: apiKey,
            token: token
        }

        const response = await BlockBee.#_request_get('', 'checkout/logs', params)

        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    /**
     * Requests a Deposit Link
     * @returns {Promise<*|null>}
     */
    static async depositRequest( notifyUrl, apiKey, parameters = {}, bbParams = {} ) {
        if ( !notifyUrl || !apiKey ) {
            return null
        }

        notifyUrl = new URL(notifyUrl)

        if ( Object.entries(parameters).length > 0 ) {
            Object.entries(parameters).forEach(( [k, v] ) => notifyUrl.searchParams.append(k, v))
        }

        const params = {
            ...bbParams, ...{
                notify_url: encodeURI(notifyUrl.toString()),
                apikey: apiKey
            }
        }

        const response = await BlockBee.#_request_get('', 'deposit/request', params)

        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    /**
     * Fetch deposit logs
     * @param {string} token
     * @param {string} apiKey
     * @returns {Promise<null|Object>}
     */
    static async depositLogs( token, apiKey ) {
        if ( !token ) {
            throw new Error('Token is Empty')
        }

        const params = {
            apikey: apiKey,
            token: token
        }

        const response = await BlockBee.#_request_get('', 'deposit/logs', params)

        if ( response.status === 'success' ) {
            return response
        }

        return null
    }

    /**
     * Helper function to make a request to API
     * @param coin
     * @param endpoint
     * @param params
     * @returns {Promise<any>}
     */
    static async #_request_get( coin, endpoint, params = {} ) {
        const url = coin ? new URL(`${this.#baseURL}/${coin.replace('_', '/')}/${endpoint}/`) : new URL(`${this.#baseURL}/${endpoint}/`)

        if ( params ) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        }

        const fetchParams = {
            method: 'GET',
            headers: {
                referer: this.#baseURL
            },
            credentials: 'include'
        }

        const response = await fetch(url, fetchParams)
        return await response.json()
    }

    static async #_request_post( coin, endpoint, apiKey, body = {}, isJson = false ) {
        const baseURL = this.#baseURL

        const coinPath = coin ? `${coin.replace('_', '/')}` : ''

        let url = new URL(`${baseURL}/${endpoint}/`)

        if ( coin ) {
            url = new URL(`${baseURL}/${coinPath}/${endpoint}/`)
        }

        url.searchParams.append('apikey', apiKey)
        const headers = {}
        let data

        if ( isJson ) {
            headers['Content-Type'] = 'application/json'
            data = JSON.stringify(body)
        } else {
            data = new URLSearchParams(body).toString()
            headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }

        const fetchParams = {
            method: 'POST',
            headers: headers,
            body: data
        }

        const response = await fetch(url, fetchParams)
        return await response.json()
    }
}

module.exports = BlockBee
