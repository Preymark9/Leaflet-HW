//NOTES: I work tonight and might not be able to finish this in time, so I left several comments detailing what I'm trying to do. 
//I made sure to look at the Json data to know what tags I wanna pull out of the data. I'm fairly confident that I pulled the right tags.
//My main concern is the coordinates not being called, which makes the whole map not work. I hope I can find a fix for this soon. 
//Secondary concern is what my markers are gonna look like, if they even show up. 
//add layer groups for each quake type
var layers = {
    Significant: new L.LayerGroup(),
    Large: new L.LayerGroup(),
    Medium: new L.LayerGroup(),
    Small: new L.LayerGroup(),
    Mini: new L.LayerGroup(),
  };
//add layer groups to the map
var map = L.map("map", {
    center: [ 40.7, -94.5],
    zoom: 3,
    layers: [
    layers.Significant,
    layers.Large,
    layers.Medium,
    layers.Small,
    layers.Mini,
    ]
  });
// Then create my tile layer for the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoicHJleW1hcms5IiwiYSI6ImNqbjJjc2Y3YjAzZnczcXBpa3JwdTJ5MGsifQ.YmbD_EOBTt5nJ0d7IXJZVA"
  //I wanted to write out the API instead of using config, but the config file is there in case this for some reason doesn't work.
}).addTo(map);
//adding overlays for the markers
var overlays = {
  "Pray to your respective god(s)": layers.Significant,
  "4.5 Quakes": layers.Large,
  "2.5 Quakes": layers.Medium,
  "1.0 Quakes": layers.Small,
  "Mini Quake": layers.Mini,
};
//adding layer control
L.control.layers(null, overlays).addTo(map);
//design the markers
var icons = {
  Significant: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "black",
    markerColor: "red",
    shape: "circle"
  }),
  Large: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "black",
    markerColor: "orange",
    shape: "circle"
  }),
  Medium: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "black",
    markerColor: "yellow",
    shape: "circle"
  }),
  Small: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "black",
    markerColor: "green",
    shape: "circle"
  }),
  Mini: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "white",
    shape: "circle"
  })
};
//gotta be honest I dunno how these markers will look but hopefully they work

//repositioning the API call
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
        //console.log(data);
        plotData(data);
});

function plotData(data){
  //create a variable to loop through. The Json has a class called metadata, and it contains features, so...metadata.features SHOULD find stuff to loop through
  var quakeStatus = data.metadata.features;
  
  //this should keep all of the markers defined for layering
  var quakeCount = {
    Significant: 0,
    Large: 0,
    Medium: 0,
    Small: 0,
    Mini: 0
  };
  //create a key for updating purposes
  var quakeCountCode;
  //start the forloop
  for (var i = 0; i < quakeStatus.length; i++) {

    var station = Object.assign({}, quakeStatus[i]);
    //if the mag tag is greater than 4.5 it's significant
    if (properties.mag > 4.5) {
      quakeCountCode = "Significant";
    }
    //if the mag tag is between 4.5 and 2.6 it's large
    else if (properties.mag <= 4.5 && properties.mag >= 2.6) {
      quakeCountCode = "Large";
    }
    //if the mag tag is between 2.5 and 1.6 it's medium
    else if (properties.mag <= 2.5 && properties.mag >=1.6) {
      quakeCountCode = "Medium";
    }
    //if the mag tag is between 1.5-1.0 it's small
    else if (properties.mag <=1.5 && properties.mag >=1.0) {
      quakeCountCode = "Small";
    }
    // Otherwise the station is normal
    else {
      quakeCountCode = "Mini";
    }

    // Update the station count
    quakeCount[quakeCountCode]++;
    // Create a new marker with the appropriate icon and coordinates
    var newMarker = L.marker([properties.coordinates], {
      //after looking at the Json the coordinates aren't in normal Lat/Lon readings for me to call! I need to convert them, but I might not have time...
      icon: icons[quakeCountCode]
    });
     //append to my layers
     newMarker.addTo(layers[quakeCountCode]);

     //make a binding tool
     newMarker.bindPopup(properties.place + "<br> Capacity: " + properties.mag;
    }
      //make a legend
      updateLegend(updatedAt, stationCount);
    };
    function updateLegend(time, stationCount) {
      document.querySelector(".legend").innerHTML = [
        "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
        "<p class='Significant'>Significantly Sized Earthquakes: " + quakeCount.Significant + "</p>",
        "<p class='Large'>Large Earthquakes: " + quakeCount.Large + "</p>",
        "<p class='Medium'>Medium Earthquakes: " + quakeCount.Medium + "</p>",
        "<p class='Small'>Small Earthquakes: " + quakeCount.Small + "</p>",
        "<p class='Mini'>Miniscule Earthquakes: " + quakeCount.Mini + "</p>"
      ].join("");
    }