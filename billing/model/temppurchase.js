var mongoose = require("mongoose");

var temppurchaseSchema = new mongoose.Schema({
  company_name: String,
  email: String,
  mobile: Number,
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
  add_date: Date,
  delete_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("tempPurchase", temppurchaseSchema);
