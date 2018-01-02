var request = require('request');
var crypto = require('crypto');

const config = require('../config.js');

const API_Key    = config.API_keys.API_Key;
const API_Secret = config.API_keys.API_Secret;


function getBalance(callback) {
   var timestamp = Date.now().toString();
   var method = 'GET';
   var path = '/v1/me/getbalance';
   var body = JSON.stringify({});

   var text = timestamp + method + path + body;
   var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

   var options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      body: body,
      headers: {
         'ACCESS-KEY': API_Key,
         'ACCESS-TIMESTAMP': timestamp,
         'ACCESS-SIGN': sign,
         'Content-Type': 'application/json'
      }
   };
   request(options, function (err, response, payload) {
      payload = JSON.parse(payload);
      console.log(`あなたの 日本円 の残高は ${payload[0].amount}円 です。`);
      console.log(`あなたの Bitcoin の残高は ${payload[1].amount} Bitcoin です。`);
      callback(err, response, payload);
   });
}

function getTradingCommission(callback) {
   var timestamp = Date.now().toString();
   var method = 'GET';
   var path = '/v1/me/gettradingcommission?product_code=BTC_JPY';
   var text = timestamp + method + path;
   var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

   var options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      headers: {
         'ACCESS-KEY': API_Key,
         'ACCESS-TIMESTAMP': timestamp,
         'ACCESS-SIGN': sign
      }
   };
   request(options, function (err, response, payload) {
      payload = JSON.parse(payload);
      console.log(`手数料は ${payload.commission_rate}円です。`);
      callback(err, response, payload);
   });
}

function getMarket(callback) {
   var timestamp = Date.now().toString();
   var method = 'GET';
   var path = '/v1/markets';
   var body = JSON.stringify();

   var text = timestamp + method + path + body;
   var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

   var options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      body: body,
      headers: {
         'ACCESS-KEY': API_Key,
         'ACCESS-TIMESTAMP': timestamp,
         'ACCESS-SIGN': sign,
         'Content-Type': 'application/json'
      }
   };
   request(options, function (err, response, payload) {
      payload = JSON.parse(payload);
      console.log(payload);
      callback(err, response, payload);
   });
}

function cancelAll(callback) {
   var timestamp = Date.now().toString();
   var method = 'POST';
   var path = '/v1/me/cancelallchildorders';
   var body = JSON.stringify({"product_code": "BTC_JPY"});

   var text = timestamp + method + path + body;
   var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

   var options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      body: body,
      headers: {
         'ACCESS-KEY': API_Key,
         'ACCESS-TIMESTAMP': timestamp,
         'ACCESS-SIGN': sign,
         'Content-Type': 'application/json'
      }
   };
   request(options, function (err, response, payload) {
      console.log(response.statusCode);
      callback(err, response, payload);
   });
}

function buyOrder(price, BTCSize, callback) {
   var timestamp = Date.now().toString();
   var method = 'POST';
   var path = '/v1/me/sendchildorder';
   var body = JSON.stringify({
      "product_code": "BTC_JPY",
      "child_order_type": "LIMIT",
      "side": "BUY",
      "price": price,
      "size": BTCSize,
      "minute_to_expire": 1440,
      "time_in_force": "GTC"
   });

   var text = timestamp + method + path + body;
   var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

   var options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      body: body,
      headers: {
         'ACCESS-KEY': API_Key,
         'ACCESS-TIMESTAMP': timestamp,
         'ACCESS-SIGN': sign,
         'Content-Type': 'application/json'
      }
   };
   request(options, function (err, response, payload) {
      payload = JSON.parse(payload);
      callback(err, response, payload);
   });
}

function sellOrder(price, BTCSize, callback) {
   var timestamp = Date.now().toString();
   var method = 'POST';
   var path = '/v1/me/sendchildorder';
   var body = JSON.stringify({
      "product_code": "BTC_JPY",
      "child_order_type": "LIMIT",
      "side": "SELL",
      "price": price,
      "size": BTCSize,
      "minute_to_expire": 1440,
      "time_in_force": "GTC"
   });

   var text = timestamp + method + path + body;
   var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

   var options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      body: body,
      headers: {
         'ACCESS-KEY': API_Key,
         'ACCESS-TIMESTAMP': timestamp,
         'ACCESS-SIGN': sign,
         'Content-Type': 'application/json'
      }
   };
   request(options, function (err, response, payload) {
      payload = JSON.parse(payload);
      callback(err, response, payload);
   });
}

function getOrders(callback) {
   var timestamp = Date.now().toString();
   var method = 'GET';
   var path = '/v1/me/getchildorders?product_code=BTC_JPY&child_order_state=ACTIVE';
   var body = JSON.stringify({

   });

   var text = timestamp + method + path + body;
   var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

   var options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      body: body,
      headers: {
         'ACCESS-KEY': API_Key,
         'ACCESS-TIMESTAMP': timestamp,
         'ACCESS-SIGN': sign,
         'Content-Type': 'application/json'
      }
   };
   request(options, function (err, response, payload) {
      payload = JSON.parse(payload);
      callback(err, response, payload);
   });
}

function getExecutions(callback) {
   var timestamp = Date.now().toString();
   var method = 'GET';
   var path = '/v1/me/getexecutions?product_code=BTC_JPY';
   var body = JSON.stringify({});

   var text = timestamp + method + path + body;
   var sign = crypto.createHmac('sha256', API_Secret).update(text).digest('hex');

   var options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      body: body,
      headers: {
         'ACCESS-KEY': API_Key,
         'ACCESS-TIMESTAMP': timestamp,
         'ACCESS-SIGN': sign,
         'Content-Type': 'application/json'
      }
   };
   request(options, function (err, response, payload) {
      payload = JSON.parse(payload);
      callback(err, response, payload);
   });
}


module.exports = {
   getBalance: getBalance,
   getTradingCommission: getTradingCommission,
   cancelAll: cancelAll,
   buyOrder: buyOrder,
   sellOrder: sellOrder,
   getOrders: getOrders,
   getExecutions: getExecutions
}
