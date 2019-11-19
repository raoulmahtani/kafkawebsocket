let config = require("../../config");
import pino = require('pino')
import { timingSafeEqual } from 'crypto';

enum LogLevel {
    fatal = 'fatal',
    error = 'error',
    warn = 'warn',
    info = 'info',
    debug = 'debug',
    trace = 'trace'
}

type logger = pino.Logger

export default class Logger {
    private static instance : Logger = new Logger();
    private pinoLogger: logger;
    private loglevel : string
    private isDebugLoggingEnabled = false;
    
    constructor() {
        if(Logger.instance){
            throw new Error('Singleton instance. Use Logger.getInstance()')
        }
        Logger.instance = this;

        this.pinoLogger = pino({
            name: config.get('app.name'),
            level: config.get('log.level'),
            useLevelLabels: true,
            prettyPrint:config.get('log.prettyPrint')
        })

        this.loglevel = this.pinoLogger.level
        if(this.loglevel === LogLevel.debug || this.loglevel === LogLevel.trace) {
            this.isDebugLoggingEnabled = true
        }
    }

    public static getInstance() : logger{
        return Logger.instance.pinoLogger;
    }
    
    public static isDebugLoggingEnabled() {
        return Logger.instance.isDebugLoggingEnabled
    }
}