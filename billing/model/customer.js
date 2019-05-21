var mongoose = require("mongoose");

var customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: Number,
  gst: String,
  address: {
    city: Number,
    state: Number,
    country: Number
  },
  bank: {
    acname: String,
    acno: Number,
    ifsc: String,
    bank_add: String,
    panno: String
  },
  payment: {
    total_pending: Number,
    total_payment: Number,
    total_advance_payment: Number,
    total_sales: Number
  },
  add_date: { type: Date, default: Date.now },
  delete_date: Date
});

module.exports = mongoose.model("Customer", customerSchema);
