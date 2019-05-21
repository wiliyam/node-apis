var customer = require("../controller/customer");
var purchase = require("../controller/purchase");
var mongoose = require("mongoose");

module.exports = function(app) {
  // customers api
  app.post("/addCustomer", customer.addCompanyApi);
  app.post("/updateCustomer", customer.updateCustomerApi);
  app.post("/deleteCustomer", customer.customerDeleteApi);
  app.get("/listCustomers", customer.listCustomerApi);
  app.post("/listOneCustomers", customer.listOneCustomerApi);

  //Purchase api
  app.post("/addPurchase", purchase.addPurchaseApi);
  app.post("/updatePurchase", purchase.updatePurchaseApi);
  app.post("/deletePurchase", purchase.purchaseDeleteApi);
  app.get("/listPurchase", purchase.listPurchaseApi);
  app.post("/listOnePurchase", purchase.listOnePurchaseApi);

  app.post("/", (req, res) => {
    //mongoose.connection.close();
    var year = parseInt(req.body.selectedyear, 10);
    mongoose.connect(`mongodb://localhost/${year}`, { useNewUrlParser: true });

    var db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function() {
      console.log("connected to database");
    });
    res.redirect("/addCompany");
  });
};
