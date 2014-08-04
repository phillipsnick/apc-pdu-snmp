var apc = require('./lib/apc');

var pdu = new apc.pdu({
  host: '10.0.20.41'
});

pdu.fetchTotalOutlets(function(error, count) {
  if (error) {
    console.log(error.toString());
    return;
  }

  console.log('Total outlets: ', count);
});

pdu.fetchOutletName(1, function(error, name) {
  if (error) {
    console.log(error.toString());
    return;
  }

  console.log('Outlet name for port 1 is: ', name);
});

pdu.fetchAllOutletNames(function(error, names) {
  if (error) {
    console.log(error.toString());
    return;
  }

  console.log('All outlet names:', names);
});

pdu.fetchOutletPowerState(1, function(error, state) {
  if (error) {
    console.log(error.toString());
    return;
  }

  console.log('Outlet 1 is currently: ', state == '1' ? 'On' : 'Off');
});

pdu.fetchPowerDraw(function(error, draw) {
  if (error) {
    console.log(error.toString());
    return;
  }

  console.log('Power draw is currently: ', draw, 'amps');
});

// Use //* to activate this example or /* to disable this example
/*
pdu.setPowerState(1, true, function(error) {
  if (error) {
    console.log(error.toString());
    return;
  }

  console.log('Successfully turned port 1 on');
});
//*/