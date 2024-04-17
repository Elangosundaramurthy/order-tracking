const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true 
  },
});
module.exports = mongoose.model('Order', orderSchema);