var config = require('./config/config');
var logger = require('nlogger').logger(module);
var mailer = require('./utils/mailer');
Tail = require('tail').Tail;

tail = new Tail(config.path);

tail.on("line", function(data) {
  var check_blacklist = true;

  config.whitelist.every(function(keyword) {
    var is_find = false;
    if(data.indexOf(keyword) >= 0) {
      check_blacklist = false;
      is_find = true;
    }
    if (is_find) 
      return false;
    else 
      return true;
  });

  if(check_blacklist) {
    config.blacklist.every(function(keyword) {
      if(data.indexOf(keyword) >= 0) {
        var is_find = false;
        mailer.sendErrorAlert(data, function() {
          logger.info("Send an error alert email to the admin");
          is_find = true;
        });
        if(is_find) 
          return false;
        else 
          return true;
      }
    });
  }
});

tail.on("error", function(err) {
  logger.error(err.message);
});