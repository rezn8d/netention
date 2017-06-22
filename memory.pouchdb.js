/*
$.LAB
    .script("lib/pouchdb.min.js")
*/


var MEMORY_SIZE = 256;

var N = window.N;

class PouchDBMemory {

    constructor() {

    }

    start(I) {

        LazyLoad.js('lib/pouchdb.min.js', ()=>{
            const db = this.db = new PouchDB("spime");

            I.info([ 'start', 'PouchDB' ]);

            db.changes({
                since: 'now',
                live: true,
                include_docs: true
            }).on('change', function (change) {


                // change.id contains the doc id, change.doc contains the doc
                if (change.deleted) {
                    // document was deleted
                    //console.log('delete', change);
                } else {
                    // document was added/modified
                    //console.log('change', change);
                }
            })
            /*.on('error', function (err) {
                        // handle errors
                    });*/

        });
    }


    ADD(n) {
        const id = n.I;
        if (!id)
            throw new Error("missing ID");

        var y;
        var x = this.get(id);
        if (x) {
            if (!(y = x).update(n))
                return y; //no changes that should update db
        } else {
            y = new NObject(n);
            this.set(id, y); //update LFU cache by reinserting
        }


        this.db.upsert(id, (d) => {

            n._id = id;
            n._rev = d._rev; //temporary
            if (_.isEqual(d, n)) {
                return false; //no change
            } else {
                //console.log(JSON.stringify(d), JSON.stringify(n), _.isEqual(d, n));
                delete n._rev; //undo the temporarily added revision for the comparison
                return n;
            }

        })/*.then((d)=>{
            console.log('then', d);
        })*/.catch(function (err) {
            console.error(err)
        });


        return y;
    }


    REMOVE(id) {

        const r = this.get(id);
        if (!r)
            return;

        this.delete(id);
        return r;

    }

    CLEAR() {

        this.clear();
        //clusters = {};
    }


}
