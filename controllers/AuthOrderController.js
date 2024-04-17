// controllers/authOrderController.js
const User = require('../models/User');
const Order = require('../models/orderModel');;
class AuthOrderController {
  async signup(req, res) {
    try {
      const { firstName, lastName, email, password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
      const customer_id = generateCustomerId();
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const newUser = new User({ customer_id, firstName, lastName, email, password });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully', customer_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const orders = await Order.aggregate([
        {
          $match: {
            customer_id: user.customer_id
          }
        },
        {
          $project: {
            order_status: 1
          }
        }
      ]);
      if (orders.length === 0) {
        return res.status(200).json({ message: 'Login successful' });
      }
      res.status(200).json({ message: 'Login successful with orders', customer_id: user.customer_id, order_status: orders[0].order_status });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  async createOrder(req, res) {
    try {
      const order = await Order.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          order
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  }
  async getAllOrders(res) {
    try {
      const orders = await Order.find();
      res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
          orders
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  }
  async getOrderStatus(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const order = await Order.findOne({ customer_id: user.customer_id });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json({ order_status: order.order_status });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

function generateCustomerId() {
  const customer_id = 'DNSPCUST' + Math.random(0, 400);
  return customer_id;
}

module.exports = new AuthOrderController();
