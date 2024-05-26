const dbconfig = require('./dbconfig');
const mysql = require('mysql2/promise');
const ApiResponse = require('./ApiResponse');

const getAdminIDFromLogin = async (login) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT admin_id FROM tbl_admins WHERE admin_login=?;", [ login ]);
        console.log(rows[0].admin_id);
        if(rows.length > 0) {
            resp.code = 0;
            resp.message = 'ok';
            resp.data = rows[0].admin_id;
        }
        else {
            resp.code = 15;
            resp.message = "Admin ID not found!";
            resp.data = null;
        }

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

const checkLoginCredential = async (login, pwd) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT COUNT(*) as cnt FROM tbl_admins WHERE admin_login=? AND admin_passwd=?;", [ login, pwd ]);
        
        if(rows[0].cnt > 0) {
            resp.code = 0;
            resp.message = 'ok';
            resp.data = true;
        }
        else {
            resp.code = 0;
            resp.message = 'ok';
            resp.data = false;
        }

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
    getAdminIDFromLogin,
    checkLoginCredential
};