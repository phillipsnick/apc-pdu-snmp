# APC PDU SNMP Control

Module for providing basic management of APC PDUs. Such as turning outlets on and off, the current power state and total power draw for the PDU.


## Installation

```
npm install apc-pdu-snmp
```

  
## Usage


Currently the only option which is supported is `host` when creating the object.
 
```javascript
var apcPdu = require('apc-pdu-snmp');

var pdu = new apcPdu({
  host: '', // IP Address/Hostname
  community: 'private' // Optional community
});
```

A full range of examples can be found within the [examples directory](https://github.com/phillipsnick/apc-pdu-snmp/tree/master/examples).


### Method

### getTotalOutlets(callback)
 
Get the total number of outlets on the PDU.

__Arguments__

* `callback(err, totalOutlets)` - Callback function for error/response handling

__Example__

```js
pdu.getTotalOutlets(function(err, totalOutlets) {
  if (err) {
    console.log(err);
    return;
  }
  
  console.log('Total outlets:', totalOutlets);
});
```

---------------------------------------

### getOutletName(outletNumber, callback)
 
Get an outlet name as configured on the PDU.

__Arguments__

* `outletNumber` - Integer of the outlet number to get the name for
* `callback(err, name)` - Callback function for error/response handling

__Example__

Get the name out outlet 1.

```js
pdu.getOutletName(1, function(err, name) {
  if (err) {
    console.log(err);
    return;
  }
  
  console.log('Outlet 1 name:', name);
});
```

---------------------------------------

### getOutletNames(callback)

Get all outlet names as configured on the PDU.

__Arguments__

* `callback(err, names)` - Callback function for error/response handling

__Example__

```js
pdu.getOutletNames(function(err, names) {
  if (err) {
    console.log(err);
    return;
  }
  
  console.log('All outlet names:', names);
});
```

The names variable will contain an object, keys as the outlet number and the value being the outlet name eg.

```
{ 
  '1': 'Outlet 1',
  '2': 'Outlet 2',
  '3': 'Outlet 3'
}
```

---------------------------------------

### getOutletPowerState(outletNumber, callback)
 
Get the power state of an outlet. 

State variable will return either:
  
* 0 - off
* 1 - on

__Arguments__

* `outletNumber` - Integer of the outlet number to get the power state for
* `callback(err, state)` - Callback function for error/response handling

__Example__

Get the power state for outlet 1.

```js
pdu.getOutletPowerState(1, function(err, state) {
  if (err) {
    console.log(err);
    return;
  }
  
  console.log('Outlet 1 is currently:', state == '1' ? 'On' : 'Off');
});
```

---------------------------------------

### getPowerDraw(callback)
 
Get the power draw of the whole PDU in amps.

__Arguments__

* `callback(err, amps)` - Callback function for error/response handling

__Example__

```js
pdu.getPowerDraw(function(err, amps) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Power draw is currently:', draw, 'amps');
});
```

---------------------------------------

### getLowLoadThreshold(callback)

Get the configured low load warning threshold in amps.

__Arguments__

* `callback(err, amps)` - Callback function for error/response handling

__Example__

```js
pdu.getLowLoadThreshold(function(err, amps) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Low warning threshold is', amps, 'amps');
});
```

---------------------------------------

### getNearLoadThreshold(callback)

Get the configured near load warning threshold in amps.

__Arguments__

* `callback(err, amps)` - Callback function for error/response handling

__Example__

```js
pdu.getNearLoadThreshold(function(err, amps) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Near overload warning threshold is,', amps, 'amps');
});
```

---------------------------------------

### getOverloadThreshold(callback)

Get the configured overload alarm threshold in amps.

__Arguments__

* `callback(err, amps)` - Callback function for error/response handling

__Example__

```js
pdu.getOverloadThreshold(function(err, amps) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Overload alarm threshold is', amps, 'amps');
});
```

---------------------------------------

### getLoadState(callback)

Get the current load state.

__Arguments__

* `callback(err, state)` - Callback function for error/response handling. The `state` variable will contain an integer as per the table below.

|State|Translation|
|-----|-----------|
|1|bankLoadNormal|
|2|bankLoadLow|
|3|bankLoadNearOverload|
|4|bankLoadOverload|

The translated key is available within the library using `apcPdu.loadState`, as shown in the example below.

__Example__

```js
pdu.getLoadState(function(err, state) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('The current load state is', apcPdu.loadState[state], '(', state, ')');
});
```

---------------------------------------

### setPowerState(outletNumber, state, callback)

Turn an outlet on/off.

__Arguments__

* `outletNumber` - Outlet as an integer
* `state` - Boolean, true is on, false is off. Alternatively a number, 3 is reboot.
* `callback(err)` - Callback for error/success handling

__Example__

Turn outlet 1 on.

```js
pdu.setPowerState(1, true, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  
  console.log('Successfully turned outlet 1 on');
});
```

The state variable should be a boolean or number. If a boolean, use true to turn an outlet on and false to turn and outlet off. If a number, use a raw sPDUOutletCtl code:

* outletOn: 1
* outletOff: 2
* outletReboot: 3
* outletUnknown: 4
* outletOnWithDelay: 5
* outletOffWithDelay: 6
* outletRebootWithDelay: 7


  
## Notes

Hopefully will have some time in the future to improve the features and add some tests as using the examples for testing is pretty bad :)

All the MIBs have been hard coded into this module, for more details see the PowerNet-MIB ftp://ftp.apc.com/apc/public/software/pnetmib/mib/411/powernet411.mib


## Acknowledgements

Wouldn't have been able to build this without this great article on SNMP for APC PDUs by Joshua Tobin [SNMP Tutorial – APC PDUs](http://tobinsramblings.wordpress.com/2011/05/03/snmp-tutorial-apc-pdus/)


## Contributors

* [@createp](https://github.com/cretep)

## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/apc-pdu-snmp/blob/master/LICENSE)
