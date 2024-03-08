[<img src="https://blockbee.io/static/assets/images/blockbee_logo_nospaces.png" width="300"/>](image.png)

# BlockBee's NodeJS Library
NodeJS's implementation of BlockBee's payment gateway

## Install

```console
npm install @blockbee/api
```

## Usage

### Importing in your project file

```js
var BlockBee = require('@blockbee/api')
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


### Request Payout

```js
const createPayout =  await BlockBee.createPayout(coin, address, value, apiKey);
```

This function can be used by you to request payouts (withdrawals in your platform).

Where:
* ``coin`` The cryptocurrency you want to request the Payout in (e.g `btc`, `eth`, `erc20_usdt`, ...).

* ``address`` Address where the Payout must be sent to.

* ``value`` Amount to send to the ``address``.

> The response will be only a ``success`` to confirm the Payout Request was successfully created. To fulfill it you will need to go to BlockBee Dashboard.


## Help

Need help?  
Contact us @ https://blockbee.io/contacts/

### Changelog

#### 1.0.0
* Initial Release

#### 1.0.2
* Version Bump

#### 1.0.3
* Minor fixes

#### 1.0.4
* Minor fixes

#### 1.1.0
* Added Payouts
* Minor bugfixes

#### 1.1.1
* Minor bugfixes
