"use strict";

var uuidx = ("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.~");

//add some extended ascii http://www.ascii-code.com/
for (var i = 192; i <= 255; i++) {
    uuidx = uuidx + String.fromCharCode(i);
}

function uuid(len=16) {
    const cx = uuidx.length;
    var u = '';
    for (var i = 0; i < len; i++) {
        u += uuidx[parseInt(Math.random()*cx)]
    }
    return u;
}

function e(eleID, cssclass) {
    var x = document.createElement(eleID);
    if (cssclass)
        x.setAttribute('class', cssclass);
    return x;
}

function E(eleID, cssclass) {
    return $(e(eleID, cssclass));
}

function D(cssclass) {
    return E('div', cssclass);
}


function SPANclass(cssclass) {
    const x = E('span');
    if (cssclass)
        x.attr('class', cssclass);
    return x;
}

//faster than $('<div/>');
function DIV(id) {
    var e = newEle('div');
    if (id) e.attr('id', id);
    return e;
}

function SPAN(id) {
    var e = newEle('span');
    if (id) e.attr('id', id);
    return e;
}

function newSpan(id) {
    var e = newEle('span');
    if (id) e.attr('id', id);
    return e;
}

function divCls(c) {
    var d = DIV();
    d.attr('class', c);
    return d;
}

function newEle(e, dom) {
    var d = document.createElement(e);
    if (dom)
        return d;
    return $(d);
}


function jsonUnquote(json) {
    return json.replace(/\"([^(\")"]+)\":/g, "$1:");  //This will remove all the quotes
}

function notify(x) {
    PNotify.desktop.permission();
    if (typeof x === "string")
        x = {text: x};
    else if (!x.text)
        x.text = '';
    if (!x.type)
        x.type = 'info';
    x.animation = 'none';
    x.styling = 'fontawesome';

    new PNotify(x);
    //.container.click(_notifyRemoval);
}


function urlQuery(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return (false);
}

var ajaxFail = function (v, m) {
    console.error('AJAJ Err:', v, m);
};


function loadCSS(url, med) {
    $(document.head).append(
        $("<link/>")
            .attr({
                rel: "stylesheet",
                type: "text/css",
                href: url,
                media: (med !== undefined) ? med : ""
            })
    );
}

function loadJS(url) {
    $(document.head).append(
        $("<script/>")
            .attr({
                type: "text/javascript",
                src: url
            })
    );
}

function assert(x, reason="") {
    if (!x) {
        throw new Error('FAIL: ' + reason);
    }
}

