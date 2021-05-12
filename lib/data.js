/*
 * 
 * Comunicação com DATAbaSE SQL
 * 
 */


//Depedências
const sqlite3 = require('sqlite3').verbose()
var path = require('path')


//Cria objeto data
var data = {};

data.insertRow = function (table, dataRow, callback) {

    var dataRow = typeof (dataRow) == "object" ? dataRow : false;

    var dbPath = path.resolve(__dirname + "/../.data/", 'data.db');

    if (dataRow) {
        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (!err) {
                let columns = "";
                let values = "";

                data = Object.entries(dataRow);
                for (var i = 0; i < data.length; i++) {
                    if (i == 0) {
                        columns += data[i][0];
                        values += "\"" + data[i][1] + "\"";
                    } else {
                        columns += " , "+data[i][0];
                        values += " , "+ "\""+data[i][1]+"\"";
                    }
                }

                let sql = "INSERT INTO " + table + " (" + columns + " ) values (" + values + " );";
                console.log(sql);
                db.run(sql);
                db.close()
                callback(false);

            } else {
                callback({ "Erro": "Banco de dados não encontrado." })
            }
        });
    } else {
        callback(500,{ "Erro": "DataRow não é um objeto!" });
    }


};


data.get = function (table, column, value, callback) {

    var dbPath = path.resolve(__dirname + "/../.data/", 'data.db');


        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (!err) {
                let sql = "SELECT * FROM " + table + " WHERE " + column + " = " + value + ";";
                db.get(sql, [], (err, row)=>{
                    if (!err && row) {
                        callback(false, row);
                    } else {
                        callback("Não encontrado");
                    }
                });
                db.close()
            } else {
                callback(500, { "Erro": "DataRow não é um objeto!" });
            }
        });

};


data.getAll = function (table,callback) {
    var dbPath = path.resolve(__dirname + "/../.data/", 'data.db');
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (!err) {
            console.log("Conectado com dat.db normalmente!");
            let sql = 'SELECT * from '+table+";";
            db.all(sql, [], (err, rows) => {
                if (!err && rows) {
                    db.close();
                    console.log("Foi fechado o Database");
                    callback(false, rows);
                } else {
                    db.close();
                    callback({"Erro":"Data não econtrada."});
                }
            });
           
        } else {
            callback({ "Erro": "Banco de dados não encontrado."})
        }
    });

};

// exporta o modulo
module.exports = data;