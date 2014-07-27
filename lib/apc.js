var snmp = require('net-snmp');

/**
 * Basic error handler for all methods
 *
 * @param   object    error           Error provided by net-snmp
 * @param   function  errorCallback   Callback function
 */
function errorHandle(error, errorCallback) {
  if (typeof errorCallback === "undefined") {
    throw "Unable to process request";
  } else {
    errorCallback(error);
  }
}

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

  this.session = snmp.createSession (this.options.host, "private", {
    version: snmp.Version1,
    timeout: 1000
  });

  // beginning of all oid's
  this.oid = "1.3.6.1.4.1.318";
}

exports.pdu = pdu;

/**
 * Fetch the total number of outlets
 *
 * @param   function    callback
 * @param   function    errorCallback
 */
pdu.prototype.fetchTotalOutlets = function(callback, errorCallback) {
  // Subtree for PowerNet-MIB::rPDUIdentDeviceNumOutlets.0
  var oid = this.oid + '.1.1.12.1.8.0';

  this.session.get([oid], function(error, varbinds) {
    if (error) {
      return errorHandle(error, errorCallback);
    }

    if (varbinds.length !== 1) {
      // todo: not too happy with this
      errorCallback({
        name: 'InvalidResponseError',
        message: 'Too many varbinds were returned in this response',
        status: 2
      });
    }

    callback(varbinds[0].value);
  });
}

/**
 * Fetch a single outlet name
 *
 * @param   int         outlet - Outlet port number (1-24)
 * @param   function    callback
 * @param   function    errorCallback
 */
pdu.prototype.fetchOutletName = function(outlet, callback, errorCallback) {
  // Using MIB data - PowerNet-MIB::sPDUOutletCtlName.
  var oid = this.oid + '.1.1.4.4.2.1.4.' + outlet;

  this.session.get([oid], function(error, varbinds) {
    if(error) {
      return errorHandle(error, errorCallback);
    }

    if (varbinds.length !== 1) {
      // todo: not too happy with this
      errorCallback({
        name: 'InvalidResponseError',
        message: 'Too many varbinds were returned in this response',
        status: 2
      });
    }

    callback(varbinds[0].value.toString());
  });
}

/**
 * Fetch all outlet names
 *
 * @param   function    callback
 * @param   function    errorCallback
 */
pdu.prototype.fetchAllOutletNames = function(callback, errorCallback) {
  // Subtree for PowerNet-MIB::sPDUOutletCtl.
  var oid = this.oid + '.1.1.4.4.2.1.4';
  var names = {};

  this.session.subtree(oid, 30, function(varbinds) {
    var parts = varbinds[0].oid.split('.');
    var outletNum = parts[parts.length - 1];

    names[outletNum] = varbinds[0].value.toString();
  }, function(error) {
    if (error) {
      return errorHandle(error, errorCallback);
    }

    callback(names);
  });
}

/**
 * Fetch the current power state of an outlet
 *
 * @param   int       outlet
 * @param   function  callback
 * @param   function  errorCallback
 */
pdu.prototype.fetchOutletPowerState = function(outlet, callback, errorCallback) {
  // Using MIB data - PowerNet-MIB::sPDUOutletCtl.
  var oid = this.oid + '.1.1.4.4.2.1.3.' + outlet;

  this.session.get([oid], function(error, varbinds) {
    if(error) {
      return errorHandle(error, errorCallback);
    }

    if (varbinds.length !== 1) {
      // todo: not too happy with this
      errorCallback({
        name: 'InvalidResponseError',
        message: 'Too many varbinds were returned in this response',
        status: 2
      });
    }

    callback(varbinds[0].value);
  });
}

/**
 * Fetch the total power draw of the unit
 *
 * @param   function    callback
 * @param   function    errorCallback
 */
pdu.prototype.fetchPowerDraw = function(callback, errorCallback) {
  // Using MIB data - PowerNet-MIB::rPDULoadStatusLoad.1
  var oid = this.oid + '.1.1.12.2.3.1.1.2.1';

  this.session.get([oid], function(error, varbinds) {
    if(error) {
      return errorHandle(error, errorCallback);
    }

    if (varbinds.length !== 1) {
      // todo: not too happy with this
      errorCallback({
        name: 'InvalidResponseError',
        message: 'Too many varbinds were returned in this response',
        status: 2
      });
    }

    // todo: not 100% sure on how to fetch the actual value here
    callback(varbinds[0].value);
  });
}

/**
 * Set the power state (on/off) of an outlet
 *
 * @param   int       outlet
 * @param   bool      state
 * @param   function  callback
 * @param   function  errorCallback
 */
pdu.prototype.setPowerState = function(outlet, state, callback, errorCallback) {
  var oid = this.oid + '.1.1.4.4.2.1.3.' + outlet;
  var value = state === true ? 1 : 2;

  this.session.set([{
    oid: oid,
    type: snmp.ObjectType.Integer,
    value: value
  }], function(error, varbinds) {
    if (error) {
      return errorHandle(error, errorCallback);
    }

    if (varbinds.length !== 1) {
      // todo: not too happy with this
      errorCallback({
        name: 'InvalidResponseError',
        message: 'Too many varbinds were returned in this response',
        status: 2
      });
    }

    if (varbinds[0].value !== value) {
      // todo: not too happy with this
      errorCallback({
        name: 'UnableToSetPowerState',
        message: 'We were unable to change the power status for this outlet',
        status: 2
      });
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