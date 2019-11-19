let config = require('../config');
import Logger from "../app/modules/logging"
import KafkaWebSocketServer from './modules/kafkaWebSocketServer'
const log = Logger.getInstance()

log.info(config.toString())

const kafka = require('kafka-node');

const Consumer = kafka.Consumer; //Create kafka consumer
log.info('Attempting to initialize consumer');
try {
    const client = new kafka.KafkaClient(config.get('kafka'))
    let consumer = new Consumer(
        client,
        [{topic: config.get('topic'), partition: 0}],
        {
            autoCommit: true,
            fetchMaxWaitMs: 1000,
            fetchMaxBytes: 1024 * 1024,
            encoding: 'utf8',
            fromOffest: false
        }
    )
    log.info('Initialized Kafka consumer with params')
    const wss = new KafkaWebSocketServer();
    wss.initializeWebSocketServer()

    consumer.on('message', async function(message:any){
        if((await wss.getConnectionCount()) > 0){
            wss.send(message)
        }
        else{
            //nobody's here
        }
    })
    consumer.on('error', function(err:any){
        log.error('error',err)
    })
}
catch(e){
    log.error(e)
}
