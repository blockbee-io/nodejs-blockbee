[<img src="https://blockbee.io/static/assets/images/blockbee_logo_nospaces.png" width="300"/>](image.png)

# BlockBee's NodeJS Library
NodeJS's implementation of BlockBee's payment gateway

## Install

```console
npm install nodejs-blockbee
```

## Usage

### Importing in your project file

```js
var BlockBee = require('nodejs-blockbee')
```

### Generating a new Address

```js
const bb = new BlockBee(coin, myAddress, callbackUrl, params, blockbeeParams, apiKey)

const address = await bb.getAddress()
```

Where:

* `coin` is the coin you wish to use, from BlockBee's supported currencies (e.g 'btc', 'eth', 'erc20_usdt', ...).
* `myAddress` is your own crypto address, where your funds will be sent to. It's optional, you can leave it empty (e.g ``''``) if you are setting it up in BlockBee's [dashboard](https://dash.blockbee.io/).
* `callbackUrl` is the URL that will be called upon payment.
* `params` is any parameter you wish to send to identify the payment, such as `{orderId: 1234}`.
* `blockbeeParams` parameters that will be passed to BlockBee _(check which extra parameters are available here: https://docs.blockbee.io/#operation/create).
* `apiKey` is the API Key provided by BlockBee's [dashboard](https://dash.blockbee.io/).
* `address` is the newly generated address, that you will show your users in order to receive payments.

### Getting notified when the user pays

> Once your customer makes a payment, BlockBee will send a callback to your `callbackUrl`. This callback information is by default in ``GET`` but you can se it to ``POST`` by setting ``post: 1`` in ``blockbeeParams``. The parameters sent by BlockBee in this callback can be consulted here: https://docs.blockbee.io/#operation/confirmedcallbackget

### Checking the logs of a request

```js
const bb = new BlockBee(coin, myAddress, callbackUrl, params, blockbeeParams, apiKey)

const data = await bb.checkLogs()
```
> Same parameters as before, the ```data``` returned can b e checked here: https://docs.blockbee.io/#operation/logs

### Generating a QR code

```js
const bb = new BlockBee(coin, myAddress, callbackUrl, params, blockbeeParams, apiKey)
    
const address = await bb.getAddress()

// ...

const qrCode = await bb.getQrcode(value, size)
```
For object creation, same parameters as before. You must first call ``getAddress` as this method requires the payment address to have been created.

For QR Code generation:

* ``value`` is the value requested to the user in the coin to which the request was done. **Optional**, can be empty if you don't wish to add the value to the QR Code.
* ``size`` Size of the QR Code image in pixels. Optional, leave empty to use the default size of 512.
* ``apiKey`` is the API Key provided by BlockBee's [dashboard](https://dash.blockbee.io/).

> Response is an object with `qr_code` (base64 encoded image data) and `payment_uri` (the value encoded in the QR), see https://docs.blockbee.io/#operation/qrcode for more information.

### Estimating transaction fees

```js
const fees = await BlockBee.getEstimate(coin, apiKey, addresses, priority)
```
Where: 
* ``coin`` is the coin you wish to check, from BlockBee's supported currencies (e.g 'btc', 'eth', 'erc20_usdt', ...)
* ``apiKey`` is the API Key provided by BlockBee's [dashboard](https://dash.blockbee.io/).
* ``addresses`` The number of addresses to forward the funds to. Optional, defaults to 1.
* ``priority`` Confirmation priority, (check [this](https://support.blockbee.io/article/how-the-priority-parameter-works) article to learn more about it). Optional, defaults to ``default``.

> Response is an object with ``estimated_cost`` and ``estimated_cost_usd``, see https://docs.blockbee.io/#operation/estimate for more information.

### Converting between coins and fiat

```js
const conversion = await BlockBee.getConvert(coin, value, from, apiKey)
```
Where:
* ``coin`` the target currency to convert to, from BlockBee's supported currencies (e.g 'btc', 'eth', 'erc20_usdt', ...)
* ``value`` value to convert in `from`.
* ``from`` currency to convert from, FIAT or crypto.
* ``apiKey`` is the API Key provided by BlockBee's [dashboard](https://dash.blockbee.io/).

> Response is an object with ``value_coin`` and ``exchange_rate``, see https://docs.blockbee.io/#operation/convert for more information.

### Getting supported coins
```js
const supportedCoins = await BlockBee.getSupportedCoins(apiKey)
```
Where:
* ``apiKey`` is the API Key provided by BlockBee's [dashboard](https://dash.blockbee.io/).

> Response is an array with all support coins.

## Help

Need help?  
Contact us @ https://blockbee.io/contacts/


### Changelog

#### 1.0.0
* Initial Release