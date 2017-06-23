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
            'spacegraph.renderer.js'
        ], () => {

            const world = new p2.World({
                gravity: [0, 0],
            });
            world.solver.tolerance = 0.01;


            const sg = new p2.WebGLRenderer(function () {

                this.setWorld(world);

                // world.on("addBody", function (evt) {
                //     evt.body.setDensity(1);
                // });
                //
                // // Change the current engine torque with the left/right keys
                // this.on("keydown", function (evt) {
                //     // t = 5;
                //     // switch (evt.keyCode) {
                //     //     case 39: // right
                //     //         torque = -t;
                //     //         break;
                //     //     case 37: // left
                //     //         torque = t;
                //     //         break;
                //     // }
                // });
                // this.on("keyup", function () {
                //     //torque = 0;
                // });
            });
            world.sleepMode = p2.World.BODY_SLEEPING;

            sg.p2 = p2;

            target.html(sg.element);
            target.prepend($(sg.gui.domElement).css('position', 'fixed'));


            const overlay = D().prependTo($(target)).attr('style', 'position: fixed; width: 100%; height: 100%; overflow: hidden; margin: 0; padding: 0; pointer-events: none');

            //BOUNDS
            /* */ {
                // // Create ground
                // var planeShape = new p2.Plane();
                // var plane = new p2.Body({
                //     position: [0,-2]
                // });
                // plane.addShape(planeShape);
                // world.addBody(plane);


                const W = 32;
                const H = 24;
                const thick = 1;

                // Create kinematic, moving box


                {
                    const kinematicBody = new p2.Body({
                        type: p2.Body.KINEMATIC,
                        position: [0, H / 2]
                    });
                    kinematicBody.addShape(new p2.Box({width: W, height: thick}));
                    world.addBody(kinematicBody);
                }

                {
                    const kinematicBody = new p2.Body({
                        type: p2.Body.KINEMATIC,
                        position: [0, -H / 2]
                    });
                    kinematicBody.addShape(new p2.Box({width: W, height: thick}));
                    world.addBody(kinematicBody);
                }

                {
                    const kinematicBody = new p2.Body({
                        type: p2.Body.KINEMATIC,
                        position: [W/2, 0]
                    });
                    kinematicBody.addShape(new p2.Box({height: H, width: thick}));
                    world.addBody(kinematicBody);
                }
                {
                    const kinematicBody = new p2.Body({
                        type: p2.Body.KINEMATIC,
                        position: [-W/2, 0]
                    });
                    kinematicBody.addShape(new p2.Box({height: H, width: thick}));
                    world.addBody(kinematicBody);
                }
            }

            // for (let i = 0; i < 25; i++) {
            //     const body = new p2.Body({
            //         mass: 1,
            //         position: [Math.random() * 3, Math.random() * 3],
            //         fixedRotation: true /* prevents rotation */
            //     });
            //     const shape = new p2.Box({width: 0.5, height: 0.5});
            //     body.addShape(shape);
            //     sg.world.addBody(body);
            // }

            function updateWidget(ele, x, y, pw, ph) {


                //unjquery-ify
                var minPixels= ele.minPixels;

                const pixelScale = parseFloat(ele.pixelScale || 128.0); //# pixels wide




                var scale = parseFloat(ele.scale || 0.75);

                var cw, ch;
                var narrower = parseInt(pixelScale);
                if (pw < ph) {
                    cw = narrower;
                    ch = parseInt(pixelScale*(ph/pw));
                }
                else {
                    ch = narrower;
                    cw = parseInt(pixelScale*(pw/ph));
                }




                //get the effective clientwidth/height if it has been resized
                var style = ele.style;
                if ((( ele.specWidth !== style.width ) || (ele.specHeight !== style.height))) {
                    // var hcw = ele.clientWidth;
                    // var hch = ele.clientHeight;

                    ele.specWidth = style.width = cw;
                    ele.specHeight = style.height = ch;


                    // cw = hcw;
                    // ch = hch;

                }
                if (minPixels) {
                    // var hidden = ('none' === style.display);
                    //
                    // if (Math.min(wy, wx) < minPixels / pixelScale) {
                    //     if (!hidden) {
                    //         style.display = 'none';
                    //         return;
                    //     }
                    // }
                    // else {
                    //     if (hidden) {
                    //         style.display = 'block';
                    //     }
                    // }
                }

                //console.log(html[0].clientWidth, cw, html[0].clientHeight, ch);


                var globalToLocalW = pw / cw;
                var globalToLocalH = ph / ch;

                var transformPrecision = 3;

                var wx = (scale * globalToLocalW).toPrecision(transformPrecision);
                var wy = (scale * globalToLocalH).toPrecision(transformPrecision);

                //TODO check extents to determine node visibility for hiding off-screen HTML
                //for possible improved performance

                //parseInt here to reduce precision of numbers for constructing the matrix string
                //TODO replace this with direct matrix object construction involving no string ops

                var halfScale = scale/2.0;
                var px = (x - (halfScale*pw)).toPrecision(transformPrecision);
                var py = (y - (halfScale*ph)).toPrecision(transformPrecision);

                //px = parseInt(pos.x - pw / 2.0 + pw * paddingScale / 2.0); //'e' matrix element
                //py = parseInt(pos.y - ph / 2.0 + ph * paddingScale / 2.0); //'f' matrix element
                //px = pos.x;
                //py = pos.y;

                //nextCSS['transform'] = tt;
                //html.css(nextCSS);

                //TODO non-String way to do this
                //var matb = 0, matc = 0;
                //style.transform = 'matrix(' + wx+ ',' + 0/*matb*/ + ',' + 0/*matc*/ + ',' + wy + ',' + px + ',' + py + ')';;
                style.transform = 'matrix(' + wx+ ',0,0,' + wy + ',' + px + ',' + py + ')';
            }



            me.on('put', (x) => {

                for (var i = 0; i < x.length; i++) {
                    const xx = x[i];
                    const body = new p2.Body({
                        mass: 1,
                        position: [Math.random() * 3, Math.random() * 3],
                        fixedRotation: true, /* prevents rotation */
                        allowSleep: true,
                        sleepSpeedLimit: 0.01, // Body will feel sleepy if speed<1 (speed is the norm of velocity)
                        sleepTimeLimit: 2, // Body falls asleep after Ns of sleepiness
                        damping: 0.2
                    });
                    const shape = new p2.Box({width: 2.5, height: 2.5});
                    body.addShape(shape);
                    sg.world.addBody(body);


                    //setTimeout(()=>{
                    {
                        const label = new PIXI.Text/*PIXI.extras.BitmapText*/(xx.N || xx.I, {
                            fontFamily: 'Monospace', fontSize: 14, fill: 0x00ff00, align: 'center'
                            //font: "35px Desyrel", align: "right"
                        });
                        const scal = 1 / 80.0;
                        label.position.y = 0;
                        label.position.y = 0;
                        label.scale.x *= -scal;
                        label.scale.y *= scal;
                        label.rotation = Math.PI;

                        label.cacheAsBitmap = true;

                        body.sprite.addChild(label);

                    }

                    {
                        const w = E('button').appendTo(overlay).text('XYZ');
                        w.attr('style', 'position: fixed; width: 128; height: 128; color: orange; opacity:0.8; background-color: black; ');
                        setInterval(()=>{

                            const bw = vec2.create();
                            body.toWorldFrame ( bw, vec2.create() );


                            const pixel = sg.physicsToDom(bw);

                            //pixel[1] = pixel[1] - sg._cameraStoreY.x;

                            //TODO cache the result value, dont update DOM if not changed
                            const zoom = sg.zoom;

                            const scale = 10.0;
                            updateWidget(w[0], pixel[0], pixel[1], scale * (zoom)  /* HACK */, scale * (zoom) /* HACK */ );


                            //var pos = vec2.create();
                            //sg.renderer.domVectorToPhysics(pos, pos);


                            // let wf = vec2.create();
                            // body.toWorldFrame(wf,vec2.create());
                            // console.log(wf);
                            //updateWidget(w[0], body.worl)
                        }, 50);
                    }



                    //}, 1000);
                }

            });

            /*               position: [-2, 1],
            });
            bodyA.addShape(new p2.Circle({ radius: 0.5 }));
            world.addBody(bodyA);
            var bodyB = new p2.Body({
                mass: 1,
                position: [-0.5, 1],
            });
            bodyB.addShape(new p2.Circle({ radius: 0.5 }));
            world.addBody(bodyB);

            // Create constraint.
            // If target distance is not given as an option, then the current distance between the bodies is used.
            var constraint1 = new p2.DistanceConstraint(bodyA, bodyB);
            world.addConstraint(constraint1);
            constraint1.upperLimitEnabled = true;
            constraint1.lowerLimitEnabled = true;
            constraint1.upperLimit = 2;
            constraint1.lowerLimit = 1.5;
            */
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
