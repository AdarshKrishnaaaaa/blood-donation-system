const mysql = require('mysql2/promise');
const dbconfig = require('./dbconfig');
const ApiResponse = require('./ApiResponse');

const getDonationCount = async (uid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT COUNT(*) as cnt FROM tbl_donation WHERE user_id=? AND donation_status='Done';", [ uid ]);
        resp.code = 0;
        resp.message = 'ok';
        resp.data = rows[0].cnt;

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

const getAll = async (uid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_donation NATURAL JOIN tbl_user WHERE user_id=?;", [ uid ]);
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

const getPendingCount = async () => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT COUNT(*) as cnt FROM tbl_donation NATURAL JOIN tbl_user WHERE donation_status='Pending';");
        resp.code = 0;
        resp.message = 'ok';
        resp.data = rows[0].cnt;

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

const getAcceptedCount = async () => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT COUNT(*) as cnt FROM tbl_donation NATURAL JOIN tbl_user WHERE donation_status='Verified' OR donation_status='Done';");
        resp.code = 0;
        resp.message = 'ok';
        resp.data = rows[0].cnt;

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

        const [rows, fields] = await connection.query("SELECT * FROM tbl_donation NATURAL JOIN tbl_user WHERE donation_status='Pending';");
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

const getDonation = async (donid) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT * FROM tbl_donation WHERE donation_id=?;", [ donid ]);
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

const checkDuplicate = async (user_id, bldtype, units, donsdate) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        const [rows, fields] = await connection.query("SELECT COUNT(*) as cnt FROM tbl_donation WHERE user_id=? AND donation_bloodtype=? AND donation_units=? AND donation_scheduled_date=?;", [ user_id, bldtype, units, donsdate ]);
        
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

const create = async (user_id, bldtype, units, dondt, donsdate) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("INSERT INTO `tbl_donation` (`user_id`,`donation_bloodtype`,`donation_units`,`donation_scheduled_date`) VALUES (?,?,?,?);",[ user_id, bldtype, units, donsdate ]);
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

const updateStatus = async (donid, status) => {
    var resp = new ApiResponse();
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        await connection.execute("UPDATE `tbl_donation` SET `donation_status` = ? WHERE `donation_id` = ?;", [ status, donid ]);
        
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
}

module.exports = {
    getAll,
    getAllPending,
    getPendingCount,
    getDonationCount,
    getAcceptedCount,
    getDonation,
    checkDuplicate,
    create,
    updateStatus
}