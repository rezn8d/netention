class SpimeDBMemory extends Memory {

    constructor(url) {
        super('spimedb:' + url);
        this.url = url;
    }

    start(me) {
        me.info([ 'start', this.I ]);
        this.me = me;

        //http://localhost:8080/facet?q=%3E

        const that = this;
        $.getJSON(this.url + '/facet', {d: '>'}, (obj)=>{
            //const xx = _.map(x, zz => { I: zz[0] });
            if (obj && obj.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    const x = obj[i];
                    if (x && x.length > 0) {
                        if (x && x.length > 0) {
                            me.put({
                                I: x
                            }, that);
                        }
                    }
                }
            }
        });
    }

    get(q, each) {

        const that = this;
        const _each = each;
        each = (e) => {
            _each(e);
            //HACK intercept and save in memory locally
            that.me.put(e);
        };

        $.getJSON(this.url + '/find', {q: q}, (results)=>{
            if (results && results.length > 0) {
                const obj = results[0];
                for (var i = 0; i < obj.length; i++) {
                    const x = obj[i];
                    if (x && x.length > 0) {
                        each({
                            I: x
                        });
                    }

                }
            }
            const facets = results[1];
            if (facets && facets.length > 0) {
                _.forEach(_.map(facets, g => g[0]), f => { each({
                    I: f
                    /* via: ... */
                }); } );
            }
        });
    }

    stop() {

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

