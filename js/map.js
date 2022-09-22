// Initialise map
var map = L.map('map').setView([8.0, -1.0], 7);

// Add osm tile layer to map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var googleHybrid = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var googleSat = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}) //.addTo(map);


var googleTerrain = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});


//var marker = L.marker([7, -1.09]).addTo(map)


// Styling of layers
var regionStyle = {
    color: "black",
    opacity: null,
    fillColor: null,
    weight: 1
};

var healthStyle = {
    radius: 3,
    fillColor: "black",
    color: "black",
    weight: "0.3",
    opacity: null

}

var railwayStyle = {
    color: "#636363",
    weight: "4"
}

// Add Geojson Layers
var regionLayer = L.geoJson(region, {
    style: regionStyle,
    onEachFeature: function(feature, layer) {
        area = (turf.area(feature)/1000000).toFixed(3)
        center_lng = turf.center(feature).geometry.coordinates[0].toFixed(2)
        center_lat = turf.center(feature).geometry.coordinates[1].toFixed(2)

        label = `Name: ${feature.properties.region}<br>`
        label += `Region code: ${feature.properties.reg_code}<br>`
        label += `Area: ${area} sqkm <br>`
        label += `Center: ${center_lng}(x), ${center_lat} (y)<br>`

        layer.bindPopup(label)
    }


}) //.addTo(map)

var healthLayer = L.geoJson(healthFacilities, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, healthStyle)
    },
    onEachFeature: function(feature, layer) {
        label = `Name: ${feature.properties.name}<br>`
        label += `Healthcare: ${feature.properties.healthcare}<br>`

        layer.bindPopup(label)
    }

}).addTo(map)

var railwayLayer = L.geoJson(railWay, {
    style: railwayStyle,
    onEachFeature: function(feature, layer) {
        label = `Name: ${feature.properties.NAME}<br>`
        label += `Status: ${feature.properties.RAILWAY}<br>`

        layer.bindPopup(label)
    }
}).addTo(map)

// Add WMS layers
var waterBodiesWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:water_bodies',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map)

var treeCoverWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:treecover_gh',
    format: 'image/png',
    transparent: true,
    attribution: ""
}) //.addTo(map)


var regionWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Regions',
    format: 'image/png',
    transparent: true,
    attribution: "",

}).addTo(map)

var treeCoverSR = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:selected_regions',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map)

// Basemaps
var baseLayers = {
    "OpenStreetMap": osm,
    "Google Street": googleStreets,
    "Google Hybrid": googleHybrid,
    "Google Satelite": googleSat,
    "Google Terrain": googleTerrain,


};

// Layers
var overlays = {
    "Water Bodies": waterBodiesWMS,
    "Tree cover": treeCoverWMS,
    "regions": regionLayer,
    "Health Facilities": healthLayer,
    "Railway lines": railwayLayer,
    "Tree Cover Selected Regions": treeCoverSR,
    "region WMS": regionWMS
    //"Marker": marker,
    //"Roads": roadsLayer
};

// Add layer control to map
L.control.layers(baseLayers, overlays,{ collapsed: false }).addTo(map);

// Add leaflet print control
L.control.browserPrint({ position: 'topleft' }).addTo(map);

// mouse move coordinate
map.on("mousemove", function(e) {
    $("#coordinate").html(`Lat:${e.latlng.lat.toFixed(3)}, Lng: ${e.latlng.lng.toFixed(3)}`)
})



// Adding scale to map
L.control.scale().addTo(map);