var snmp = require('net-snmp');

/**
 * Create the SNMP session
 *
 * @param options
 */
function pdu(options) {
  this.options = options;

  if (typeof options.host === "undefined") {
    throw "Please define a host";
  }

  this.session = snmp.createSession(this.options.host, "private", {
    version: snmp.Version1,
    timeout: 1000
  });

  // beginning of all oid's
  this.oid = "1.3.6.1.4.1.318.";
}

module.exports = pdu;

/**
 * Get single parameter by oid
 *
 * @param   string    oid
 * @param   function  callback
 * @param   string    errorStr
 */
pdu.prototype.getByOid = function(oid, callback, errStr) {
  oid = this.oid + oid;

  this.session.get([oid], function(err, varbinds) {
    if (err) {
      callback(err);
      return;
    }

    if (typeof varbinds[0] === "undefined") {
      if (typeof errStr === "undefined") {
        errStr = new Error('Invalid response from SNMP');
      }

      callback(errStr);
      return;
    }

    callback(null, varbinds[0].value.toString());
  });
}

/**
 * Get the total number of outlets
 *
 * @param   function    callback
 */
pdu.prototype.getTotalOutlets = function(callback) {
  // Using PowerNet-MIB::rPDUIdentDeviceNumOutlets.0
  this.getByOid('1.1.12.1.8.0', callback, 'Unable to get total number of outlets');
}

/**
 * Get a single outlet name
 *
 * @param   int         outlet - Outlet port number (1-24)
 * @param   function    callback
 */
pdu.prototype.getOutletName = function(outlet, callback) {
  // Using PowerNet-MIB::sPDUOutletCtlName.
  this.getByOid('1.1.4.4.2.1.4.' + outlet, callback, 'Unable to get the outlet name');
}

/**
 * Get all outlet names
 *
 * @param   function    callback
 */
pdu.prototype.getAllOutletNames = function(callback) {
  // Subtree for PowerNet-MIB::sPDUOutletCtl.
  var oid = this.oid + '1.1.4.4.2.1.4';
  var names = {};

  this.session.subtree(oid, 30, function(varbinds) {
    var parts = varbinds[0].oid.split('.');
    var outletNum = parts[parts.length - 1];

    names[outletNum] = varbinds[0].value.toString();
  }, function(err) {
    if (err) {
      callback(err);
      return;
    }

    callback(null, names);
  });
}

/**
 * Get the current power state of an outlet
 *
 * @param   int       outlet
 * @param   function  callback
 */
pdu.prototype.getOutletPowerState = function(outlet, callback) {
  // Using PowerNet-MIB::sPDUOutletCtl.
  this.getByOid('1.1.4.4.2.1.3.' + outlet, callback, 'Unable to get outlet power state');
}

/**
 * Get the total power draw of the unit
 *
 * @param   function    callback
 */
pdu.prototype.getPowerDraw = function(callback) {
  // Using PowerNet-MIB::rPDULoadStatusLoad.1
  var oid = this.oid + '1.1.12.2.3.1.1.2.1';

  this.session.get([oid], function(error, varbinds) {
    if(error) {
      return callback(error);
    }

    if (varbinds.length !== 1) {
      callback(new Error('Unable to get power draw'));
      return;
    }

    callback(null, varbinds[0].value / 10);
  });
}

/**
 * Set the power state (on/off) of an outlet
 *
 * @param   int       outlet
 * @param   bool      state
 * @param   function  callback
 */
pdu.prototype.setPowerState = function(outlet, state, callback) {
  var oid = this.oid + '1.1.4.4.2.1.3.' + outlet;
  var value = state === true ? 1 : 2;

  this.session.set([{
    oid: oid,
    type: snmp.ObjectType.Integer,
    value: value
  }], function(error, varbinds) {
    if (error) {
      return callback(error);
    }

    if (varbinds.length !== 1) {
      callback(new Error('Unable to set the power state for this outlet'));
      return;
    }

    if (varbinds[0].value !== value) {
      callback(new Error('Unable to change the power status for this outlet'));
      return;
    }

    callback();
  });
}

/**
 * Get the SNMP session as created by net-snmp library
 */
pdu.prototype.getSnmpSession = function() {
  return this.session;
}

/**
 * Close the SNMP session as provided by snmp library
 */
pdu.prototype.close = function() {
  this.session.close();
}