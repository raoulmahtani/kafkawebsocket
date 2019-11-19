const WebSocketServer = require('websocket').server;
const http = require('http')
import Logger from './logging'
const config = require('../../config')

export default class KafkaWebSocketServer { 
    private server = http.createServer(function(request:any, reponse: any) {});
    private log = Logger.getInstance();
    private wsServer : any
    private wsConnections : Array<any> = []

    constructor(){
        this.log.info('Initializing HTTP Server')

        try{
            this.server.listen(config.get('port'), function(){});
            this.log.info(`HTTP Server listening on ${config.get('port')}`)
            this.wsServer = new WebSocketServer({
                httpServer: this.server
            })
            this.log.info('WebSocker server initialized')
        }
        catch(e) {
            this.log.error(e)
        }
    }

    public async initializeWebSocketServer() {
        var connections = this.wsConnections;
        this.wsServer.on('request',function(request:any){
            var connection = request.accept(null,request.origin)
            connections.push(connection)

            connection.on('message',function(message:{type:string}) {
                if(message.type === 'utf8'){
                    Logger.getInstance().debug(`message detected: ${JSON.stringify(message)}`)
                    connection.send("not listening just yet")
                }
            })
            connection.on('close',function(connection:any){
                //close connection
            })
        })
    }
    public async send(message:any){
        Logger.getInstance().info("sending message",message)
        this.wsConnections.forEach(async connection => {
            connection.sendUTF(JSON.stringify(message))
        })
    }
    public async getConnectionCount(){
        return this.wsConnections.length
    }
}