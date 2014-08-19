# APC PDU SNMP Control

Module for providing basic management of APC PDUs. Such as turning outlets on and off, the current power state and total power draw for the PDU.


## Installation

```
npm install apc-pdu-snmp --save
```

  
## Usage


Currently the only option which is supported is `host` when creating the object.
 
```javascript
var apcPdu = require('apc-pdu-snmp');

var pdu = new apcPdu({
  host: 'IP Address/Hostname'
});
```

A full range of examples can be found within the [examples directory](https://github.com/phillipsnick/apc-pdu-snmp/tree/master/examples).


## Methods

### getTotalOutlets - Get the total number of outlets

```javascript
pdu.getTotalOutlets(function(err, totalOutlets) {});
```


### getOutletName - Get an outlet name

```javascript
pdu.getOutletName(outletNumber, function(err, name) {});
```


### getOutletNames - Get all outlet names

```javascript
pdu.getOutletNames(function(err, names) {});
```

The names variable will contain an object, keys as the outlet number and the value being the outlet name eg.

```
{ 
  '1': 'Outlet 1',
  '2': 'Outlet 2',
  '3': 'Outlet 3'
}
```


### getOutletPowerState - Get the power state of an outlet

```javascript
pdu.getOutletPowerState(function(err, state) {});
```

The state variable will be 1 (on) or 0 (off).


### getPowerDraw - Get the power draw of the whole PDU in amps

```javascript
pdu.getPowerDraw(function(err, amps) {});
```


### setPowerState - Turn an outlet on/off

```javascript
pdu.setPowerState(outlet, state, function(err) {});
```

The state variable should be true to turn an outlet on and false to turn and outlet off.

  
## Notes

Hopefully will have some time in the future to improve the features and add some tests as using the examples for testing is pretty bad :)

All the MIBs have been hard coded into this module, for more details see the PowerNet-MIB ftp://ftp.apc.com/apc/public/software/pnetmib/mib/411/powernet411.mib


## Acknowledgements

Wouldn't have been able to build this without this great article on SNMP for APC PDUs by Joshua Tobin [SNMP Tutorial – APC PDUs](http://tobinsramblings.wordpress.com/2011/05/03/snmp-tutorial-apc-pdus/)


## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/apc-pdu-snmp/blob/master/LICENSE)
