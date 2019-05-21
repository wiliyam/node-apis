var express = require("express");
var mongoose = require("mongoose");
var winston = require("winston"); // for log error

var Purchase = require("../model/purchase"); // customer model
var tempPurchase = require("../model/temppurchase");

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

// POST add Purchase api
module.exports.addPurchaseApi = (req, res) => {
  var receivedValues = req.body;

  if (
    JSON.stringify(receivedValues) === "{}" ||
    receivedValues === undefined ||
    receivedValues === null ||
    req.body.company_name == undefined ||
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
    Purchase.find({
      mobile: req.body.mobile
    }).exec((err, data) => {
      if (data.length) {
        res.json({
          code: 404,
          status: "error",
          message: "Purchase is Already Sign Up with same Mobile number!!!",
          flag: false
        });

        logger.log({
          level: "info",
          data: new Date(),
          message: "Purchase already exist"
        });
      } else {
        var PurchaseData = new Purchase();
        PurchaseData.company_name = req.body.company_name;
        PurchaseData.email = req.body.email;
        PurchaseData.mobile = req.body.mobile;
        PurchaseData.gst = req.body.gst;
        PurchaseData.address = req.body.address;
        PurchaseData.bank = req.body.bank;
        PurchaseData.payment = req.body.payment;

        //save customer data into db
        PurchaseData.save((err, saveData) => {
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
              message: "Purchase Data is Successfully Insert...",
              data: saveData,
              flag: true
            });

            logger.log({
              level: "info",
              data: new Date(),
              message: "Purchase data inserted"
            });
          }
        });
      }
    });
  }
};

//POST update Purchase api
module.exports.updatePurchaseApi = (req, res) => {
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
    Purchase.findOneAndUpdate(
      { _id: receivedValues.id },
      {
        company_name: receivedValues.company_name,
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

// POST Purchase delete api
module.exports.purchaseDeleteApi = (req, res) => {
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
    Purchase.findOneAndDelete({ _id: receivedValues.id }) // delete query
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
          tempPurchase.insertMany(data);
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

//GET Purchase list apu
exports.listPurchaseApi = (req, res) => {
  Purchase.find()
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
          message: "Purchase Data is Successfully Show...",
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
          message: "Purchase Data is not Show!!!",
          flag: false
        });
        logger.log({
          level: "info",
          data: new Date(),
          message: "Purchase Data is not Show!!!"
        });
      }
    });
};

//GET Purchase list one data api
exports.listOnePurchaseApi = (req, res) => {
  var id = req.body.id;
  Purchase.findOne({ _id: id }).exec(function(err, data) {
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
        message: "Purchase Data is Successfully Show...",
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
        message: "Purchase Data is not Show!!!",
        flag: false
      });
      logger.log({
        level: "info",
        data: new Date(),
        message: "Purchase Data is not Show!!!"
      });
    }
  });
};
