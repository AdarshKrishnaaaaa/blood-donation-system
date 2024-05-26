const express = require("express");
const userController = require('../controllers/user');
const routerUser = express.Router();

routerUser.get('/login', userController.getLogin);
routerUser.post('/login', userController.postLogin);
routerUser.get('/signup', userController.getSignup);
routerUser.post('/signup', userController.postSignup);
routerUser.get('/index', userController.getUserIndex);
routerUser.get('/donate', userController.getDonate);
routerUser.post('/donate', userController.postDonate);
routerUser.get('/donations', userController.getDonations);
routerUser.get('/requests', userController.getUserRequests);
routerUser.post('/requests', userController.postUserRequests);
routerUser.get('/logout', userController.logout);

module.exports = routerUser;