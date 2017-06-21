"use strict";
/*jslint node: true */
/* jshint multistr: true, browser: true */
/* globals $:false, Cesium:false, nobjectsIn:false, console:false, Self:false, layers:false, _:false */

/** the client-side configuration state */
class NClient {

    constructor(opt={}) {

        _.assign(this, opt);
    }

}



var sampleNobjects = {
    "I": "Nobjects",
    "Alerts": {
        "N": "<span style='color:#FC0'>LIVE!</span> Alerts",
        "icon": "fa-globe",
        "Earthquake": {
            "N": "Earthquake",
            "icon":  "fa-rss",
            ">": [
                {
                    "I": "usgs-all-hour",
                    "T": "geojson",
                    "ML": "usgs-eq",
                    "MI": "/img/icons/earthquakes.png",
                    "G": "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
                    "S": "United States Geological Society (USGS) Earthquake Hazards Program",
                    "U": "http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php",
                    "N": "USGS - All Earthquakes (Last Hour)"
                }
            ]
        }
    }
};

//(function () {
   //the rest of the function


//}()); // END use s

