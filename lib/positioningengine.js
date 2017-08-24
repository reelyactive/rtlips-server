/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things
 */


const DEFAULT_PULL_FACTOR = 2;


/**
 * PositioningEngine Class
 * Positioning engine for RTLS and IPS.
 * @param {Object} options The options as a JSON object.
 * @constructor
 */
function PositioningEngine(options) {
  const self = this;

  options = options || {};
  self.references = options.references || {};
  self.pullFactor = options.pullFactor || DEFAULT_PULL_FACTOR;
}


/**
 * Estimate the position of the given event
 * @param {String} event The given event.
 * @param {callback} callback Function to call on completion.
 */
PositioningEngine.prototype.positionEvent = function(event, callback) {
  const self = this;

  var numberOfSignatureEntries = Object.keys(event.rssiSignature).length;

  // Single reference: adopt its position
  if(numberOfSignatureEntries === 1) {
    positionNearest(self, event);
  }

  // Multiple references: anchor-and-pull
  else if(numberOfSignatureEntries > 1) {
    anchorAndPull(self, event);
  }

  return callback(event);
};


/**
 * Position the event at the position of the strongest known reference
 * @param {Object} instance The given PositioningEngine instance.
 * @param {String} event The given event.
 */
function positionNearest(instance, event) {
  var referenceId = getStrongestIdArray(event.rssiSignature)[0];

  event.position = getReferencePosition(instance, referenceId);
  event.positioningMethod = 'strongestReceiver';
}


/**
 * Position the event based on the strongest two known references
 * @param {Object} instance The given PositioningEngine instance.
 * @param {String} event The given event.
 */
function anchorAndPull(instance, event) {
  var strongestIds = getStrongestIdArray(event.rssiSignature);
  var anchorId = strongestIds[0];
  var pullId = strongestIds[1];
  var anchorRssi = event.rssiSignature[anchorId];
  var pullRssi = event.rssiSignature[pullId];
  var anchorPosition = getReferencePosition(instance, anchorId);
  var pullPosition = getReferencePosition(instance, pullId);

  if(!anchorPosition) {
    return;
  }
  if(!pullPosition) {
    event.position = anchorPosition;
    event.positioningMethod = 'strongestReceiver';
    return;
  }

  event.position = calculateInterPosition(anchorPosition, pullPosition,
                                          anchorRssi, pullRssi,
                                          instance.pullFactor);
  event.positioningMethod = 'anchorAndPull';
}


/**
 * Get the position, if known, of the given reference
 * @param {Object} instance The given PositioningEngine instance.
 * @param {String} referenceId The given reference identifier.
 */
function getReferencePosition(instance, referenceId) {
  if(instance.references.hasOwnProperty(referenceId) &&
     instance.references[referenceId].hasOwnProperty('position')) {
    return instance.references[referenceId].position;
  }
  return null;
}


/**
 * Return an array of identifiers sorted from strongest to weakest
 * @param {Object} rssiSignature The given rssiSignature.
 */
function getStrongestIdArray(rssiSignature) {
  var ids = Object.keys(rssiSignature);
  return ids.sort(function(a,b) { return rssiSignature[b]-rssiSignature[a] });
}


/**
 * Calculate the position between two points with a max distance from the first
 * @param {Array} pos1 The first position
 * @param {Array} pos2 The second position
 * @param {Number} rssi1 The first RSSI (strongest)
 * @param {Number} rssi2 The second RSSI
 * @param {Number} pullFactor The factor controlling the amount of pull
 */
function calculateInterPosition(pos1, pos2, rssi1, rssi2, pullFactor) {
  var deltaRssi = rssi1 - rssi2;
  var pullRatio = 1 / ((deltaRssi / pullFactor) + 2);
  var deltaX = pos2[0] - pos1[0];
  var deltaY = pos2[1] - pos1[1];
  var posX = pos1[0] + (pullRatio * deltaX);
  var posY = pos1[1] + (pullRatio * deltaY);

  // 3D interpolation
  if((pos1.length === 3) && (pos2.length === 3)) {
    var deltaZ = pos2[2] - pos1[2];
    var posZ = pos1[2] + (pullRatio * deltaZ);

    return [posX, posY];
  }

  // 2D interpolation
  else {
    return [posX, posY];
  }
}


module.exports = PositioningEngine;
