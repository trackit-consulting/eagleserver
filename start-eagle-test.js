var config = require('./lib/config/settings'),
    helper = require('./lib/utilities/helper').Helper,
    WebSocketClient = require('websocket').client,
    logger = require('./lib/utilities/logger/test'),
    http = require('http');

var toRetryConnect = false;
var util = require('util');
var client;

startClient(function () {
    console.log("Client is running");
});

function startClient(callback) {
    client = new WebSocketClient();
    //logger.info(routes.length + ' routes on track');

    client.on('connectFailed', function (error) {
        logger.error('WebSocket ' + error.toString());
        if(!toRetryConnect){
            toRetryConnect = true;
            setTimeout(function(){
                retryConnection(client);
            }, 10000);
        }
    });

    client.on('connect', function (connection) {
        logger.info('WebSocket Client Connected');

        connection.send(JSON.stringify({type: 'auth', mid: 153921}));

        connection.on('error', function (error) {
            logger.info('WebSocket  ' + error.toString());
            setTimeout(function(){
                retryConnection(client);
            }, 3000);
        });

        connection.on('close', function () {
            logger.info('WebSocket Connection Closed');
            setTimeout(function(){
                retryConnection(client);
            }, 3000);
        });

        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                var data = JSON.parse(message.utf8Data);
                if(data.params.type == "records") {
                    if (data.params.lastRecord !== undefined) {
                        var record = data.params.lastRecord;
                        logger.info("%j", record);
                    }
                }
            }
        });
        callback();
    });

    // connect to the server
    connect(client);

    function connect (client){
        //retry connection
        var uri = util.format("ws://%s:%s/", config.socket.local.host, config.socket.local.port);
        logger.info('WebSocket Server uri   : %s', uri);
        logger.info('WebSocket Server domain: %s', config.socket.remote.domain);
        client.connect(uri, 'echo-protocol', config.socket.remote.domain);
    }

    function retryConnection(client){
        try{
            client.abort();
        } catch(e){}

        //reset flag
        toRetryConnect = false;

        //retry connection
        connect(client);
    }
}