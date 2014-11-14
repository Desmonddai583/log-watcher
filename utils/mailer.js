var fs = require('fs');
var jade = require('jade');
var logger = require('nlogger').logger(module);
var config = require('../config/config');
var mailgun = require('mailgun-js')({apiKey: "key-e2a50d6091c24a46f1a5d047ceebbae5", domain: "sandbox6cee921710e44a21ae485a9555b7229a.mailgun.org"});

var mailer = exports;

mailer.sendErrorAlert = function(message, callback) {
  fs.readFile('templates/emails/send-error-alert.jade', 'utf8', function (err, data) {
    if (err) {
      logger.error(err);
      callback(err);
    }

    var fn = jade.compile(data);
    var html = fn({message: message});

    var data = {
      from: 'desmonddai583@gmail.com',
      to: config.email,
      subject: 'Error Alert',
      html: html
    };

    mailer.sendEmail(data, callback);
  });
}

mailer.sendEmail = function(data, callback) {
  mailgun.messages().send(data, function(err, body) {
    if (err) {
      logger.error(err);
      callback(err);
    }
    callback(null);
  });
}