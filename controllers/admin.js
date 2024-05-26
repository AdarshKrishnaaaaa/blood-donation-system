const jwt = require('jsonwebtoken');
require('dotenv').config();

const admModel = require('../models/admins');
const userModel = require('../models/user');
const donModel = require('../models/donation');
const don1Model = require('../models/donation1');
const dsModel = require('../models/donorstats');
const bqModel = require('../models/bquant');
const ApiResponse = require('../models/ApiResponse');

function ValParam(param) {
    if(param === null || param === undefined || param === "")
        return false;
    else return true;
}

const getAdminLogin = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);
    res.render('admin_login', {
        resp: JSON.stringify(resp)
    });
};

const postAdminLogin = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(typeof form.submit_login !== 'undefined') {
        if(ValParam(form.login) && ValParam(form.passwd)) {
            var prm = admModel.checkLoginCredential(form.login, form.passwd);
            prm.then(onfulfilled = (r) => {
                if(r.code === 0) {
                    if(r.data === true) {
                        var prm1 = admModel.getAdminIDFromLogin(form.login);
                        prm1.then(onfulfilled = (r1) => {
                            if(r1.code === 0) {
                                var uid = r1.data;
                                const token = jwt.sign({ admId: uid },
                                    process.env.JWT_SECRET_KEY, {
                                    expiresIn: "24h"
                                });

                                res.cookie('login_token', token);
                                res.redirect('/admin/index');
                            }
                            else {
                                res.render('admin_login', {
                                    resp: JSON.stringify(r1)
                                });
                            }
                        });
                    }
                    else {
                        resp.code = 120;
                        resp.message = "Login Failed! Check you login credentials.";
                        resp.data = null;

                        res.render('admin_login', {
                            resp: JSON.stringify(resp)
                        });
                    }
                }
                else {
                    res.render('admin_login', {
                        resp: JSON.stringify(r)
                    });
                }
            });
        }
        else {
            resp.code = 1;
            resp.message = 'One or more parameters missing. Check the API docs.';
            resp.data = null;

            res.render('user_login', {
                resp: JSON.stringify(resp)
            });
        }
    }
};

const getAdminIndex = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                var uid = decoded.admId;
                if(ValParam(uid)) {
                    res.render('admin_index', {
                        resp: JSON.stringify(resp)
                    });
                }
                else {
                    res.redirect('/admin/login');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const getAdminPending = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                var uid = decoded.admId;
                if(ValParam(uid)) {
                    var prm = donModel.getAll1();
                    prm.then(onfulfilled = (value) => {
                        res.render('admin_pending', {
                            pendings: JSON.stringify(value),
                            resp: JSON.stringify(resp)
                        });
                    }, onrejected = (err) => {
                        resp.code = 15;
                        resp.message = "Something went wrong! " + err.message;
                        resp.data = err.stack;

                        res.render('admin_pending', {
                            resp: JSON.stringify(resp)
                        });
                    });
                }
                else {
                    res.redirect('/admin/login');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const postAdminPending = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);
    var form = req.body;

    console.log(form);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                var uid = decoded.admId;
                if(ValParam(uid)) {
                    var prm = donModel.getAllPending();
                    prm.then(onfulfilled = (value) => {
                        if(typeof form.submit_approve !== 'undefined') {
                            console.log(1);
                            if(ValParam(form.donid)) {
                                console.log(2);
                                var prm = don1Model.getDonation(form.donid);
                                prm.then(onfulfilled = (r) => {
                                    console.log(r);
                                    if(r.code === 0) {
                                        console.log(3);
                                        var donation = r.data;
                                        donModel.updateStatus(form.donid, 'Verified');
                                        bqModel.increment(donation.donation_bloodtype, donation.donation_units);
                                        
                                        res.render('admin_pending', {
                                            pendings: JSON.stringify(value),
                                            resp: JSON.stringify(resp)
                                        });
                                    }
                                    else {
                                        res.render('admin_pending', {
                                            pendings: JSON.stringify(value),
                                            resp: JSON.stringify(r)
                                        });
                                    }
                                });
                            }
                            else {
                                console.log(-2);
                                resp.code = 1;
                                resp.message = "One or more parameters missing or invalid.";
                                resp.data =null;

                                res.render('admin_pending', {
                                    pendings: JSON.stringify(value),
                                    resp: JSON.stringify(resp)
                                });
                            }
                        }
                        else if(typeof form.submit_reject !== 'undefined') {
                            if(ValParam(form.donid)) {
                                var prm = donModel.getDonation(form.donid);
                                prm.then(onfulfilled = (r) => {
                                    if(r.code === 0) {
                                        var donation = r.data;
                                        // donModel.updateStatus(form.donid, 'Verified');
                                        // bqModel.increment(donation.donation_bloodtype, donation.donation_units);
                                        
                                        res.render('admin_pending', {
                                            pendings: JSON.stringify(value),
                                            resp: JSON.stringify(resp)
                                        });
                                    }
                                    else {
                                        res.render('admin_pending', {
                                            pendings: JSON.stringify(value),
                                            resp: JSON.stringify(r)
                                        });
                                    }
                                });
                            }
                            else {
                                resp.code = 1;
                                resp.message = "One or more parameters missing or invalid.";
                                resp.data =null;
                                res.render('admin_pending', {
                                    pendings: JSON.stringify(value),
                                    resp: JSON.stringify(resp)
                                });
                            }
                        }
                    }, onrejected = (err) => {
                        resp.code = 15;
                        resp.message = "Something went wrong! " + err.message;
                        resp.data = err.stack;

                        res.render('admin_pending', {
                            resp: JSON.stringify(resp)
                        });
                    });
                }
                else {
                    res.redirect('/admin/login');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const getAdminRequests = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                var uid = decoded.admId;
                if(ValParam(uid)) {
                    res.render('admin_requests', {
                        resp: JSON.stringify(resp)
                    });
                }
                else {
                    res.redirect('/admin/login');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const getAdminBloodLevels = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/admin/login');
            }
            else {
                var uid = decoded.admId;
                if(ValParam(uid)) {
                    var prm = bqModel.getAll();
                    prm.then(onfulfilled = (r) => {
                        if(r.code === 0) {
                            res.render('admin_bloodlevels', {
                                resp: JSON.stringify(resp),
                                bdata : JSON.stringify(r.data)
                            });
                        }
                        else {
                            res.render('admin_bloodlevels', {
                                resp: JSON.stringify(r)
                            });
                        }
                    });
                }
                else {
                    res.redirect('/admin/login');
                }
            }
        });
    }
    else {
        res.redirect('/admin/login');
    }
};

const logout = (req, res) => {
    res.clearCookie('login_token');
    res.redirect('/admin/login');
};

module.exports = {
    getAdminLogin,
    postAdminLogin,
    getAdminIndex,
    getAdminPending,
    postAdminPending,
    getAdminRequests,
    getAdminBloodLevels,
    logout
}