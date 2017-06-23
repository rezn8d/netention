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

const DEFAULT_MAX_LISTENERS = 12;



function newWindow(content) {
    const w = newFrame();

    // var closeButton = $('<button/>').text('x').addClass('close_button').click(function() {
    //     w.fadeOut(150, function() { $(this).remove(); });
    // });

    /*var fontSlider = NSlider({ }).addClass('font_slider').css({
        width: '1em',
        position: 'absolute',
        left: 0,
        top: 0
    });*/

    w.append(content = (content || $('<div/>')), /*fontSlider,*/);

    content.addClass('content');

    return w;
}

function newFrame() {
    //http://interactjs.io/


    var div = $('.windgets');
    if (div.length === 0)
        div = D('windgets').prependTo($('body'));

    var content = D('windget')/*.fadeIn()*/.appendTo(div);
    var dragMoveListener = event => {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    };


    interact(content[0])
        .draggable({
            onmove: dragMoveListener
        })
        .resizable({
            edges: {left: true, right: true, bottom: true, top: true}
        })
        .on('resizemove', function (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            // update the element's style
            target.style.width = parseInt(event.rect.width);// + 'px';
            target.style.height = parseInt(event.rect.height);// + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + parseInt(x) + ',' + parseInt(y) + ')';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            //target.textContent = event.rect.width + '×' + event.rect.height;
        });

    //content.close = ...

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
