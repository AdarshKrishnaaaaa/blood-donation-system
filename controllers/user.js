const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../models/user');
const donModel = require('../models/donation');
const dsModel = require('../models/donorstats');
const rqModel = require('../models/requests');
const ApiResponse = require('../models/ApiResponse');

function ValParam(param) {
    if(param === null || param === undefined || param === "")
        return false;
    else return true;
}

function GetCBValue(val) {
    if(typeof val === 'undefined') return false;
    else return true;
}

function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dob.getFullYear();
    if (
        currentDate.getMonth() < dob.getMonth() ||
        (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
        return age - 1;
    }

    return age;
}

const getLogin = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    res.render('user_login', {
        title: 'Nisha - Login',
        resp: JSON.stringify(resp)
    });
};

const postLogin = (req, res) => {
    var resp = new ApiResponse();
    var row = req.body;

    var mobile = row.mobile;
    var passwd = row.passwd;

    if(ValParam(mobile) && ValParam(passwd)) {
        var prm = userModel.checkLoginCredentials(mobile, passwd);
        prm.then(onfulfilled = (value) => {
            if(value) {
                var prm1 = userModel.getUidFromMobile(mobile);
                prm1.then(onfulfilled = (value) => {
                    if(value) {
                        var uid = value;
                        const token = jwt.sign({ userId: uid },
                            process.env.JWT_SECRET_KEY, {
                            expiresIn: "24h"
                        });

                        res.cookie('login_token', token);
                        res.redirect('/user/index');
                    }
                    else {
                        resp.code = 4;
                        resp.message = 'Login failed! User doesnt exist!';
                        resp.data = null;

                        res.render('user_login', {
                            title: 'Nisha - Login',
                            resp: JSON.stringify(resp)
                        });
                    }
                }, onrejected = (err) => {
                    resp.code = 15;
                    resp.message = 'Something went wrong! ' + err.message;
                    resp.data = err.stack;

                    res.render('user_login', {
                        title: 'Nisha - Login',
                        resp: JSON.stringify(resp)
                    });
                });
            }
            else {
                resp.code = 5;
                resp.message = 'Login failed! The credentials provided are wrong!';
                resp.data = null;

                res.render('user_login', {
                    title: 'Nisha - Login',
                    resp: JSON.stringify(resp)
                });
            }
        }, onrejected = (err) => {
            resp.code = 15;
            resp.message = 'Something went wrong! ' + err.message;
            resp.data = err.stack;

            res.render('user_login', {
                title: 'Nisha - Login',
                resp: JSON.stringify(resp)
            });
        });         
    }
    else {
        resp.code = 1;
        resp.message = 'One or more parameters missing. Check the API docs.';
        resp.data = null;

        res.render('user_login', {
            title: 'Nisha - Login',
            resp: JSON.stringify(resp)
        });        
    }
};

const getSignup = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    res.render('user_signup', {
        title: 'Nisha - Sign Up',
        resp: JSON.stringify(resp)
    });
};

const postSignup = (req, res) => {
    var resp = new ApiResponse();
    var row = req.body;

    console.log('Inside postSignup ...');
    console.log(row);

    if(typeof row.submit_add !== 'undefined') {
        console.log('Submit_add ...');
        var fname = row.fname;
        var mobile = row.mobile;
        var pwd = row.passwd;
        var cpwd = row.passwd1;
        var dob = row.dob;
        var gnd = row.gender;
        var blood = row.blood;
        var weight = row.weight;
        var addr = row.address;
        var city = row.city;
        var age = calculateAge(dob);

        if(ValParam(fname) && ValParam(mobile) && ValParam(pwd) && ValParam(cpwd) && ValParam(dob) && ValParam(gnd) && ValParam(blood) && ValParam(weight) && ValParam(addr) && ValParam(city)) {
            console.log('ValParam true');
            var prm = userModel.checkDuplicate(mobile);
            prm.then(onfulfilled = (value) => {
                console.log('checkDuplicate promise resolved ...');
                if(value) {
                    console.log('Duplicate true ...');
                    resp.code = 64;
                    resp.code = "This mobile number is already registered in our system. If this is your mobile number, then login using the mobile number.";
                    resp.data = null;

                    res.render('user_signup', {
                        title: 'Nisha - Sign Up',
                        resp: JSON.stringify(resp)
                    });
                }
                else {
                    console.log('No duplicate found. creating user ...');
                    var prm1 = userModel.create(fname, mobile, pwd, age, gnd, blood, weight, addr, city);
                    prm1.then(onfulfilled = (value) => {
                        console.log('create() promise resolved ...');
                        resp.code = 0;
                        resp.message = "User added successfully! Please login to continue.";
                        resp.data = null;

                        res.render('user_signup', {
                            title: 'Nisha - Sign Up',
                            resp: JSON.stringify(resp)
                        }); 
                    }, onrejected = (err) => {
                        console.log('create() promise rejected ...');
                        resp.code = 15;
                        resp.message = 'An unhandled exception occured! ' + err.message;
                        resp.data = err.stack;

                        res.render('user_signup', {
                            title: 'Nisha - Sign Up',
                            resp: JSON.stringify(resp)
                        });
                    });
                }
            }, onrejected = (err) => {
                resp.code = 15;
                resp.message = 'An unhandled exception occured! ' + err.message;
                resp.data = err.stack;

                res.render('user_signup', {
                    title: 'Nisha - Sign Up',
                    resp: JSON.stringify(resp)
                });
            });
        }
        else {
            resp.code = 1;
            resp.message = 'One or more parameters missing. Check the API docs.';
            resp.data = null;

            res.render('user_signup', {
                title: 'Nisha - Sign Up',
                resp: JSON.stringify(resp)
            });
        }
    }
}

