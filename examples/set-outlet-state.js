var apcPdu = require('../lib/app')
  , config = require('./config');

var pdu = new apcPdu(config);

/**
 * Define the port to turn on
 */
var port = 14;

/**
 * Turn on the port specified above
 */
pdu.setPowerState(port, true, function(err) {
  if(err) {
    console.log(err.toString());
    return;
  }

  console.log('Successfully turned port', port, 'on');
});