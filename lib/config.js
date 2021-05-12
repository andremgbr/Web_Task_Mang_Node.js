/*
 * Configurações de variaveis
 * 
 */

const { env } = require("process");



//Cria objeto
var environments = {};


environments = {
    'hashingSecret': 'istoESegrdo'
}



//Export
module.exports = environments;