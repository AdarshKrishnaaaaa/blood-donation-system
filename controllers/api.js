const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../models/user');
const ApiResponse = require('../models/ApiResponse');
const citiesModel = require('../models/cities');
const rqModel = require('../models/requests');
const donateModel = require('../models/donation');
const dsModel = require('../models/donorstats');
const bqModel = require('../models/bquant');

function ValParam(param) {
    if(param === null || param === undefined || param === "")
        return false;
    else return true;
}

const getAllCities = (req, res) => {
    var resp = new ApiResponse();
    var prm = citiesModel.getAll();

    prm.then(onfulfilled = (value) => {
        resp.code = 0;
        resp.message = 'ok';
        resp.data = value;

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(resp));
    }, onrejected = (err) => {
        resp.code = 15;
        resp.message = 'An unhandled exception occured! ' + err.message;
        resp.data = err.stack;

        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    });
};

const getUser = (req, res) => {
    var resp = new ApiResponse();
    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId;
                var prm = userModel.get(uid);
                prm.then(onfulfilled = (value) => {
                    resp.data = value;
                    resp.code = 0;
                    resp.message = "ok";
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }, onrejected = (err) => {
                    resp.code = 15;
                    resp.message = err.message;
                    resp.data = err.stack;

                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                });
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getDonationCount = (req, res) => {
    var resp = new ApiResponse();
    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId;
                var prm = donateModel.getDonationCount(uid);
                prm.then(onfulfilled = (value) => {
                    resp.data = value;
                    resp.code = 0;
                    resp.message = "ok";
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }, onrejected = (err) => {
                    resp.code = 15;
                    resp.message = err.message;
                    resp.data = err.stack;

                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                });
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getDonStat = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;
    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId || decoded.admId;
                var donid = form.donid;

                if(ValParam(uid) && ValParam(donid)) {
                    var prm = dsModel.getFromDonID(donid);
                    prm.then(onfulfilled = (value) => {
                        resp.code = 0;
                        resp.message = 'ok';
                        resp.data = value;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    }, onrejected = (err) => {
                        resp.code = 15;
                        resp.message = err.message;
                        resp.data = err.stack;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = "One or more parameters are missing for this API call. Check the documentations.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getDonGender = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;
    
    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId || decoded.admId;
                var donid = form.donid;

                if(ValParam(uid) && ValParam(donid)) {
                    var prm = donateModel.getDonation(donid);
                    prm.then(onfulfilled = (value) => {
                        var donuser = value.user_id;
                        var prm1 = userModel.get(donuser);
                        prm1.then(onfulfilled = (value1) => {
                            resp.code = 0;
                            resp.message = 'ok';
                            resp.data = value1.user_gender;

                            res.setHeader('Content-Type', 'application/json');
                            res.send(resp);
                        }, onrejected = (err1) => {
                            resp.code = 15;
                            resp.message = err1.message;
                            resp.data = err1.stack;

                            res.setHeader('Content-Type', 'application/json');
                            res.send(resp);
                        });
                    }, onrejected = (err) => {
                        resp.code = 15;
                        resp.message = err.message;
                        resp.data = err.stack;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = "One or more parameters are missing for this API call. Check the documentations.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getUserCount = (req, res) => {
    var resp = new ApiResponse();
    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId || decoded.admId;

                if(ValParam(uid)) {
                    var prm = userModel.getUserCount();
                    prm.then(onfulfilled = (value) => {
                        resp.code = 0;
                        resp.message = 'ok';
                        resp.data = value;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);    
                    }, onrejected = (error) => {
                        resp.code = 15;
                        resp.message = error.message;
                        resp.data = error.stack;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = "One or more parameters are missing for this API call. Check the documentations.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getPendingCount = (req, res) => {
    var resp = new ApiResponse();
    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId || decoded.admId;

                if(ValParam(uid)) {
                    var prm = donateModel.getPendingCount();
                    prm.then(onfulfilled = (value) => {
                        resp.code = 0;
                        resp.message = 'ok';
                        resp.data = value;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);    
                    }, onrejected = (error) => {
                        resp.code = 15;
                        resp.message = error.message;
                        resp.data = error.stack;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = "One or more parameters are missing for this API call. Check the documentations.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getAcceptedCount = (req, res) => {
    var resp = new ApiResponse();
    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId || decoded.admId;

                if(ValParam(uid)) {
                    var prm = donateModel.getAcceptedCount();
                    prm.then(onfulfilled = (value) => {
                        resp.code = 0;
                        resp.message = 'ok';
                        resp.data = value;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);    
                    }, onrejected = (error) => {
                        resp.code = 15;
                        resp.message = error.message;
                        resp.data = error.stack;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = "One or more parameters are missing for this API call. Check the documentations.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getAllUserRequests = (req, res) => {
    var resp = new ApiResponse();
    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId || decoded.admId;

                if(ValParam(uid)) {
                    var prm = rqModel.getAllForUser(uid);
                    prm.then(onfulfilled = (r) => {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(r);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = "One or more parameters are missing for this API call. Check the documentations.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getAllRequests = (req, res) => {
    var resp = new ApiResponse();
    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.userId || decoded.admId;

                if(ValParam(uid)) {
                    var prm = rqModel.getAll();
                    prm.then(onfulfilled = (r) => {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(r);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = "One or more parameters are missing for this API call. Check the documentations.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const getAllPendingRequests = (req, res) => {
    var resp = new ApiResponse();
    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.admId;

                if(ValParam(uid)) {
                    var prm = rqModel.getAllPending();
                    prm.then(onfulfilled = (r) => {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(r);
                    });
                }
                else {
                    resp.code = 1;
                    resp.message = "One or more parameters are missing for this API call. Check the documentations.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const acceptBloodRequest = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.admId;

                if(ValParam(uid)) {
                    if(ValParam(form.reqid)) {
                        var prm = rqModel.get(form.reqid);
                        prm.then(onfulfilled = (r) => {
                            if(r.code === 0) {
                                var req = r.data;
                                var prm1 = bqModel.isAvailable(req.request_bloodtype, req.request_units);
                                prm1.then(onfulfilled = (r1) => {
                                    if(r1.code === 0) {
                                        if(r1.data === true) {
                                            var prm2 = bqModel.decrement(req.request_bloodtype, req.request_units);
                                            prm2.then(onfulfilled = (r2) => {
                                                rqModel.updateStatus(form.reqid, 'Fulfilled');
                                                res.setHeader('Content-Type', 'application/json');
                                                res.send(r2);
                                            });
                                        }
                                        else {
                                            resp.code = 17;
                                            resp.message = "Insufficient blood available for this request.";
                                            resp.data = null;

                                            res.setHeader('Content-Type', 'application/json');
                                            res.send(resp);
                                        }
                                    }
                                    else {
                                        res.setHeader('Content-Type', 'application/json');
                                        res.send(r1);
                                    }
                                });
                            }
                            else {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(r);
                            }
                        });
                    }
                    else {
                        resp.code = 0;
                        resp.message = "One or more parameters missing or invalid.";
                        resp.data = null;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    }
                }
                else {
                    resp.code = 1;
                    resp.message = "One or more parameters are missing for this API call. Check the documentations.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

const rejectBloodRequest = (req, res) => {
    var resp = new ApiResponse();
    var form = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                resp.code = 14;
                resp.message = "API not available without login session.";
                resp.data = null;
                
                res.setHeader('Content-Type', 'application/json');
                res.send(resp);
            }
            else {
                var uid = decoded.admId;

                if(ValParam(uid)) {
                    if(ValParam(form.reqid)) {
                        var prm = rqModel.updateStatus(form.reqid, 'Rejected');
                        prm.then(onfulfilled = (r) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(r);
                        });
                    }
                    else {
                        resp.code = 0;
                        resp.message = "One or more parameters missing or invalid.";
                        resp.data = null;

                        res.setHeader('Content-Type', 'application/json');
                        res.send(resp);
                    }
                }
                else {
                    resp.code = 1;
                    resp.message = "One or more parameters are missing for this API call. Check the documentations.";
                    resp.data = null;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.send(resp);
                }
            }
        });
    }
    else {
        resp.code = 14;
        resp.message = "API not available without login session.";
        resp.data = null;
        
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
};

module.exports = {
    getAllCities,
    getUser,
    getDonationCount,
    getPendingCount,
    getAcceptedCount,
    getDonStat,
    getDonGender,
    getUserCount,
    getAllUserRequests,
    getAllRequests,
    getAllPendingRequests,
    acceptBloodRequest,
    rejectBloodRequest
}
