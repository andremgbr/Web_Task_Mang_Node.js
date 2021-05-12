/*
 * 
 * Arquivo primário do API
 * 
 */

//Depedências
var server = require("./lib/server");


//Declara o app
var app = {};

//Inicia as funções

app.init = function () {
    //inicia server
    server.init();
}

app.init();