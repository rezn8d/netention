class LeafletView extends NView {

    constructor() {
        super();
    }

    build(me, target) {

        LazyLoad.js('lib/leaflet.min.js', ()=>{

            //..

        });

    }
}
