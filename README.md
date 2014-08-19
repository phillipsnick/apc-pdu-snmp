# APC PDU SNMP Control

Very basic module providing basic management of APC PDUs. Such as turning outlets on and off, the current power state and total power draw for the PDU.


## Installation

```
npm install apc-pdu-snmp --save
```

  
## Usage

See [examples.js](https://github.com/phillipsnick/apc-pdu-snmp/blob/master/example.js) for a full breakdown of available methods.

Currently the only option which is supported is `host` when creating the object.
 
```javascript
var apc = require('apc-pdu-snmp');

var pdu = new apc.pdu({
  host: 'IP Address/Hostname'
});
```

All API methods currently use a callback to provide the response back to you.


### Methods

To fetch the count of outlets on the PDU.

```javascript
pdu.fetchTotalOutlets(function(err, totalOutlets) {
  if (err) {
    // optional error call back function
    // error variable provided as a object
    return;
  }
  // totalOutlets now contains an integer with the total number of outlets
});
```
  
To be continuned...

  
## Notes

This has been put together as quickly as possible to prototype out a control system that is currently being built. There is more than likely going to be a few bugs!

Hopefully will have some time in the future to improve the features and add some tests as using example.js for testing is pretty bad :)

All the MIBs have been hard coded into this module, for more details see the [PowerNet-MIB](ftp://ftp.apc.com/apc/public/software/pnetmib/mib/411/powernet411.mib)


## Acknowledgements

Wouldn't have been able to build this without this great article on SNMP for APC PDUs by Joshua Tobin [SNMP Tutorial – APC PDUs](http://tobinsramblings.wordpress.com/2011/05/03/snmp-tutorial-apc-pdus/)

## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/apc-pdu-snmp/blob/master/LICENSE)