//TODO make 'class NWindow'
function newWindow(content=undefined, opts) {

    content = newFrame(content);

    content.close = function() {
        content.fadeOut("slow", ()=>{
            content.remove(); //$(this) ?
        });
        if (opts.onClose) {
            opts.onClose(content);
        }
    };
    content.centerOnScreen = function() {

        content.moveTo(
            window.innerWidth/2 - content.width()/2,
            window.innerHeight/2 - content.height()/2
        );
        return this;
    };

    const frame = D().attr('style', 'position: fixed; width: 100%; height: 100%; z-index: 1; pointer-events: none').appendTo(content);
    frame.hide();


    const closeButton = E('button').appendTo(frame)
        .attr('style', 'position: fixed; top:-2em; right: 0; width: 2em; height: 2em; background-color: orange; pointer-events: all')
        .text('X')
        .click(()=>{
            content.close();
        });

    var max = false;
    var normalSize = {};
    const zoomButton = E('button').appendTo(frame)
        .attr('style', 'position: fixed; top:-2em; left: 0; width: 2em; height: 2em; background-color: orange; pointer-events: all')
        .text('+')
        .click(()=>{
            //toggle zoom
            if (max) {
                max = false;
                content.css({'fontSize': '100%'});
                content.moveTo(normalSize.x, normalSize.y);
                content.size(normalSize.w, normalSize.h);
            } else {
                max = true;


                var pos = content.position();

                // var sx = (window.innerWidth / content[0].clientWidth)/4;
                // var sy = sx;
                // var tx = pos.left;
                // var ty = pos.top;
                // let t = 'translate(' + parseInt(tx) + 'px,' + parseInt(ty) + 'px) scale(' + sx + ',' + sy + ')';
                // $('body').css({'transform': t});


                //save normal size
                normalSize.x = pos.left;
                normalSize.y = pos.top;
                normalSize.w = content[0].clientWidth;
                normalSize.h = content[0].clientHeight;

                const margin = 64;
                content.size(window.innerWidth-margin*2, window.innerHeight - margin*2);
                content.moveTo(margin, margin);
                content.css({'fontSize': '150%'});
            }
        });

    const below = content.below = D().attr('style', 'position: fixed; pointer-events: all; top:100%; left: 0; width: 100%; max-height: 50%').appendTo(frame);
    const left = content.left = D().attr('style', 'position: fixed; text-align: right; pointer-events: all; right:100%; top: 0; height: 100%; max-width: 50%').appendTo(frame);
    const right = content.right = D().attr('style', 'position: fixed; pointer-events: all; left:100%; top: 0; height: 100%; max-width: 50%').appendTo(frame);

    content.hover(() => frame.stop().fadeIn('fast'),
                  () => frame.stop().fadeOut('slow') );

    // var closeButton = $('<button/>').text('x').addClass('close_button').click(function() {
    //     w.fadeOut(150, function() { $(this).remove(); });
    // });

    /*var fontSlider = NSlider({ }).addClass('font_slider').css({
        width: '1em',
        position: 'absolute',
        left: 0,
        top: 0
    });*/

    //w.append(content = (content || $('<div/>')), /*fontSlider,*/);

    //content.addClass('content');

    if (opts && opts.onStart)
        opts.onStart(content);


    return content;
}

function newFrame(content=undefined) {
    //http://interactjs.io/


    var tgt = $('body'); //$('.windgets');
    // if (tgt.length === 0)
    //     tgt = D('windgets').prependTo($('body'));

    content = (content || D())/*.fadeIn()*/.appendTo(tgt);
    content.addClass('windget');

    content.size = (x, y)=>{
        content[0].style.width = x + 'px';
        content[0].style.height = y + 'px';
    };

    content.moveTo = (x, y)=>{
        // translate the element
        content[0].style.webkitTransform =
            content[0].style.transform =
                'translate(' + x + 'px,' + y + 'px)';

        // update the posiion attributes
        content[0].setAttribute('data-x', x);
        content[0].setAttribute('data-y', y);

    };

    var dragMoveListener = event => {
        var //target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(content[0].getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(content[0].getAttribute('data-y')) || 0) + event.dy;

        content.moveTo(x, y);
    };



    interact(content[0])
        .draggable({
            onmove: dragMoveListener,
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
        })
        .resizable({
            edges: {left: true, right: true, bottom: true, top: true}
        })
        .on('resizemove', function (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);



            // update the element's style
            content.size(event.rect.width, event.rect.height);

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + (x) + 'px,' + (y) + 'py)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            //target.textContent = event.rect.width + '×' + event.rect.height;
        });


    return content;
}


/** https://github.com/kolodny/member-berry
 *
 *     var obj1 = {};
 var obj2 = {};
 expect(membered(obj1, obj2)).toEqual(1);
 expect(membered(obj1, obj2)).toEqual(1, 'ooh, I member!');
 * */
var resultObject = {};

function MEMOIZE(fn) {
    var wrappedPrimitives = {};
    var map = new WeakMap();
    return function () {
        var currentMap = map;
        for (var index = 0; index < arguments.length; index++) {
            var arg = arguments[index];
            if (typeof arg !== 'object') {
                var key = (typeof arg) + arg
                if (!wrappedPrimitives[key]) wrappedPrimitives[key] = {};
                arg = wrappedPrimitives[key];
            }
            var nextMap = currentMap.get(arg);
            if (!nextMap) {
                nextMap = new WeakMap();
                currentMap.set(arg, nextMap);
            }
            currentMap = nextMap;
        }
        if (!currentMap.has(resultObject)) {
            currentMap.set(resultObject, fn.apply(null, arguments));
        }
        return currentMap.get(resultObject);
    }
}


