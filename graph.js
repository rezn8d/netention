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
