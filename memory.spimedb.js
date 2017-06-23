class SpimeDBMemory extends Memory {

    constructor(url) {
        super('spimedb:' + url);
        this.url = url;
    }

    start(I) {
        I.info([ 'start', this.I ]);

        //http://localhost:8080/facet?q=%3E

        const that = this;
        $.getJSON(this.url + '/facet', {q: '>'}, (x)=>{
            //const xx = _.map(x, zz => { I: zz[0] });
            const xx = x.map(zz => {
                return {
                    I: zz[0]
                };
            });

            I.mem.put(xx, that);
        });
    }

    get(q, each) {

        const that = this;
        $.getJSON(this.url + '/find', {q: q}, (results)=>{
            if (results) {
                const obj = results[0];
                const facets = results[1];
                I.mem.put(obj, that);
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

