/*
 * 
 * Arquivo prim�rio do API
 * 
 */

//Deped�ncias
var server = require("./lib/server");


//Declara o app
var app = {};

//Inicia as fun��es

app.init = function () {
    //inicia server
    server.init();
}

app.init();