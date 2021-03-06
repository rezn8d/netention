"use strict";
/*jslint node: true */
/* jshint multistr: true, browser: true */


if (!window.N)
    window.N = {};




class NObject {

    constructor(x=undefined) {

        this.pri = 0.0;

        if (typeof(x) === "string")
            this.I = x;
        else if (typeof(x) === "object")
            _.extend(this, x);
        else {
            this.I = uuid();
        }
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


/** abstract memory interface */
class Memory extends NObject {

    constructor(id) {
        super(id);
    }


    /** attempt to asynch "put"/send/share a nobject into memory */
    put(x) {

    }

    /** TODO rename to find() */
    get(query, each) {

    }

    start(i) {

    }

    stop() {

    }


    /** call this when there is activity.  the actual callee will be overridden
     * amount in range 0..1.0 indicating the approximate strength of the activity level
     * set to -1 to indicate disconnect
     * */
    onActivity(amount) {

    }
}

/* network router; delegates to several child sub-memories more or less fairly */
class Router extends Memory {

    constructor(me) {
        super('router:' + me);
        this.me = me;
        this.active = new Set();
    }

    put(x, exclude = undefined) {
        this.active.forEach(a => {
            if (exclude && (exclude === a || a === exclude.I))
                return;

            a.put(x);
        });
    }

    get(query, each) {
        this.active.forEach(a => {
            try {
                a.get(query, each);
            } catch (e) {
                console.warn(a, e);
            }
        });
    }

    add(connection) {
        if (this.active.add(connection)) {
            connection.start(this.me);
            this.me.emit('connect', connection);
        }
    }

    remove(connection) {
        if (this.active.remove(connection)) {
            connection.stop();
            this.me.emit('disconnect', connection);
        }
    }
}

/** the client-side configuration state */
class NClient extends EventEmitter {


    constructor(opt = {}) {
        super();

        _.assign(this, opt);

        this.mem = new Router(this);

        const STACK = {
            "dir1": "down",
            "dir2": "right",
            "push": "bottom",
            "animation": true,
            "nextpos1": 25,
            "nextpos2": 25,
            "addpos2": 0,
            "firstpos1": 25,
            "firstpos2": 25
        };
        this.on('info', (x) => {
            var notice = new PNotify({
                title: '',
                text:  x,
                type: 'info',
                icon: 'fa fa-exclamation-triangle',
                buttons: {
                    closer: true,
                    sticker: true
                },
                stack: STACK
            });
            // notice.get().click(function () {
            //     notice.remove();
            // });
        });

        this.on('put' /*['put', 'connect', 'disconnect']*/, (x) => {
            this.info(x);
        });

        this.info('Ready');

    }

    /** TODO inclusion semantics */
    put(x, excludeMemory = undefined) {
        var y = this.mem.put(x, excludeMemory);
        this.emit('put', x);
        return y;
    }

    get(query, each) {
        assert(query);
        assert(each);
        return this.mem.get(query, each);
    }

    info(msg) {

        if (msg.N) {
            msg = ('<a href="#' + msg.I + '">' + msg.N + '</a>');
        } else if (msg.I) {
            msg = ('<a href="#' + msg.I + '">' + msg.I + '</a>');
        } else if (typeof(msg) !== "string") {
            msg = JSON.stringify(msg, null, 2);
        }

        this.emit('info', msg);
    }


    merge(other) {
        //TODO use non-lodash method
        _.each(other, (v, k) => {
            console.log(k, v);
            //TODO merge
        });
        return this;
    }

    nobject(id = undefined) {
        var x;
        if (!id) {
            x = new NObject(uuid());
            x['@'] = Date.now();
            this.put(x);
        } else {
            x = new NObject(id);
            const that = this;
            this.get(id, (y) => {
                that.merge(y);
            });
        }

        return x;
    }
}


// var example = {
//     n: 1,
//     s: 'a',
//     f: function () {
//         console.info(this, arguments);
//         return 123;
//     }
// };
// var observed = new ObservableObject(example, {
//     emitOnEachPropChange: true,
//     emitSummaryChanges: true
// });
//
//
// observed.on('change:q', x => console.info('CHANGE:q', x));
// observed.on('change', x => console.info('CHANGE', x));
//
// observed.n = 5;
// observed.q = 'new q value';


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
        this.ele = D('grid-item btn')
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


window.N.Client = NClient;
window.N.View = NView;


var sampleNobjects = {
    "I": "Nobjects",
    "Alerts": {
        "N": "<span style='color:#FC0'>LIVE!</span> Alerts",
        "icon": "fa-globe",
        "Earthquake": {
            "N": "Earthquake",
            "icon": "fa-rss",
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


class QueryTool {

    constructor(me) {
        this.me = me;

        const x = newWindow(D()
            .append(this.input = $('<input placeholder="Query Tool" type="text"/>'))
            .append(this.output = $('<div class="grid" style="position: relative; max-height: 80%; overflow: auto">')))
                // data-packery='{ "itemSelector": ".grid-item", "gutter": 10 }'
            .centerOnScreen();

        const that = this;

        const updateThrottled = _.throttle(()=>that.update(), 100);
        this.input.on('input', ()=>{
            updateThrottled();
        });
        this.update();
    }

    update() {
        const q = this.input.val().trim();
        if (q.length === 0) {
            this.output.html('');
        } else {
            this.output.html(''); //loading query: ' + q);
            this.me.get(q, (x)=>{
                this.output.append(new NIcon(x).ele );
               //this.output.append($('<div class="grid-item"/>').text(x.N || x.I));
            });
        }
    }

}
