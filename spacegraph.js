"use strict";

class SpaceGraphView extends NView {

    constructor() {
        super();
        console.log('start');
    }

    build(me, target) {
        console.log('init graph view');
        var ele = undefined;
        $LAB
            .script('lib/p2.min.js')
            .script('lib/pixi.min.js')
            .script('lib/p2.renderer.min.js')
            .wait()
            .wait(()=>{
                console.log('starting graph view');
                ele = $('<h1>GRAPH</h1>').appendTo(target);
            });

        return {
            stop: ()=>{
                if (ele) {
                    ele.remove();
                }
            }
        };
    }
}
