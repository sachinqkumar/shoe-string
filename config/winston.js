var winston = require('winston');

const { timestamp, combine, json } = winston.format;

var options = {
    file: {
        level: 'info',
        filename: "./../assignment_logs" + "/assignment.log",
        handleExceptions: true,
        json: true,
        maxsize: 1048576, // 1MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};


const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: 'ddd, DD MMM YYYY HH:mm:ss'
        }),
        json(),
    ),
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions

});

logger.stream = {
    write:  (message, encoding) => {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};
module.exports = logger;