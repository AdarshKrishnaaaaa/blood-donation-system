const express = require("express");
const admctl = require('../controllers/admin');
const routerAdm = express.Router();

routerAdm.get('/login', admctl.getAdminLogin);
routerAdm.post('/login', admctl.postAdminLogin);
routerAdm.get('/index', admctl.getAdminIndex);
routerAdm.get('/pending', admctl.getAdminPending);
routerAdm.post('/pending', admctl.postAdminPending);
routerAdm.get('/requests', admctl.getAdminRequests);
routerAdm.get('/bloodlevels', admctl.getAdminBloodLevels);
routerAdm.get('/logout', admctl.logout);

module.exports = routerAdm;