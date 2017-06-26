class CesiumView extends NView {

    constructor() {
        super();
    }

    build(me, target) {

        target.html('<h1>Loading Map...</h1>');

        LazyLoad.js('lib/cesium/Cesium.js', ()=>{

            //me.info('Cesium 3D Map ready');

            target.html('');
            const c = new Cesium.CesiumWidget(target[0], {
                //http://cesiumjs.org/Cesium/Build/Documentation/CesiumWidget.html
                sceneModePicker: true,
                timeline: false,
                animation: true,
                fullscreenButton: false,
                sceneMode: Cesium.SceneMode.SCENE3D,
                navigationHelpButton: false,
                navigationInstructionsInitiallyVisible: false,
                targetFrameRate: 15,
                projectionPicker: true,
                skyAtmosphere: false,
                contextOptions: {
                    //http://cesiumjs.org/Cesium/Build/Documentation/Scene.html
                }
                //imageryProvider: !1,
                //baseLayerPicker: !1,
                //clock: clock,
                //terrainProvider: !1
            });
            c._element.setAttribute('style', 'width: 100%; height: 100%');
            c._canvas.setAttribute('style', 'width: 100%; height: 100%');

            //viewer.extend(Cesium.viewerCesiumNavigationMixin, {});

        });

    }
}