function QueryPrompt(withSuggestions, withResults) {


    const queryText = $('<input type="text"/>');
    const onQueryTextChanged = _.throttle(() => {

        const qText = queryText.val();
        if (qText.length > 0) {
            //$('#query_status').html('Suggesting: ' + qText);

            $.get('/suggest', {q: qText}, withSuggestions);
        } else {
            withSuggestions('[]' /* HACK */);
        }

    }, 100, true, true);

    queryText.submit = function () {
        ALL(queryText.val(), withResults);
    };

    queryText.on('input', onQueryTextChanged);

    queryText.on('keypress', (e) => {
        if (e.keyCode === 13)
            queryText.submit();
    });

    return queryText;
}

//const mapClustering = new L.MarkerClusterGroup().addTo(map);

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function clickHandler(e) {
    var obj = e.target.options.data;
    if (obj.what) {
        obj.what[0].scrollIntoView();
    }

    /*var x = JSON.stringify(obj, null, 4);

     var w = newWindow($('<pre>').text(x));
     $.getJSON('/obj/' + obj.I, function(c) {
     var desc = c['^']['_'];
     if (desc)
     w.html(desc);
     else
     w.html(JSON.stringify(c, null, 4));
     } );*/
}

function overHandler(e) {
    var o = e.target.options;


    /*if (o.ttRemove) {
     clearTimeout(o.ttRemove);
     o.tt.fadeIn();
     }
     else */
    {
        if (o.tt)
            return; //already shown


        $('.map2d_status').remove();

        //setTimeout(function () {
        var tt = $('<div>').addClass('map2d_status');

        tt.html($('<a>').text(o.title).click(function () {
        }));

        tt.css('left', e.containerPoint.x);
        tt.css('top', e.containerPoint.y);

        tt.appendTo($('#map'));

        o.tt = tt;
        //}, 0);
    }
}

function outHandler(e) {

    var o = e.target.options;
    if (o.tt) {
        o.tt.remove();
        delete o.tt;
        /*
         var delay = 1500; //ms
         var fadeTime = 500; //ms
         o.ttRemove = setTimeout(function() {
         o.tt.fadeOut(fadeTime);
         delete o.tt;
         delete o.ttRemove;
         }, delay);
         */
    }
}

function QueryPrompt(withSuggestions, withResults) {


    const queryText = $('<input type="text"/>');
    const onQueryTextChanged = _.throttle(() => {

        const qText = queryText.val();
        if (qText.length > 0) {
            //$('#query_status').html('Suggesting: ' + qText);

            $.get('/suggest', {q: qText}, withSuggestions);
        } else {
            withSuggestions('[]' /* HACK */);
        }

    }, 100, true, true);

    queryText.submit = function () {
        ALL(queryText.val(), withResults);
    };

    queryText.on('input', onQueryTextChanged);

    queryText.on('keypress', (e) => {
        if (e.keyCode === 13)
            queryText.submit();
    });

    return queryText;
}

