const mysql = require('mysql2/promise');
const dbconfig = require('./dbconfig');
const ApiResponse = require('./ApiResponse');


const getAll = async () => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_requests NATURAL JOIN tbl_user;");
        resp.code = 0;
        resp.message = 'ok';
        resp.data = rows;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};


const getAllForUser = async (uid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_requests NATURAL JOIN tbl_user WHERE user_id=?;", [uid]);
        resp.code = 0;
        resp.message = 'ok';
        resp.data = rows;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

const getAllPending = async (uid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_requests NATURAL JOIN tbl_user WHERE request_status='Pending';");
        resp.code = 0;
        resp.message = 'ok';
        resp.data = rows;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

const get = async (reqid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_requests NATURAL JOIN tbl_user WHERE request_id=?;", [ reqid ]);
        resp.code = 0;
        resp.message = 'ok';
        resp.data = rows[0] || null;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

const create = async (user_id, desc, bldtype, units) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("INSERT INTO `tbl_requests` (`user_id`,`request_desc`,`request_bloodtype`,`request_units`) VALUES (?,?,?,?);", [ user_id, desc, bldtype, units ]);
        const [rows, fields] = await connection.query("SELECT LAST_INSERT_ID() as lid;");
        
        resp.code = 0;
        resp.message = 'ok';
        resp.data = rows[0].lid || null;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

const updateStatus = async (reqid, status) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("UPDATE `tbl_requests` SET `request_status` = ? WHERE `request_id` = ?;", [ status, reqid ]);
        
        resp.code = 0;
        resp.message = 'ok';
        resp.data = null;

        await connection.end();
        return resp;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        resp.code = 15;
        resp.message = error.message;
        resp.data = error.stack;

        return resp;
    }
};

module.exports = {
    getAll,
    getAllPending,
    getAllForUser,
    get,
    create,
    updateStatus
};