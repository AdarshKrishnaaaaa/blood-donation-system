const express = require("express");
const apiCtl = require('../controllers/api');
const routerApi = express.Router();

routerApi.post('/cities', apiCtl.getAllCities);
routerApi.post('/user', apiCtl.getUser);
routerApi.post('/doncount', apiCtl.getDonationCount);
routerApi.post('/getds', apiCtl.getDonStat);
routerApi.post('/getdongender', apiCtl.getDonGender);
routerApi.post('/getusercount', apiCtl.getUserCount);
routerApi.post('/getpendingcount', apiCtl.getPendingCount);
routerApi.post('/getacceptedcount', apiCtl.getAcceptedCount);
routerApi.post('/getalluserreqs', apiCtl.getAllUserRequests);
routerApi.post('/getallreqs', apiCtl.getAllRequests);
routerApi.post('/getallpendingreqs', apiCtl.getAllPendingRequests);
routerApi.post('/acceptreq', apiCtl.acceptBloodRequest);
routerApi.post('/rejectreq', apiCtl.rejectBloodRequest);

module.exports = routerApi;