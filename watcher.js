var config = require('./config/config');
var logger = require('nlogger').logger(module);
var mailer = require('./utils/mailer');
Tail = require('tail').Tail;

tail = new Tail(config.path);

tail.on("line", function(data) {
  var white_regex = new RegExp(config.whitelist.join("|"));
  var black_regex = new RegExp(config.blacklist.join("|"));

  if(!white_regex.test(data)) {
    if(black_regex.test(data)) {
      mailer.sendErrorAlert(data, function() {
        logger.info("Send an error alert email to the admin");
      });
    }
  }
});

tail.on("error", function(err) {
  logger.error(err.message);
});