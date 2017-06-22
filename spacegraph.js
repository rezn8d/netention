"use strict";

class SpaceGraphView extends NView {

    constructor() {
        super();
    }

    build(me, target) {
        var ele = undefined;

        LazyLoad.js([
            'lib/p2.min.js',
            'lib/pixi.min.js',
            'lib/p2.renderer.custom.js'
        ], () => {
            console.log('starting graph view', p2);

            const world = new p2.World({
                gravity: [0, 0]
            });


            const sg = new p2.WebGLRenderer(function () {

                this.setWorld(world);


                world.on("addBody", function (evt) {
                    evt.body.setDensity(1);
                });

                // Change the current engine torque with the left/right keys
                this.on("keydown", function (evt) {
                    // t = 5;
                    // switch (evt.keyCode) {
                    //     case 39: // right
                    //         torque = -t;
                    //         break;
                    //     case 37: // left
                    //         torque = t;
                    //         break;
                    // }
                });
                this.on("keyup", function () {
                    //torque = 0;
                });
            });
            target.html(sg.element);
            target.prepend($(sg.gui.domElement).css('position', 'fixed'));

            sg.p2 = p2;


            for (var i = 0; i < 25; i++) {
                var body = new p2.Body({mass: 1, position: [Math.random() * 3, Math.random() * 3]});
                var shape = new p2.Box({width: 0.5, height: 0.5});
                body.addShape(shape);
                sg.world.addBody(body);
            }
        });

        return {
            stop: () => {
                if (ele) {
                    ele.remove();
                }
            }
        };
    }
}
