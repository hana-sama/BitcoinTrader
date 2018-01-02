var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;
var async = require('async');

var trade = require('./myModules/trade');
var realTime = require('./myModules/realTime');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.get('/data',function(req,res){
   data.ltp = realTime.getLtp().ltp;
   res.json(data);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


const data = {
   referenceValues: {}
};

function setReferenceValues() {
   const ltp = realTime.getLtp();
   console.log('基準： ' + ltp.ltp);
   data.referenceValues.ltp = ltp.ltp;
   data.referenceValues.timestamp = ltp.timestamp;
}

var buyPercentages = [
         0.98, 0.97, 0.96, 0.95, 0.94, 0.93, 0.92, 0.91, 0.9,
   0.89, 0.88, 0.87, 0.86, 0.85, 0.84, 0.83, 0.82, 0.81, 0.8,
   0.79, 0.78, 0.77, 0.76, 0.75, 0.74, 0.73, 0.72, 0.71, 0.7,
];
function init() {

   console.log('日本円残高とビットコイン残高を取得しています。');
   trade.getBalance(function(err, response, payload) {
      data.moneyBalance = payload[0].amount;
      data.bitCoinBalance = payload[1].amount;

      console.log('手数料を取得しています。');
      trade.getTradingCommission(function(err, response, payload) {
         data.tradingCommission = payload.commission_rate;


         trade.cancelAll(function(){
            console.log('全ての注文をキャンセルしました。');

            setReferenceValues();

            // 平均取得額
            trade.getExecutions(function(err, response, payload) {
               var totalSize  = 0;
               var totalPrice = 0;
               var counter = 0;
               for (var execution of payload) {
                  if (totalSize >= data.bitCoinBalance) {
                     return;
                  }

                  totalPrice += execution.price;
                  counter += 1;
               }
               data.averagebitCoinBalance = Math.floor(totalPrice / counter);
               console.log('平均取得額: ' + data.averagebitCoinBalance + '円');

               // 売り注文
               var sellPrice = Math.round(data.averagebitCoinBalance * 1.2);
               var sellBTCSize = data.bitCoinBalance.toFixed(3);
               trade.sellOrder(sellPrice, sellBTCSize, function(err, response, payload) {
                  console.log(sellPrice + '円で ' + sellBTCSize + ' BTC 売り注文を出しました ' + payload.child_order_acceptance_id);
               });
            });

            // 買い注文
            async.each(buyPercentages, function(item, callback){
               var price = Math.floor(data.referenceValues.ltp * item);
               var BTCSize = 0.001;
               console.log('書う値段： ' + price);
               trade.buyOrder(price, BTCSize, function(err, response, payload) {
                  console.log(price + '円で買い注文を出しました ' + payload.child_order_acceptance_id);
                  callback();
               });

            }, function(err){
               //処理2
               if(err) throw err;

               setTimeout(function() {
                  trade.getOrders(function(err, response, payload) {
                     console.log('----- 注文一覧 -----');
                     for (var order of payload) {
                        console.log(order.side + ' ' + order.price + '円 ' + order.child_order_acceptance_id);
                     }
                  });
               }, 1000);
            });
         });
      });
   });
}
setTimeout(init, 2000);


new CronJob('00 00 04 * * *', function() { // 毎日 4時00分00杪
   console.log('朝になりました。基準値と注文を更新します。');
   trade.cancelAll(function(){
      init();
   });
}, null, true, 'Asia/Tokyo');

