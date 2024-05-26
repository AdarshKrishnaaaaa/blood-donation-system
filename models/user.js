const mysql = require('mysql2');
const dbconfig = require('./dbconfig');

const getAllActive = () => {
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
            "SELECT * FROM tbl_users WHERE user_status='Active';", [],
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
            "SELECT * FROM tbl_user;", [],
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

const getUserCount = () => {
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
            "SELECT COUNT(*) as cnt FROM tbl_user;", [],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined') {
                    ret = results;
                }
                else ret = null;
                resolve(ret[0].cnt);
            }
        );
    });
};

const get = (user_id) => {
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
            "SELECT * FROM tbl_user WHERE user_id=?;", [user_id],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results[0]);
                }
                else resolve(null);
            }
        );
    });
};
const getUidFromMobile = (mobile) => {
    return new Promise((resolve, reject) => {
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
            "SELECT user_id FROM tbl_user WHERE user_mobile=?;", [mobile],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0)
                    resolve(results[0].user_id);
                else resolve(null);
            }
        );
    });
};

const checkLoginCredentials = (mobile, passwd) => {
    var ret = false;
    return new Promise((resolve, reject) => {
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
            "SELECT * FROM tbl_user WHERE user_mobile=? AND user_passwd=? AND user_status='Active';", [mobile, passwd],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined') {
                    if(results.length > 0) ret = true;
                    else ret = false;
                }
                else ret = false;
                resolve(ret);
            }
        );
    });
};

const checkDuplicate = (mobile) => {
    return new Promise((resolve, reject) => {
        var val = null;
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
            "SELECT * FROM tbl_user WHERE `user_mobile` = ?;",
            [ mobile ],
            function(error, result, fields) {
                if(error) reject(error);
                if(result.length > 0) resolve(true);
                else resolve(false);
            }
        );
    });
};

const create = (fullname, mobile, passwd, age, gender, blood, weight, address, city) => {
    return new Promise((resolve, reject) => {
        console.log('Init user create() ...');
        var val = null;
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

        connection.execute(
            "INSERT INTO `tbl_user` (`user_fullname`,`user_mobile`,`user_passwd`,`user_age`,`user_gender`,`user_bloodtype`,`user_weight`,`user_address`,`user_city`) VALUES (?,?,?,?,?,?,?,?,?);",
            [ fullname, mobile, passwd, age, gender, blood, weight, address, city ],
            function(error, result, fields) {
                console.log('End user create() ...');
                console.log(error);
                console.log(result);
                if(error) reject(error);
                else resolve(true);
            }
        );
    });
};

const update = (userid, fullname, mobile, passwd, age, gender, blood, weight, address, city) => {
    return new Promise((resolve, reject) => {
        var val = null;
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

        connection.execute(
            "UPDATE `tbl_user` SET `user_fullname` = ?,`user_mobile` = ?,`user_passwd` = ?,`user_age` = ?,`user_gender` = ?,`user_bloodtype` = ?,`user_weight` = ?,`user_address` = ?,`user_city` = ? WHERE `user_id` = ?;",
            [ fullname, mobile, passwd, age, gender, blood, weight, address, city, userid ],
            function(error, result, fields) {
                if(error) reject(error);
                else resolve(true);
            }
        );
    });
};

const updateStatus = (userid, status) => {
    return new Promise((resolve, reject) => {
        var val = null;
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

        connection.execute(
            "UPDATE `tbl_user` SET `user_status` = ? WHERE `user_id` = ?;",
            [ status, userid ],
            function(error, result, fields) {
                if(error) reject(error);
                else resolve(true);
            }
        );
    });
};

const remove = (userid) => {
    return new Promise((resolve, reject) => {
        var val = null;
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

        connection.execute(
            "DELETE FROM `tbl_user` WHERE `user_id` = ?;",
            [ userid ],
            function(error, result, fields) {
                if(error) reject(error);
                else resolve(true);
            }
        );
    });
};

module.exports = {
    get,
    getAll,
    getAllActive,
    getUidFromMobile,
    getUserCount,
    checkLoginCredentials,
    checkDuplicate,
    create,
    update,
    updateStatus,
    remove
}