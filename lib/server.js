/*
 * 
 * Server
 * 
 */

//depedências

var http = require('http');
var StringDecoder = require("string_decoder").StringDecoder;
var handlers = require("./handlers");
var helpers = require('./helpers');


//Instancia o objeto server
var server = {};

//Instancia o HTTP server
server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
});


// @TODO: instanciar o HTTPS server



// Lógia para server HTTP e HTTPS
server.unifiedServer = function (req, res) {

    //Coleta URL e transforma em objeto.
    const parseUrl = new URL(req.url.toString(),"http://localhost:3000")

    var path = parseUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Coleta o Query como objeto
    var queryStringObject = parseUrl.search;

    //Coleta o methodo HTTP
    var method = req.method.toLowerCase();

    //Coleta os Headers(cabeçários)
    var headers = req.headers;

    //Coleta o payload, se existir
    var decoder = new StringDecoder("utf-8");
    var buffer = "";

    req.on("data", (data) => {
        buffer += decoder.write(data);
    });

    req.on("end", () => {
        buffer += decoder.end();

        //Escolha o manipulador do request
        var chosenHandler = typeof (server.router[trimmedPath]) !== "undefined" ? server.router[trimmedPath] : handlers.notFound;


        //Cria objeto data
        var data = {
            "trimmedPath": trimmedPath,
            "queryStringObject": queryStringObject,
            "method": method,
            "headers": headers,
            "payload": helpers.parseJsonToObject(buffer) 

        };


        chosenHandler(data, function (statusCode, payload) {

            // Utilizar statusCode do callback
            var statusCode = typeof (statusCode) == "number" ? statusCode : 200;



            var payloadString = JSON.stringify(payload);
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadString);

        });

    });

};

// init script
server.init = function () {
    server.httpServer.listen(3000, "localhost", function () {
        console.log("Servidor está ronando em localhost:3000");
    });
}



//Definição do rotas
server.router = {
    "api/users": handlers.users
}

//Exorta o módulo
module.exports = server;