// "ues strict";
//
// /** graph vertex */
// class Node {
//     constructor(id, maxIn = 8, maxOut = 8) {
//         this.id = id;
//         this.i = new LfuMap({}, maxIn);
//         this.o = new LfuMap({}, maxOut);
//     }
//
// }
//
//
// class LFUGraph extends LfuMap {
//
//     constructor(maxNodes) {
//         super({}, maxNodes);
//
//         const that = this;
//         this.addBeforeMapChangeListener((n, nid, map) => {
//             if (n === undefined) {
//                 n = that.get(nid); //WTF
//                 if (n) {
//                     //console.log('-', nid, n);
//                     that.nodeEvicted(nid, n);
//                 }
//             }
//         });
//         this.addMapChangeListener((n, nid, map) => {
//             if (n) {
//                 //console.log("+", nid, n);
//                 that.nodeAdded(nid, n);
//             }
//         });
//     }
//
//     node(nid, createIfMissing = true) {
//         const x = this.get(nid);
//         if (x || !createIfMissing)
//             return x;
//
//         const n = new Node(nid);
//         this.set(nid, n);
//         return n;
//     }
//
//     nodeIfPresent(nodeID) {
//         return this.get(nodeID);
//     }
//
//     nodeEvicted(nid, n) {
//
//         if (n.o) {
//             for (var tgtNode of n.o.keys()) {
//                 //tgtNode = tgtNode.data;
//                 //console.log('evict', nid, n, tgtNode);
//                 tgtNode = this.get(tgtNode);
//
//                 const e = tgtNode.i.remove(nid);
//                 if (e)
//                     this.edgeRemoved(n, tgtNode, e);
//
//             }
//         }
//
//         if (n.i) {
//             for (var srcNode of n.i.keys()) {
//                 //srcNode = srcNode.data;
//                 //console.log('evict', nid, n, this.get(srcNode));
//                 srcNode = this.get(srcNode);
//
//                 const e = srcNode.o.remove(nid);
//                 if (e)
//                     this.edgeRemoved(srcNode, n, e);
//
//             }
//         }
//
//         this.nodeRemoved(nid, n);
//
//         delete n.o;
//         delete n.i;
//     }
//
//     nodeAdded(nid, n) {
//     }
//
//     nodeRemoved(nid, n) {
//     }
//
//     edgeAdded(src, tgt, e) {
//     }
//
//     edgeRemoved(src, tgt, e) {
//     }
//
//     edge(src, tgt, value) {
//         if (src == tgt)
//             return null; //no self-loop
//
//         if (value === undefined) {
//             value = src.toString() + "_" + tgt.toString();
//         } else if (value === null) {
//
//         }
//
//         const T = this.node(tgt, value ? true : false);
//         if (!T)
//             return null;
//
//         const S = this.node(src, value ? true : false);
//         if (!S)
//             return null;
//
//         const ST = S.o.get(tgt);
//         if (ST) {
//             return ST;
//         } else if (value && S.o && T.i) {
//             value = (typeof value === "function") ? value() : value;
//             S.o.set(tgt, value);
//             T.i.set(src, value);
//             this.edgeAdded(S, T, value);
//             return value;
//         } else {
//             return null;
//         }
//     }
//
//     edgeIfPresent(src, tgt) {
//         return this.edge(src, tgt, null);
//     }
//
//     forEachNode(nodeConsumer) {
//         for (var [nodeID, node] of this) {
//             const n = node.data;
//             if (n)
//                 nodeConsumer(n);
//         }
//     }
//
//     /** follows java's Map.computeIfAbsent semantics */
//     computeIfAbsent(key, builder) {
//         var x = this.get(key);
//         if (!x) {
//             this.set(key, x = builder.apply(key));
//         }
//         return x;
//     }
//
//     forEachEdge(edgeConsumer) {
//         for (var [nodeID, srcVertex] of this) {
//             const vv = srcVertex.data;
//             if (vv) {
//                 for (var [targetID, edge] of vv.o) {
//                     edgeConsumer(vv, targetID, edge.data);
//                 }
//             }
//         }
//     }
//
//     // getNodesAndEdgesArray() {
//     //     var a = [];
//     //     for (var [vertexID, vertex] of this) {
//     //         a.push( vertex.data )
//     //     }
//     //     return a;
//     // }
//
//
//     /** computes a node-centric Map snapshot of the values */
//     treeOut() {
//         var x = {};
//         this.forEachEdge((src, tgtID, E) => {
//             const vid = src.id;
//             const eid = tgtID;
//             var ex = x[vid];
//             if (!ex)
//                 x[vid] = ex = {};
//             var ee = ex[eid];
//             if (!ee)
//                 ex[eid] = ee = [];
//             ee.push(eid);
//         });
//         return x;
//     }
//
//     edgeList() {
//         var x = [];
//         this.forEachEdge((src, tgtID, E) => {
//             x.push([src.id, tgtID]);
//         });
//         return x;
//     }
//
//
// }
