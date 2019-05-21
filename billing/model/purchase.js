var mongoose = require("mongoose");

var purchaseSchema = new mongoose.Schema({
  company_name: String,
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
  delete_date: String
});

module.exports = mongoose.model("Purchase", purchaseSchema);
