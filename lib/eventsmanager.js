/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things
 */


/**
 * Check if the given event is valid.
 * @param {Object} event The given event.
 */
function isValidEvent(event) {
  if(event.hasOwnProperty('event') &&
     event.hasOwnProperty('time') &&
     event.hasOwnProperty('rssiSignature') &&
     (event.hasOwnProperty('deviceId') ||
      event.hasOwnProperty('deviceAssociationIds'))) {
    return true;
  }
  return false;
}


/**
 * Delete all non-essential properties from the event.
 * @param {Object} event The given event.
 */
function trimProperties(event) {
  delete event.rssiSignature;
}


module.exports.isValidEvent = isValidEvent;
module.exports.trimProperties = trimProperties;
