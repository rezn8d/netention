"use strict";

/*
$.LAB
    .script("lib/pouchdb.min.js")
*/


var N = window.N;

class PouchDBMemory extends Memory {

    constructor(pouchBuilder = "") {
        super('pouch:' + pouchBuilder);
        this.pouchBuilder = pouchBuilder;
    }

    start(me) {

        //https://github.com/nolanlawson/pouchdb-find
        //https://github.com/pouchdb/geopouch


        const that = this;

        LazyLoad.js('lib/pouchdb.min.js', () => {
            LazyLoad.js(['memory.min.js', 'find.min.js', 'quick-search.min.js'].map(x => 'lib/pouchdb.' + x), () => {

                if (typeof(that.pouchBuilder) === "string") {
                    that.db = new PouchDB(that.pouchBuilder)
                } else {
                    that.db = that.pouchBuilder(PouchDB);
                }
                const db = that.db;

                // db.search({
                //     fields: ['I', 'N'],
                //     build: true
                // }).then(function (info) {
                //     // if build was successful, info is {"ok": true}
                //     //console.log(info);
                // }).catch(function (err) {
                //     console.warn(err);
                // });


                db.changes({
                    since: 'now',
                    live: true,
                    include_docs: true
                }).on('change', function (change) {


                    // change.id contains the doc id, change.doc contains the doc
                    if (change.deleted) {
                        // document was deleted
                        //console.info('delete', change);
                    } else {
                        // document was added/modified
                        //console.info('change', change);
                    }
                });
                /*.on('error', function (err) {
                            // handle errors
                        });*/

                // db.info().then(function (info) {
                //     console.log(that.id, info);
                // });

                me.info(['start', that.I]);

            });
        });
    }


    put(x) {
        this.ADD(x);
    }

    get(query, each) {
        if (!this.db)
            return; //not connected yet TODO queue it

        const db = this.db;

        function process(info) {
            if (info.rows) {
                info.rows.forEach(r => {
                    each(r.doc);
                });
            }
        }

        if (!db._remote) {
            db.search({
                query: query,
                fields: ['I', 'N'/*, '_'*/],
                //limit: 10,
                include_docs: true
                //skip: 20
            }).then(function (info) {
                process(info);
            }).catch(function (err) {
                console.warn(err);
            });
        } else {
            //for some reason, full-text search doesnt work on remotes
            db.allDocs({
                startkey: query,
                endkey: query + '\uffff',
                include_docs: true
            }).then((info)=>{
                process(info);
            });
        }

        // const that = this;
        // this.db.bulkDocs([
        //     {_id: 'marin'},
        //     {_id: 'mario'},
        //     {_id: 'marth'},
        //     {_id: 'mushroom'},
        //     {_id: 'zelda'}
        // ]).then(function () {
        //     that.db.allDocs({
        //         startkey: 'mar',
        //         endkey: 'mar\uffff'
        //     }).then((x)=>{
        //         console.log(x);
        //     });
        // });
    }

    ADD(n) {

        if (!this.db)
            return; //not ready yet or something //TODO enqueue

        const that = this;

        if (n.length) {
            this.db.bulkDocs(n).then((d)=>{
                //console.log('bulk', d);
            }).catch((err)=>{
                console.warn(that.I, n, err.toString())
            });
            return;
        }


        var id;
        if (n.I && !n._id) {
            id = (n._id = n.I);
        } else if (!n._id) {
            throw new Error('missing ID: ' + JSON.stringify(n));
        }



        this.db.upsert(id, (d) => {

            n._rev = d._rev; //temporary
            if (_.isEqual(d, n)) {
                return false; //no change
            } else {
                //console.log(JSON.stringify(d), JSON.stringify(n), _.isEqual(d, n));
                delete n._rev; //undo the temporarily added revision for the comparison
                return n;
            }

        }).then((d)=>{
            //console.log('ok', d);
        }).catch(err => {
            console.warn(that.I, n, err.toString())
        });

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
