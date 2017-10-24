/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things
 */


/**
 * Update the references if the event has new positioning info,
 * and translated the RSSI signature in any case.
 * @param {Object} instance The given PositioningEngine instance.
 * @param {Object} event The given event.
 */
function updateReferences(instance, event) {

  if((!instance.hasOwnProperty('references')) ||
     (!event.hasOwnProperty('positioningMethod')) ||
     (!event.hasOwnProperty('position')) ||
     (event.position.length === 0)) {
    return translateRssiSignature(event);
  }

  // Fixed receivers
  if(event.positioningMethod === 'strongestReceiver') {
    var id = translateRssiSignature(event);
    instance.references[id] = { position: event.position };
    return id;
  }

  // Fixed beacons
  else if(event.positioningMethod === 'fixedReference') {
    var id = event.deviceId;
    instance.references[id] = { position: event.position };

    for(var cId = 0; cId < event.deviceAssociationIds.length; cId++) {
      id = event.deviceAssociationIds[cId];
      if(id.length === 40) { // iBeacon
        instance.references[id] = { position: event.position };
      }
    }
  }

  return translateRssiSignature(event);
}


/**
 * Translate the RSSI signature of the given event and return the strongest
 * receiver.
 * @param {Object} event The given event.
 */
function translateRssiSignature(event) {
  var strongestRssi = -255;
  var strongestId = null;

  for(id in event.rssiSignature) {
    var rssi = event.rssiSignature[id];
    translatedId = translateId(id);

    if(translatedId !== id) {
      event.rssiSignature[translatedId] = rssi;
      delete event.rssiSignature[id];
    }

    if(rssi > strongestRssi) {
      strongestId = translatedId;
      strongestRssi = rssi;
    }
  }

  return strongestId;
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


module.exports.updateReferences = updateReferences;
