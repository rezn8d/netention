/** PeerJS http://peerjs.com/ */
class WebRTCMemory extends Memory {

    constructor(url) {
        super('spimedb:' + url);
        this.url = url;
    }

    start(me) {
        LazyLoad.js('lib/peerjs.min.js', ()=>{

            var peer = new Peer({
                key: 'dgau4go9k83yp66r',
                debug: 3
            });
            peer.on('open', function(id) {
                me.info(['WebRTC', 'Peer ID: ' + id]);

            });
        });
    }
}
