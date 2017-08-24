/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things
 */


/**
 * Translate the RSSI signature of the given event.
 * @param {Object} event The given event.
 */
function translateRssiSignature(event) {
  var translatedRssiSignature = [];

  for(var cRssi = 0; cRssi < event.rssiSignature.length; cRssi++) {
    var entry = event.rssiSignature[cRssi];
    var id = Object.getOwnPropertyNames(entry)[0];
    var rssi = event.rssiSignature[cRssi][id];

    translatedId = translateId(id);

    var translatedEntry = {};
    translatedEntry[translatedId] = rssi;
    translatedRssiSignature.push(translatedEntry);
  }

  event.rssiSignature = translatedRssiSignature;
}


/**
 * Translate the given identifier, if required.
 * @param {String} id The given identifier.
 */
function translateId(id) {

  // reelyActive EUI-64 (nothing to translate)
  if((id.length === 16) && (id.substr(0,9) === '001bc5094')) {
    return id;
  }

  // reelyActive iBeacon to reelyActive EUI-64
  if((id.length === 40) &&
     (id.substr(0,32) === '7265656c794163746976652055554944')) {
    return '001bc5094081' + id.substr(-4);
  }

  return id;
}


module.exports.translateRssiSignature = translateRssiSignature;