const getUserIndex = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/user/login');
            }
            else {
                var uid = decoded.userId;
                var prm = userModel.get(uid);
                prm.then(onfulfilled = (value) => {
                    resp.data = value;

                    res.render('user_index', {
                        title: 'Nisha - Home',
                        resp: JSON.stringify(resp)
                    });
                }, onrejected = (err) => {
                    resp.code = 15;
                    resp.message = err.message;
                    resp.data = err.stack;

                    res.render('gen_err', {
                        title: 'Nisha - Error',
                        resp: JSON.stringify(resp)
                    });
                });
            }
        });
    }
    else {
        res.redirect('/user/login');
    }
};

const getDonate = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/user/login');
            }
            else {
                var uid = decoded.userId;
                var prm = userModel.get(uid);
                prm.then(onfulfilled = (value) => {
                    res.render('user_donate', {
                        title: 'Nisha - Home',
                        resp: JSON.stringify(resp),
                        user: JSON.stringify(value)
                    });
                }, onrejected = (err) => {
                    resp.code = 15;
                    resp.message = err.message;
                    resp.data = err.stack;

                    res.render('gen_err', {
                        title: 'Nisha - Error',
                        resp: JSON.stringify(resp)
                    });
                });
            }
        });
    }
    else {
        res.redirect('/user/login');
    }
};

const postDonate = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);
    var body = req.body;

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/user/login');
            }
            else {
                var uid = decoded.userId;
                var prm = userModel.get(uid);
                prm.then(onfulfilled = (value) => {
                    var user = value;
                    var numunits = body.numunits;
                    var eat4h = GetCBValue(body.eat4h);
                    var slp6h = GetCBValue(body.slp6h);
                    var fev1w = GetCBValue(body.fev1w);
                    var srg12m = GetCBValue(body.srg12m);
                    var tat1w = GetCBValue(body.tat1w);
                    var ab1w = GetCBValue(body.ab1w);
                    var asp1w = GetCBValue(body.asp1w);
                    var tet1w = GetCBValue(body.tet1w);
                    var aidsprb = GetCBValue(body.aidsprb);
                    var cntmeds = GetCBValue(body.cntmeds);
                    var sbsabs = GetCBValue(body.sbsabs);
                    var jndc1y = GetCBValue(body.jndc1y);
                    var osklm3m = GetCBValue(body.osklm3m);
                    var unhinj = GetCBValue(body.unhinj);
                    var fmmns = GetCBValue(body.fmmns);
                    var fmprgnt = GetCBValue(body.fmprgnt);
                    var fmabrt6m = GetCBValue(body.fmabrt6m);
                    var fmbby1y = GetCBValue(body.fmbby1y);
                    var dondate = body.dondate;
                    var iagree = GetCBValue(body.iagree);

                    console.log(dondate);

                    if(ValParam(numunits) && ValParam(dondate) && iagree === true) {
                        var prm1 = donModel.checkDuplicate(uid, user.user_bloodtype, numunits, dondate);
                        prm1.then(onfulfilled = (value1) => {
                            if(value1) {
                                resp.code = 16;
                                resp.message = "(DUPLICATE ENTRY) A blood donation with exactly same details already entered! Please contact the administrator regarding the status of that donation.";
                                resp.data = null;

                                res.render('user_donate', {
                                    title: 'Nisha - Donate',
                                    resp: JSON.stringify(resp),
                                    user: JSON.stringify(user)
                                });            
                            }
                            else {
                                var prm2 = donModel.create(uid, user.user_bloodtype, numunits, null, dondate);
                                prm2.then(onfulfilled = (value2) => {
                                    var donid = value2;
                                    var prm3 = dsModel.create(donid, eat4h, slp6h, tat1w, ab1w, asp1w, tet1w, aidsprb, cntmeds, sbsabs, jndc1y, osklm3m, unhinj, fmmns, fmprgnt, fmabrt6m, fmbby1y, srg12m);
                                    prm3.then(onfulfilled = (value3) => {
                                        resp.code = 0;
                                        resp.message = "Donation application submitted! Please check back later regarding the status of your donation application.";
                                        resp.data = null;

                                        res.render('user_donate', {
                                            title: 'Nisha - Donate',
                                            resp: JSON.stringify(resp),
                                            user: JSON.stringify(user)
                                        });
                                    }, onrejected = (err3) => {
                                        resp.code = 15; 
                                        resp.message = "Something went wrong! " + err3.message;
                                        resp.data = err3.stack;

                                        res.render('user_donate', {
                                            title: 'Nisha - Donate',
                                            resp: JSON.stringify(resp),
                                            user: JSON.stringify(user)
                                        });
                                    });
                                }, onrejected = (err2) => {
                                    resp.code = 15; 
                                    resp.message = "Something went wrong! " + err2.message;
                                    resp.data = err2.stack;

                                    res.render('user_donate', {
                                        title: 'Nisha - Donate',
                                        resp: JSON.stringify(resp),
                                        user: JSON.stringify(user)
                                    });
                                });
                            }
                        }, onrejected = (err1) => {
                            resp.code = 15; 
                            resp.message = "Something went wrong! " + err1.message;
                            resp.data = err1.stack;

                            res.render('user_donate', {
                                title: 'Nisha - Donate',
                                resp: JSON.stringify(resp),
                                user: JSON.stringify(user)
                            });
                        });
                    }
                    else {
                        resp.code = 1; 
                        resp.message = "One or more parameters missing for this API call. Check API docs.";
                        resp.data = null;

                        res.render('user_donate', {
                            title: 'Nisha - Donate',
                            resp: JSON.stringify(resp),
                            user: JSON.stringify(user)
                        });
                    }
                }, onrejected = (err) => {
                    resp.code = 15;
                    resp.message = err.message;
                    resp.data = err.stack;

                    res.render('gen_err', {
                        title: 'Nisha - Error',
                        resp: JSON.stringify(resp)
                    });
                });
            }
        });
    }
    else {
        res.redirect('/user/login');
    }
};

