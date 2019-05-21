var express = require("express");
var mongoose = require("mongoose");
var winston = require("winston"); // for log error

var Customer = require("../model/customer"); // customer model
var tempCustomer = require("../model/tempcustomer");

// create logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/customerLog.log" })
  ]
});

// create error logger
const error = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/customerError.log" })
  ]
});

// POST add customer api
module.exports.addCompanyApi = (req, res) => {
  var receivedValues = req.body;

  if (
    JSON.stringify(receivedValues) === "{}" ||
    receivedValues === undefined ||
    receivedValues === null ||
    req.body.name == undefined ||
    req.body.email == undefined ||
    req.body.mobile == undefined ||
    req.body.gst == undefined ||
    req.body.address == {} ||
    req.body.bank == {} ||
    req.body.payment == {}
  ) {
    res.json({
      message: "Data Enter is Invalid!!!",
      flag: false
    });

    logger.log({
      level: "info",
      data: new Date(),
      message: "data invalid"
    });
  } else {
    // find for duplicate entry
    Customer.find({
      mobile: req.body.mobile
    }).exec((err, data) => {
      if (data.length) {
        res.json({
          code: 404,
          status: "error",
          message: "User is Already Sign Up with same Mobile number!!!",
          flag: false
        });

        logger.log({
          level: "info",
          data: new Date(),
          message: "user already exist"
        });
      } else {
        var customerData = new Customer();
        customerData.name = req.body.name;
        customerData.email = req.body.email;
        customerData.mobile = req.body.mobile;
        customerData.gst = req.body.gst;
        customerData.address = req.body.address;
        customerData.bank = req.body.bank;
        customerData.payment = req.body.payment;

        //save customer data into db
        customerData.save((err, saveData) => {
          if (err) {
            res.json({
              message: "Data is not Insert!!!",
              flag: false
            });
            error.log({
              level: "info",
              data: new Date(),
              message: err
            });
            logger.log({
              level: "info",
              data: new Date(),
              message: err
            });
          } else {
            res.json({
              message: "customer Data is Successfully Insert...",
              data: saveData,
              flag: true
            });

            logger.log({
              level: "info",
              data: new Date(),
              message: "customer data inserted"
            });
          }
        });
      }
    });
  }
};

//POST update customer api
module.exports.updateCustomerApi = (req, res) => {
  var receivedValues = req.body;

  if (
    JSON.stringify(receivedValues) === "{}" ||
    receivedValues === undefined ||
    receivedValues === null ||
    req.body.id == undefined
  ) {
    res.json({
      status: "error",
      message: "data is Invalid!!!",
      flag: false
    });

    logger.log({
      level: "info",
      data: new Date(),
      message: "data invalid"
    });
  } else {
    // update Query
    Customer.findOneAndUpdate(
      { _id: receivedValues.id },
      {
        name: receivedValues.name,
        email: receivedValues.email,
        mobile: receivedValues.mobile,
        gst: receivedValues.gst,
        address: receivedValues.address,
        bank: receivedValues.bank,
        payment: receivedValues.payment
      }
    ).exec((err, updatedData) => {
      if (err) {
        res.json({
          message: "Data not updated",
          flag: false
        });
        error.log({
          level: "info",
          data: new Date(),
          message: err
        });
        logger.log({
          level: "info",
          data: new Date(),
          message: err
        });
      } else {
        res.json({
          message: "Data is updated",
          data: updatedData,
          flag: true
        });

        logger.log({
          level: "info",
          data: new Date(),
          message: "data is updated"
        });
      }
    });
  }
};

// POST customer delete api
module.exports.customerDeleteApi = (req, res) => {
  var receivedValues = req.body;

  if (
    JSON.stringify(receivedValues) === "{}" ||
    receivedValues === undefined ||
    receivedValues === null ||
    req.body.id == undefined
  ) {
    res.json({
      status: "error",
      message: "is Invalid data!!!",
      flag: false
    });

    logger.log({
      level: "info",
      data: new Date(),
      message: "invalid data"
    });
  } else {
    Customer.findOneAndDelete({ _id: receivedValues.id }) // delete query
      .exec(function(err, data) {
        if (err) {
          res.json({
            message: "Data not deleted",
            flag: false
          });
          error.log({
            level: "info",
            data: new Date(),
            message: err
          });
          logger.log({
            level: "info",
            data: new Date(),
            message: err
          });
        } else {
          tempCustomer.insertMany(data);
          res.json({
            message: "Data deleted.",
            data: data,
            flag: true
          });

          logger.log({
            level: "info",
            data: new Date(),
            message: "data deleted"
          });
        }
      });
  }
};

//GET customer list apu
exports.listCustomerApi = (req, res) => {
  Customer.find()
    .sort({ entrydate: -1 }) // sort data in decending order by entry date
    .exec(function(err, data) {
      if (err) {
        res.json({
          message: "error",
          flag: false
        });
        error.log({
          level: "info",
          data: new Date(),
          message: err
        });
        logger.log({
          level: "info",
          data: new Date(),
          message: err
        });
      }
      if (data.length > 0) {
        res.json({
          message: "Users Data is Successfully Show...",
          data: data,
          flag: true
        });

        logger.log({
          level: "info",
          data: new Date(),
          message: "data show"
        });
      } else {
        res.json({
          message: "customer Data is not Show!!!",
          flag: false
        });
        logger.log({
          level: "info",
          data: new Date(),
          message: "Customer Data is not Show!!!"
        });
      }
    });
};

//GET customer list apu
exports.listOneCustomerApi = (req, res) => {
  var id = req.body.id;
  console.log(id);
  Customer.findOne({ _id: id }).exec(function(err, data) {
    if (err) {
      res.json({
        message: "error",
        flag: false
      });
      error.log({
        level: "info",
        data: new Date(),
        message: err
      });
      logger.log({
        level: "info",
        data: new Date(),
        message: err
      });
    }
    if (data) {
      res.json({
        message: "Users Data is Successfully Show...",
        data: data,
        flag: true
      });

      logger.log({
        level: "info",
        data: new Date(),
        message: "data show"
      });
    } else {
      res.json({
        message: "customer Data is not Show!!!",
        flag: false
      });
      logger.log({
        level: "info",
        data: new Date(),
        message: "Customer Data is not Show!!!"
      });
    }
  });
};
