const mysql = require('mysql2');
const dbconfig = require('./dbconfig');

function Bool2Int(param) {
    if(param) return 1;
    else return 0;
}

function Int2Bool(param) {
    if(param === 1) return true;
    else return false;
}

const get = (dsid) => {
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
            "SELECT * FROM tbl_donor_stat WHERE donor_stat_id=?;", [ dsid ],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results[0]);
                }
                else resolve(false);
            }
        );
    });
};

const getFromDonID = (donid) => {
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
            "SELECT * FROM tbl_donor_stat WHERE donation_id=?;", [ donid ],
            function(error, results) {
                if(error) reject(error);
                if(typeof results !== 'undefined' && results.length > 0) {
                    resolve(results[0]);
                }
                else resolve(false);
            }
        );
    });
};

const create = (donid, eat4h, slp6h, tat1w, ab1w, asp1w, tt1w, aidsprb, cntmeds, sbsabs, jndc1y, oskl3m, uhinj, mnsact, prgnt, abrt6m, bby1y, srg12m) => {
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

        eat4h = Bool2Int(eat4h);
        slp6h = Bool2Int(slp6h);
        tat1w = Bool2Int(tat1w);
        ab1w = Bool2Int(ab1w);
        asp1w = Bool2Int(asp1w);
        tt1w = Bool2Int(tt1w);
        aidsprb = Bool2Int(aidsprb);
        cntmeds = Bool2Int(cntmeds);
        sbsabs = Bool2Int(sbsabs);
        jndc1y = Bool2Int(jndc1y);
        oskl3m = Bool2Int(oskl3m);
        uhinj = Bool2Int(uhinj);
        mnsact = Bool2Int(mnsact);
        prgnt = Bool2Int(prgnt);
        abrt6m = Bool2Int(abrt6m);
        bby1y = Bool2Int(bby1y);
        srg12m = Bool2Int(srg12m);

        connection.execute(
            "INSERT INTO `tbl_donor_stat` (`donation_id`,`donor_stat_eat4h`,`donor_stat_slp6h`,`donor_stat_tat1w`,`donor_stat_anb1w`,`donor_stat_asp1w`,`donor_stat_tt1w`,`donor_stat_aidsprb`,`donor_stat_cntmeds`,`donor_stat_sbsabuse`,`donor_stat_jndc1y`,`donor_stat_oskl3m`,`donor_stat_uhinj`,`donor_stat_mnsactive`,`donor_stat_prgnt`,`donor_stat_abrt6m`,`donor_stat_bby1y`,`donor_stat_srg12m`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);", 
            [ donid, eat4h, slp6h, tat1w, ab1w, asp1w, tt1w, aidsprb, cntmeds, sbsabs, jndc1y, oskl3m, uhinj, mnsact, prgnt, abrt6m, bby1y, srg12m ],
            function(error, results) {
                if(error) {
                    console.log(error);
                    reject(error);
                }
                else resolve(true);
            }
        );
    });
};

module.exports = {
    get,
    getFromDonID,
    create
}