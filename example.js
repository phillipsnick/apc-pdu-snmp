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

pdu.fetchLowLoadThreshold(function(error, threshold) {
  if (error) {
    console.log(error.toString());
  }

  console.log('Low load warning threshold is: ', threshold, 'amps');
});

pdu.fetchNearLoadThreshold(function(error, threshold) {
  if (error) {
    console.log(error.toString());
  }

  console.log('Near load warning threshold is: ', threshold, 'amps');
});

pdu.fetchOverLoadThreshold(function(error, threshold) {
  if (error) {
    console.log(error.toString());
  }

  console.log('Over load alarm threshold is: ', threshold, 'amps');
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