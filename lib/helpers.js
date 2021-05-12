/*
 * 
 * Funções para auxiliar o APP
 * 
 */

//Depedências
var crypto = require('crypto');
var config = require('./config');


//Creat object Helper

var helpers = {};

//Cria objeto JSON sem dar erro
helpers.parseJsonToObject = function (str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
}


//Cria um SHA256 
helpers.hash = function (str) {
    if (typeof (str) == 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
}


//Exporta Objeto
module.exports = helpers;

