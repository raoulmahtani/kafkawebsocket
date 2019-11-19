import * as dotenv from 'dotenv'
import * as debug from 'debug'
const convict = require('convict')

dotenv.config()

//Define a schema

let options = {
    env: {
        doc: 'Type of environment',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV',
    },
    app: {
        name: {
            doc: 'The Name of the Application',
            format: String,
            default:'KafkaNodeWebSocket'
        }
    },
    port : {
            doc: 'Port to bind on',
            format: 'port',
            default : 8080,
            env: 'PORT',
            arg: 'port'
        },
    kafka: {
        kafkaHost: {
            doc: 'Kafka Broker Name',
            format: String,
            default: ""
        },
        connectTimeout: {
            doc: 'Time in ms to wait for successful connection before skipping to next host',
            format: Number,
            default: 10000
        },
        requestTimeout : {
            doc: 'Time in ms to wait for a request to timeout',
            format: Number,
            default: 30000
        },
        autoConnect: {
            doc: 'Autoconnect to topic specified',
            type: Boolean,
            default : true
        },
        connectRetryOptions: {
            timeouts : {
                doc: 'Amount of times to try',
                format: Number,
                default: 100
            },
            minTimeout: {
                doc : 'Amount of time between retries',
                format: Number,
                default: 10000
            }
        }
    },
    topic : {
        doc: 'Kafka topic to bind to',
        format: String,
        default: 'test',
        env: 'TOPIC'
    },
    log: {
        level : {
            doc: 'Log level for the app',
            format: String,
            default: 'debug'
        },
        prettyPrint: {
            doc: 'Pretty print the logs',
            format: Boolean,
            default: false
        }
    }
}

let config = convict(options)
//Load env config
var env = config.get('env');
config.loadFile("./config/" + env + ".json");

if(config.get('log.level') == 'debug'){
    debug.enable('*');
}
//perform validation
config.validate({allowed : 'strict'});

module.exports = config