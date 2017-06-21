"use strict";
/*jslint node: true */
/* jshint multistr: true, browser: true */


if (!window.N)
    window.N = { };


/** the client-side configuration state */
class NClient {

    constructor(opt={}) {

        _.assign(this, opt);
    }

}



class NView {

    constructor() {

    }

    /**
     * @param me netention context
     * @param target element to append to
     * creates a new instance of the view
     * can return something which has a method .stop() which will be called prior to destruction */
    build(me, target) {

    }

}

class NObject {

    constructor(x) {

        this.pri = 0.0;

        //this.visible = true;

        _.extend(this, x);
    }

    activate(p) {
        this.pri = Math.min(1, Math.max(0, this.pri + p));
    }

    // remove() {
    //     if (this.what) {
    //         this.what.remove();
    //         this.what = null;
    //     }
    //     if (this.where) {
    //         this.where.remove();
    //         this.where = null;
    //     }
    // }

    /** merge any changes into this instance; return true if change, false if no change */
    update(next) {
        //TODO
        return false;
    }

    where() {
        const w = this._where;
        if (w !== undefined)
            return w; //cached value

        const bounds = this['@'];
        if (bounds) {

            //Leaflet uses (lat,lon) ordering but SpimeDB uses (lon,lat) ordering

            //when = bounds[0]
            var lon = bounds[1];
            var lat = bounds[2];
            //alt = bounds[3]

            var label = this.N || this.I || "?";

            var m;

            var linePath, polygon;
            if (linePath = this['g-']) {
                //TODO f.lineWidth

                m = L.polyline(linePath, {color: this.color || 'gray', data: this, title: label});

            } else if (polygon = this['g*']) {

                m = L.polygon(polygon, {color: this.polyColor || this.color || 'gray', data: this, title: label});

            } else {
                //default point or bounding rect marker:

                var mm = {
                    data: this,
                    title: label,
                    stroke: false,
                    fillColor: "#0078ff",
                    fillOpacity: 0.5,
                    weight: 1
                };

                if (!(Array.isArray(lat) || Array.isArray(lon))) {
                    mm.zIndexOffset = 100;
                    //f.iconUrl
                    m = L.circleMarker([lat, lon], mm);
                    //.addTo(map);
                } else {
                    const latMin = lat[0], latMax = lat[1];
                    const lonMin = lon[0], lonMax = lon[1];


                    mm.fillOpacity = 0.3; //TODO decrease this by the bounds area

                    m = L.rectangle([[latMin, lonMin], [latMax, lonMax]], mm);
                }


            }

            if (m) {
                //m.on('click', clickHandler);
                //m.on('mouseover', overHandler);
                //m.on('mouseout', outHandler);

                return this._where = m;
            }
        } else {
            return this._where = false;
        }
    }

    what() {
        if (!this._what) {
            $('#results').append(this._what = ResultNode(this));
            return this._what;
        }
    }

    when() {
        //TODO

        /*if (timeline) {
            const bounds = x['@']; if (bounds) {
                const when = bounds[0];
                if (typeof(when)==='number' || typeof(when)==='array')
                    console.log(x, when);
            }
        }*/
    }

}

/** nobject viewer/editor interface model */
class NEdit {

    constructor(n) {
        this.n = n;
        this.ele = D('box');
        const b = this.ele;

        const content = D();
        content.html(JSON.stringify(n));

        var font = 1.0;

        function updateFont() {
            b.attr('style', 'font-size:' + (parseInt(font * 100.0)) + '%');
        }

        const controls = D('controls').append(
            SPANclass('label').append(n.N || n.I),

            SPANclass('button').text('v').click(() => {
                font *= 0.75;
                updateFont(); //font shrink
            }),

            SPANclass('button').text('^').click(() => {
                font *= 1.333;
                updateFont(); //font grow
            }),

            // SPANclass('button').text('~').click(()=>{
            //     newWindow(b);
            // }),

            SPANclass('button').text('x').click(() => b.hide())
        );

        b.append(controls);

        if (content)
            b.append(content);

    }

    showPopup() {
        return newWindow(this.ele);
    }
}

/** label-sized icon which can become an NView */
class NIcon {
    constructor(n) {
        this.n = n;
        this.ele = D('grid-item-content')
            .text(n.I).click(() => {

                //queryText.val(/* dimension + ':' + */ id);
                //Backbone.history.navigate("all/" + id);

                //querySubmit();

                new NView(n).showPopup();

                return false;
            });


        // d.append(E('button').text(n.N).click(()=>{
        //     //popup
        //     console.log(n, 'clicked');
        // }));
    }

    scale(s) {
        this.ele.attr('style',
            'font-size:' + (75.0 + 20 * (Math.log(1 + s))) + '%');
        return this;
    }
}

function SpimeSocket(path, add) {

    const defaultHostname = window.location.hostname || 'localhost';
    const defaultWSPort = window.location.port || 8080;
    const options = undefined;

    /** creates a websocket connection to a path on the server that hosts the currently visible webpage */
    const ws = new ReconnectingWebSocket(
        'ws://' + defaultHostname + ':' + defaultWSPort + '/' + path,
        null /* protocols */,
        options); //{
    //Options: //https://github.com/joewalnes/reconnecting-websocket/blob/master/reconnecting-websocket.js#L112
    /*
     // The number of milliseconds to delay before attempting to reconnect.
     reconnectInterval: 1000,
     // The maximum number of milliseconds to delay a reconnection attempt.
     maxReconnectInterval: 30000,
     // The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist.
     reconnectDecay: 1.5,

     // The maximum time in milliseconds to wait for a connection to succeed before closing and retrying.
     timeoutInterval: 2000,
     */
    //});

    ws.binaryType = 'arraybuffer';

    ws.onopen = function () {

        add('websocket connect');

    };

    ws.onmessage = m => add(msgpack.decode(new Uint8Array(m.data)));

    // ws.onmessage = function (e) {
    //     try {
    //         var c = e.data;
    //         var d = JSON.parse(c);
    //         add(d);
    //     } catch (e) {
    //         add(c);
    //     }
    // };

    ws.onclose = e => add(['Websocket disconnected', e]);

    ws.onerror = e => add(["Websocket error", e]);

    return ws;
}


window.N.Client = NClient;
window.N.View = NView;


var sampleNobjects = {
    "I": "Nobjects",
    "Alerts": {
        "N": "<span style='color:#FC0'>LIVE!</span> Alerts",
        "icon": "fa-globe",
        "Earthquake": {
            "N": "Earthquake",
            "icon":  "fa-rss",
            ">": [
                {
                    "I": "usgs-all-hour",
                    "T": "geojson",
                    "ML": "usgs-eq",
                    "MI": "/img/icons/earthquakes.png",
                    "G": "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
                    "S": "United States Geological Society (USGS) Earthquake Hazards Program",
                    "U": "http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php",
                    "N": "USGS - All Earthquakes (Last Hour)"
                }
            ]
        }
    }
};

//(function () {
   //the rest of the function


//}()); // END use s

