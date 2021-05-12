/*
 * 
 * Manipuladores de request
 * 
 */

//Dependencias

var _data = require("./data");
var helpers = require("./helpers");



//Cria objeto manipuladores
var handlers = {};


/*
 * 
 * JSON API Manipuladores
 * 
 */



//Filtrando methodos permitidos para o manipuladores USERS
handlers.users = function (data, callback) {
    if (['post', 'get', 'put', 'delete'].indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
}


//Todos user method object

handlers._users = {};


handlers._users.get = function (data, callback) {

    var token = typeof (data.headers.token) == "string" && data.headers.token > 0 ? data.headers.token : false;

    //@TODO incluir token

    _data.getAll("users",(err, rows) => {
        if (!err) {
            callback(200, rows);
        } else {
            callback(500,err);
        }
    });
};


handlers._users.post = function (data, callback) {

    var firstName = typeof (data.payload.firstName) == "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof (data.payload.lastName) == "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof (data.payload.password) == "string" && data.payload.password.trim().length >= 6 ? data.payload.password : false;
    var userID = typeof (data.payload.userID) == "string" && data.payload.userID.trim().length == 5 ? data.payload.userID.trim() : false;



    if (firstName && lastName && password && userID) {
        _data.get("users", "userID", userID, (err, data)=>{
            if (err) {

                var sha256_password = helpers.hash(password);

                var data = {
                    "firstName": firstName,
                    "lastName": lastName,
                    "sha256_password": sha256_password,
                    "userID": userID

                }

                _data.insertRow("users", data, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500);
                    }
                });
            } else {
                callback(400, { "Erro": "Usuário com esse userID já existe" });
            }
        });
    } else {
        callback(400, { "Erro": "Faltando input necessário" });
    }
 


};



handlers.notFound = function (data, callback) {
    callback(404);
};





//Exporta modulo
module.exports=handlers