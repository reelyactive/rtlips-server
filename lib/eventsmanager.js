/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things
 */


/**
 * Normalise the event, if possible, else return false.
 * @param {Object} event The given event.
 */
function normaliseEvent(event) {
  if(!event.hasOwnProperty('event') ||
     !event.hasOwnProperty('time') ||
     !(event.hasOwnProperty('deviceId') ||
       event.hasOwnProperty('deviceAssociationIds'))) {
    return false;
  }

  // Create the rssiSignature
  if(!event.hasOwnProperty('rssiSignature')) {

    // From tiraid
    if(event.hasOwnProperty('tiraid')) {
      event.rssiSignature = {};

      var radioDecodings = event.tiraid.radioDecodings;
      for(var cDecoding = 0; cDecoding < radioDecodings.length; cDecoding++) {
        var receiverId = radioDecodings[cDecoding].identifier.value;
        var rssi = radioDecodings[cDecoding].rssi
        event.rssiSignature[receiverId] = rssi;
      }
    }

    // From receiverId and rssi
    else if(event.hasOwnProperty('receiverId')) {
      event.rssiSignature = {};
      event.rssiSignature[event.receiverId] = event.rssi;
    }

    // Impossible to create rssiSignature
    else {
      return false;
    }
  }

  return true;
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


module.exports.normaliseEvent = normaliseEvent;
module.exports.trimProperties = trimProperties;
