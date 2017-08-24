rtlips-server
=============

Real-Time Location &amp; Indoor Positioning System server.  Combines the following:
- real-time contextual events from [Pareto](https://getpareto.com) or [hlc-server](https://www.npmjs.com/package/hlc-server) (RTLS)
- real-time BLE (beacon) site surveys from mobile devices (IPS)
- simple positioning algorithms

The real-time location/positioning data stream can be consumed using websockets.


Installation
------------

    npm install rtlips-server


Hello rtlips-server
-------------------

```javascript
const rtlipsServer = require('rtlips-server');

const options = { /* See options */ };

var app = new rtlipsServer(options);

// Connect to Pareto websocket (requires token)
app.connect('https://pareto.reelyactive.com',
            { query: { token: 'paste from Pareto' } });

// Connect to a local hlc-server instance
app.connect('http://localhost:3001');
```

Then connect a websocket client to http://localhost:3007 and listen for 'appearance', 'displacement', 'keep-alive' and 'disappearance' events.  See our [Build web apps with beaver.js](https://reelyactive.github.io/build-web-apps-with-beaver.html) tutorial for everything you need to quickly get up and running.


Receiving mobile site surveys
-----------------------------

POST mobile site surveys to the __/events__ route (ex: http://localhost:3007/events).  The mobile site survey must have, at a minimum, the following properties:

    {
      "event": "keep-alive",
      "time": 1420075425678,
      "deviceAssociationIds": [ "/* BLE UUID */" ],
      "rssiSignature": {
        "beacon_id_0": rssi_0,
        "beacon_id_1": rssi_1, ...
      }
    }

where the __beacon_id__ values are the identifiers of the detected beacons given as _lowercase hexadecimal strings without separators_ (ex: "7265656c79416374697665205555494400000000", which is a concatenated iBeacon UUID, Major, Minor), and the __rssi__ values are _numbers_.

If the mobile device advertises a Bluetooth Low Energy UUID, be sure to include this in the __deviceAssociationIds__ array, else provide an empty array.


Options
-------

The following options are accepted at run-time.

### references

Add a __references__ property to the options to specify all the reference devices (with known positions).  For example:

    references: {
      "001bc50940810000": { position: [ 0, 0 ] },
      "001bc50940810001": { position: [ 10, 10 ] }
    }

### pullFactor

Add a __pullFactor__ property to the options to adjust the pull factor in the anchor-and-pull positioning method.  The default value is 2.  Values should be 1 or greater.

    pullFactor: 2


License
-------

MIT License

Copyright (c) 2017 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
