const mysql = require('mysql2');
const dbconfig = require('./dbconfig');

const getAll = () => {
    return new Promise((resolve, reject) => {
        var ret = false;
        const dbcfg = new dbconfig();
        const connection = mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        connection.on('error', function (err) {
            reject(err);
        });

        connection.query(
            "SELECT * FROM tbl_cities;", [],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined') {
                    ret = results;
                }
                else ret = null;
                resolve(ret);
            }
        );
    });
};

module.exports = {
    getAll
}