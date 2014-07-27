var apc = require('./lib/apc');

var pdu = new apc.pdu({
  host: '10.0.20.41'
});
/*
pdu.fetchTotalOutlets(function(count) {
  console.log('Total outlets: ', count);
}, function(error) {
  console.log(error.toString());
});

pdu.fetchOutletName(1, function(name) {
  console.log('Outlet name for port 1 is: ', name);
}, function(error) {
  console.log(error.toString());
});

pdu.fetchAllOutletNames(function(names) {
  console.log('All outlet names:', names);
}, function(error) {
  console.log(error.toString());
});

pdu.fetchOutletPowerState(1, function(state) {
  console.log('Outlet 1 is currently: ', state == '1' ? 'On' : 'Off');
}, function(error) {
  console.log(error.toString());
});

pdu.fetchPowerDraw(function(draw) {
  console.log('Power draw is currently: ', draw);
}, function(error) {
  console.log(error.toString());
});
*/
// Use //* to activate this example or /* to disable this example
/*
pdu.setPowerState(1, true, function() {
  console.log('Successfully turned port 1 on');
}, function(error) {
  console.log(error.toString());
});
//*/