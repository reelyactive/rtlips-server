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
  delete event._appearanceTime;
  delete event._ingestionTime;
  delete event._latency;
  delete event._mid;
  delete event._packetTime;
  delete event._processingTime;
  delete event._similarityString;
  delete event._similarityTags;
  delete event._storyObject;
  delete event._tenantId;
  delete event.cookie;
  delete event.rssiSignature;
  delete event.sniffypediaId;
  delete event.sniffypediaMainUrl;
  delete event.sniffypediaUrls;
  delete event.timestamp;
  delete event.tiraid;
  delete event.uniqueId;
  delete event.uuid128;
}


module.exports.isValidEvent = isValidEvent;
module.exports.trimProperties = trimProperties;
