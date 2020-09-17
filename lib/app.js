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
  community = this.options.community || 'private'
  this.session = snmp.createSession(this.options.host, community, {
    version: snmp.Version1,
    timeout: 1000
  });

  // beginning of all oid's
  this.oid = "1.3.6.1.4.1.318.";
}

module.exports = pdu;

/**
 * Possible load state translations
 */
pdu.loadState = {
  1: 'bankLoadNormal',
  2: 'bankLoadLow',
  3: 'bankLoadNearOverload',
  4: 'bankLoadOverload'
}

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
 * @param   bool/int  state
 * @param   function  callback
 */
pdu.prototype.setPowerState = function(outlet, state, callback) {
  var oid = this.oid + '1.1.4.4.2.1.3.' + outlet;
  switch (typeof state) {
    case 'boolean':
      var value = state === true ? 1 : 2;
      break;
    case 'number':
      var value = state;
      break;
    default:
      callback(new Error('State must be boolean or number'));
  }

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
 * Set the name of outlet
 *
 * @param   int       outlet
 * @param   string    name
 * @param   function  callback
 */
pdu.prototype.setName = function (outlet, name, callback) {
  const oid = `${this.oid}1.1.4.5.2.1.3.${outlet}`;
  let value;
  switch (typeof name) {
    case 'string':
      value = name;
      break;
    default:
      value = name.toString();
      break;
  }
  if (value.length > 20) {
    callback(new Error('Length of Name should not over 20 characters'));
    return;
  }

  this.session.set(
    [
      {
        oid: oid,
        type: snmp.ObjectType.DisplayString,
        value: name,
      },
    ],
    function (error, varbinds) {
      if (error) {
        return callback(error);
      }

      if (varbinds.length !== 1) {
        callback(new Error('Unable to set the Name for this outlet'));
        return;
      }

      callback();
    }
  );
};

/**
 * Get the low load warning threshold
 *
 * @param   function    callback
 */
pdu.prototype.getLowLoadThreshold = function(callback) {
  // Using PowerNet-MIB::rPDULoadPhaseConfigLowLoadThreshold.phase1
  this.getByOid('1.1.12.2.2.1.1.2.1', callback, 'Unable to get the low warning threshold');
}

/**
 * Get the near load warning threshold
 *
 * @param   function    callback
 */
pdu.prototype.getNearLoadThreshold = function(callback) {
  // Using PowerNet-MIB::rPDULoadPhaseConfigNearOverloadThreshold.phase1
  this.getByOid('1.1.12.2.2.1.1.3.1', callback, 'Unable to get the near warning threshold')
}

/**
 * Get the over load alarm threshold
 *
 * @param   function    callback
 */
pdu.prototype.getOverloadThreshold = function(callback) {
  // Using PowerNet-MIB::rPDULoadPhaseConfigOverloadThreshold.phase1
  this.getByOid('1.1.12.2.2.1.1.4.1', callback, 'Unable to get overload threshold');
}

/**
 * Get the load state
 *  bankLoadNormal(1)
 *  bankLoadLow(2)
 *  bankLoadNearOverload(3)
 *  bankLoadOverload(4)
 *
 * @param   function  callback
 */
pdu.prototype.getLoadState = function(callback) {
  // Using PowerNet-MIB::rPDULoadStatusLoadState.0
  this.getByOid('1.1.12.2.3.1.1.3.0', callback, 'Unable to get load state');
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
