const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize');
const fs = require('fs');
const uuid = require('uuid');
const expressJwt = require('express-jwt');
require('dotenv').config({ path: process.env.ENV_CONFIG });

const winston = require('./config/winston');
const config = require('./config/config');
const mongodb = require('./config/db.config');
const commonCtrl = require('./controllers/common.controller');

const app = express();
app.enable('trust proxy');
app.set('trust proxy', function () { return true; });

//Initialize database connection
mongodb();
//Control request headers 
app.use(helmet());

//Rate limiter to control number of requests
const requestLimiter = rateLimit({
  windowMs: Number(process.env.MAX_REQUESTS_WAIT_WINDOW * 60 * 1000), // wait time in mins window
  max: Number(process.env.MAX_REQUESTS_IP),//max requests in given window
  headers: false,
  keyGenerator: function (req, res) {
    return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  }
});
//Limit on user for maximum requests in 10 mins window.
app.use(requestLimiter);

//Whitelist the URLs from whch we get requests, ADFS one should also be added.
var whitelist = [process.env.ALLOWED_HOST]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error(ERRORS.CORS_ERROR_MSG))
    }
  },
  allowedHeaders: ['Access-Control-Allow-Origin', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  preflightContinue: false
}
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  let uuidReq = uuid.v1();
  req.id = uuidReq;
  next();
});

logger.token('id', function getId(req) {
  return req.id
});

//get real ip if passed by nginx
logger.token('remote-addr', function (req) {
  return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
});

fs.existsSync("./../assignment_logs") || fs.mkdirSync("./../assignment_logs");

app.use(logger('"Request Id- :id" ":remote-addr ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', { stream: winston.stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

//To-Do : Authentication of request 
app.use(expressJwt({
  secret: config.secret,
  algorithms: ['sha1', 'RS256', 'HS256'],
  getToken: commonCtrl.getJWTToken
}).unless({
  path: ['/api/v1/users/authenticate']
}));

require('./routes/auth.route')(app);
require('./routes/pet.route')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  winston.error("Request Id-" + req.id + "-" + (err.status || 500) + '-' + err.message + '-' + req.originalUrl + '-' + req.method + '-' + req.ip);
  // render the error page
  res.status(err.status || 500);
  if (!err.status || err.status === 500) {
    return res.send({ status: 500, message: "Internal Server Error" });
  } else if (err.status === 404) {
    return res.send({ status: err.status, message: "Resoruce not found" });
  } else {
    return res.send({ status: err.status, message: err.message });
  }
});

module.exports = app;
