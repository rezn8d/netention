## Netention
# HTML/JS Client Design

## 0. NObject
Inter-linked data structures which
form a universal container for information,
intention, and the potential for information or
intention.
        
## 1. 'Soft' Memory
2-level cache in client meant to store data for the user as a
buffer and backup of all server interaction.

 * fast-access O(1) priority queue of active items, by ID or rank
 * async but queryable PouchDB via IndexedDB
    
Both cache-levels must have configurable size limitations and eviction 
policies when the limit is reached. 
    
## 2. Attention
vector of (tag,X,weight) tuples where X is a tag
 * deciding visibility and layout of UI
 * server query
 * memoized snapshots form attention history

"value" tags
 * interest/disinterest
 * want/avoid
 * can/cant

## 2. Widgets
    
### NIcon - canonical icon (small) reprsentation, suitable
as an element in a visualized collection or in a graph

### NEdit - multipart editor, accesss all data and metadata
with a variety of views for each component.

### NView - multipart viewer. components may temporally become editable.
if one is not the original author, it clones itself for your fork.
        
### NSpace - ubiquitous graph viewer, also used as a HUD overlay
 * spatial model, w/ event hooks
 * integration with widget that provide a back-projection
so that content in an overlay can be arranged relative 
to content in the widget underneath.


## 3. Multi-Peer / Multi-server I/O
Connections
 * Local (PouchDB)
 * HTTP AJAJ
 * WebSocket
 * WebRTC

Privacy Levels
 * Self only
 * Friends/Groups only, uses public key encryption
 * Global

Peers make no guarantee on data retention, however they may
obey specified expiration times in prioritizing memory 
clearing.


    