const getDonations = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/user/login');
            }
            else {
                var uid = decoded.userId;
                var prm = userModel.get(uid);
                prm.then(onfulfilled = (value) => {
                    var user = value;
                    var prm1 = donModel.getAll(uid);
                    prm1.then(onfulfilled = (value1) => {
                        console.log(JSON.stringify(value1));
                        res.render('user_donations', {
                            title: 'Nisha - Home',
                            resp: JSON.stringify(resp),
                            user: JSON.stringify(user),
                            donations: JSON.stringify(value1)
                        });
                    }, onrejected = (err1) => {
                        resp.code = 15;
                        resp.message = err.message;
                        resp.data = err.stack;

                        res.render('gen_err', {
                            title: 'Nisha - Error',
                            resp: JSON.stringify(resp)
                        });
                    });        
                }, onrejected = (err) => {
                    resp.code = 15;
                    resp.message = err.message;
                    resp.data = err.stack;

                    res.render('gen_err', {
                        title: 'Nisha - Error',
                        resp: JSON.stringify(resp)
                    });
                });
            }
        });
    }
    else {
        res.redirect('/user/login');
    }
}

const getUserRequests = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/user/login');
            }
            else {
                var uid = decoded.userId;
                if(ValParam(uid)) {
                    res.render('user_requests', {
                        title: 'Nisha - Home',
                        resp: JSON.stringify(resp)
                    });
                }
                else {
                    res.redirect('/user/login');
                }
            }
        });
    }
    else {
        res.redirect('/user/login');
    }
};

const postUserRequests = (req, res) => {
    var resp = new ApiResponse(0, 'get', null);
    var form = req.body;
    console.log(form);

    if(!(typeof req.cookies.login_token === 'undefined')) {
        jwt.verify(req.cookies.login_token, process.env.JWT_SECRET_KEY, function(err, decoded) {
            if(err) {                
                res.redirect('/user/login');
            }
            else {
                var uid = decoded.userId;
                if(ValParam(uid)) {
                    if(typeof form.submit_add !== 'undefined') {
                        if(ValParam(form.desc) && ValParam(form.units) && ValParam(form.blood)) {
                            var prm = rqModel.create(uid, form.desc, form.blood, form.units);
                            prm.then(onfulfilled = (r) => {
                                res.render('user_requests', {
                                    title: 'Nisha - Home',
                                    resp: JSON.stringify(r)
                                });
                            });
                        }
                        else {
                            resp.code = 1;
                            resp.message = "One or more parameters missing or invalid.";
                            resp.data = null;

                            res.render('user_requests', {
                                title: 'Nisha - Home',
                                resp: JSON.stringify(resp)
                            });
                        }
                    }
                }
                else {
                    res.redirect('/user/login');
                }
            }
        });
    }
    else {
        res.redirect('/user/login');
    }
};

const logout = (req, res) => {
    res.clearCookie('login_token');
    res.redirect('/user/login');
};

module.exports = {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    getUserIndex,
    getDonate,
    postDonate,
    getDonations,
    getUserRequests,
    postUserRequests,
    logout
};