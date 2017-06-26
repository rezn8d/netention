/** https://github.com/vega/voyager#example-use */
class VoyagerView extends NView {

    constructor() {
        super();
    }

    build(me, target) {

        target.html('Loading...');

        LazyLoad.js('lib/voyager/build/lib-voyager.js', ()=>{

            LazyLoad.css('lib/voyager/build/style.css');

            const v = voyager.CreateVoyager(target[0]);
            target.css({
                //overrides
                fontSize: 'auto'
            });
            target.find('header').hide();

            v.updateConfig({
                showDataSourceSelector: false
            }); //HACK should have been taken by constructor

            v.updateData({
                "values": [
                    {"fieldA": "A", "fieldB": 28}, {"fieldA": "B", "fieldB": 55}, {"fieldA": "C", "fieldB": 43},
                    {"fieldA": "D", "fieldB": 91}, {"fieldA": "E", "fieldB": 81}, {"fieldA": "F", "fieldB": 53},
                    {"fieldA": "G", "fieldB": 19}, {"fieldA": "H", "fieldB": 87}, {"fieldA": "I", "fieldB": 52}
                ]
            });

        });

    }
}
