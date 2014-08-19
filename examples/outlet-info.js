var apcPdu = require('../lib/app')
  , config = require('./config');

var pdu = new apcPdu(config);

/**
 * Get the total number of outlets
 */
pdu.getTotalOutlets(function(err, count) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('Total outlets:', count);
});

/**
 * Get the name for outlet 1
 */
pdu.getOutletName(1, function(err, name) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('Outlet name for port 1 is:', name);
});

/**
 * Get the names of all the outlets
 */
pdu.getAllOutletNames(function(err, names) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('All outlet names:', names);
});

/**
 * Get the power state of a specific outlet
 */
pdu.getOutletPowerState(1, function(err, state) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('Outlet 1 is currently:', state == '1' ? 'On' : 'Off');
});

/**
 * Get the total PDU power draw
 */
pdu.getPowerDraw(function(err, draw) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('Power draw is currently:', draw, 'amps');
});