const mysql = require('mysql2');
const dbconfig = require('./dbconfig');

const getDonationCount = (uid) => {
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
            "SELECT COUNT(*) as cnt FROM tbl_donation WHERE user_id=? AND donation_status='Done';", [ uid ],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined') {
                    ret = results[0].cnt;
                }
                else ret = null;
                resolve(ret);
            }
        );
    });
};

const getAll = (uid) => {
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
            "SELECT * FROM tbl_donation NATURAL JOIN tbl_user WHERE user_id=?;", [ uid ],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results);
                }
                else resolve(null);
            }
        );
    });
};

const getAll1 = () => {
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
            "SELECT * FROM tbl_donation NATURAL JOIN tbl_user;", [ ],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results);
                }
                else resolve(null);
            }
        );
    });
};

const getPendingCount = () => {
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
            "SELECT COUNT(*) as cnt FROM tbl_donation NATURAL JOIN tbl_user WHERE donation_status='Pending';", [],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results[0].cnt);
                }
                else resolve(null);
            }
        );
    });
};

const getAcceptedCount = () => {
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
            "SELECT COUNT(*) as cnt FROM tbl_donation NATURAL JOIN tbl_user WHERE donation_status='Verified' OR donation_status='Done';", [],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results[0].cnt);
                }
                else resolve(null);
            }
        );
    });
};

const getAllPending = (uid) => {
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
            "SELECT * FROM tbl_donation NATURAL JOIN tbl_user WHERE donation_status='Pending';", [],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results);
                }
                else resolve(null);
            }
        );
    });
};

const getDonation = (donid) => {
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
            "SELECT * FROM tbl_donation WHERE donation_id=?;", [ donid ],
            function(error, results) {
                if(error) reject(error);
                if(results.length > 0) resolve(results[0]);
                else resolve(null);
            }
        );
    });
};

const checkDuplicate = (user_id, bldtype, units, donsdate) => {
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
            "SELECT COUNT(*) as cnt FROM tbl_donation WHERE user_id=? AND donation_bloodtype=? AND donation_units=? AND donation_scheduled_date=?;", 
            [ user_id, bldtype, units, donsdate ],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    if(results[0].cnt > 0) resolve(true);
                    else resolve(false);
                }
                else resolve(false);
            }
        );
    });
};

const create = (user_id, bldtype, units, dondt, donsdate) => {
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

        connection.execute(
            "INSERT INTO `tbl_donation` (`user_id`,`donation_bloodtype`,`donation_units`,`donation_scheduled_date`) VALUES (?,?,?,?);", 
            [ user_id, bldtype, units, donsdate ],
            function(error, results) {
                if(error) {
                    console.log(error);
                    reject(error);
                }
                else resolve(results.insertId);
            }
        );
    });
};

const updateStatus = (donid, status) => {
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

        connection.execute(
            "UPDATE `tbl_donation` SET `donation_status` = ? WHERE `donation_id` = ?;", 
            [ status, donid ],
            function(error, results) {
                if(error) {
                    console.log(error);
                    reject(error);
                }
                else resolve(results.insertId);
            }
        );
    });
}

module.exports = {
    getAll,
    getAll1,
    getAllPending,
    getPendingCount,
    getDonationCount,
    getAcceptedCount,
    getDonation,
    checkDuplicate,
    create,
    updateStatus
}