const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthOrderController');
router.post('/signup', authController.signup.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/orders', authController.createOrder);
router.get('/orders', authController.getAllOrders);
router.post('/order/status', authController.getOrderStatus);
module.exports = router;