/*jslint node: true */
/* jshint multistr: true, browser: true */
/* globals $:false, Cesium:false, nobjectsIn:false, console:false, Self:false, layers:false, _:false */

var netentionOptions = {
    "ServerName": "SomeServerName",
    "ServerType": "0", // 0 = Global (node + full network), 1 = Mirror (support global network), 2 = Independent (node only, no network), 
    // PRIVACY
    "AllowAnonymousLogin": true,
    "MaxPrivacyLevel": "0", // 0 = Global (all nodes), 1 = Public (node only), 2 = Friends/Groups only, 3 = Self only
    "DefaultPrivacyLevel": "1", // 0 = Global (all nodes), 1 = Public (node only), 2 = Friends/Groups only, 3 = Self only
    "DefaultNobjectDuration": "0", // 0 = infinity else set number in minutes
    "DefaultContentLicense": "AGPL", // determine the default license for posted Nobjects
    // VIEWS
    "IncludeFeed": true,
    "IncludeGraph": true,
    "IncludeMap": true,
    "IncludeTimeline": true,
    // USERS
    "AllowUserHomepage": true,
    "AllowInstantMessaging": true,
    "AllowVoice": true,
    "AllowVideo": true,
    // ADDONS
    "DefaultTheme": "dark", // Options: "dark" or "light"
    "AllowThemes": true,
    "AllowPlugins": true,
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
}

//(function () {
  'use strict';
   //the rest of the function

   // Set Theme
   $('body').addClass(netentionOptions.DefaultTheme);

   $('#nt-user').on('click', function() {
   		var mn = $('nav.right');
   		if (mn.hasClass('visible')) {
   			mn.removeClass('visible');
   			$(this).removeClass('active');
   		} else {
   			mn.addClass('visible');
   			$(this).addClass('active');
   		}
   });

   $('.sub-menu ul').hide();
	$(".sub-menu a").click(function () {
		if ($(this).parent(".sub-menu").children("ul").is(":visible")) {
			$(this).parent(".sub-menu").children("ul").hide();
			$(this).find(".right").removeClass("fa-caret-down").addClass("fa-caret-up");
		} else {
			$(this).parent(".sub-menu").children("ul").show();
			$(this).find(".right").removeClass("fa-caret-up").addClass("fa-caret-down");
		}
	});

   var viewMenu = $('#nt-menu .nt-view-menu .nt-btn-grp');
   var rightMenu = $('#nt-menu .nt-right-menu .nt-btn-grp');

   // FEED
   if (netentionOptions.IncludeFeed === true) {
		var feedBtn = $('<div id="feed" class="nt-btn nt-view-btn" title="Feed (list)"><i class="fa fa-2x fa-th-list"></i><span class="visuallyhidden">Feed</span></div>').appendTo(viewMenu);
   }

   // MAP
   if (netentionOptions.IncludeMap === true) {
		var mapBtn = $('<div id="map" class="nt-btn nt-view-btn" title="Map / 3D Globe (geolocation)"><i class="fa fa-2x fa-map-marker"></i><span class="visuallyhidden">Map</span></div>').appendTo(viewMenu);
   }

   // GRAPH
   if (netentionOptions.IncludeGraph === true) {
		var graphBtn = $('<div id="graph" class="nt-btn nt-view-btn" title="Graph (relationship mapping)"><i class="fa fa-2x fa-code-fork"></i><span class="visuallyhidden">Graph</span></div>').appendTo(viewMenu);
   }

   // TIMELINE
   if (netentionOptions.IncludeTimeline === true) {
		var timelineBtn = $('<div id="timeline" class="nt-btn nt-view-btn" title="Timeline (chronological)"><i class="fa fa-2x fa-clock-o"></i><span class="visuallyhidden">Timeline</span></div>').appendTo(viewMenu);
   }

   if (netentionOptions.AllowInstantMessaging === true) {
		var messageBtn = $('<div id="notifications" class="nt-btn nt-view-btn" title="Updates (notifications / messages)"><i class="fa fa-2x fa-comments-o"></i><span class="visuallyhidden">Messages</span><span class="badge right">12</span></div>').appendTo(rightMenu);
   }

   if (netentionOptions.AllowUserHomepage === true) {
		var messageBtn = $('<div id="home" class="nt-btn nt-view-btn" title="My Home"><i class="fa fa-2x fa-home"></i><span class="visuallyhidden">Homepage</span></div>').prependTo(rightMenu);
   }

//}()); // END use s