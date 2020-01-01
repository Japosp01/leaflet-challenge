// store geoJSON
const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// fetch data
d3.json(link).then((data) => {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log(data.features);
});

function createMap(earthquakes) {
    // layers for different views
    const satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 20,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

    const grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 20,
        id: 'mapbox.light',
        accessToken: API_KEY
    });

    const outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
         maxZoom: 20,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });
// selections
    const baseMap = {
        'Satellite': satellite,
        'Grayscale': grayscale,
        'Outdoors': outdoors
    };

    const overlayMap = {
        Earthquakes: earthquakes
    };

    const myMap = L.map('map', {
        center: [36.7126875, -120.476189],
        zoom: 4,
        layers: [outdoors, earthquakes]
    });

    L.control.layers(baseMap, overlayMap, {
        collapsed: false
    }).addTo(myMap);

    // colors
    function getColor(x) {
        return x > 5 ? '#f06b6b' :
            x > 4 ? '#f0936b' :
            x > 3 ? '#f3ba4e' :
            x > 2 ? '#f3db4c' :
            x > 1 ? '#e1f34c' :
                    '#b7f34d';
    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(myMap) {
        const div = L.DomUtil.create('div', 'info legend')
        const magnitudes = [0, 1, 2, 3, 4, 5]
        const labels = []

        for (let i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div
    };
    legend.addTo(myMap);

}

function createFeatures(eqdata) {
    function onEachFeature(feature, layer) {
        layer.bindPopup('<h4>Place: ' + feature.properties.place + '</h4><h4>Date: ' + new Date(feature.properties.time) + '</h4><h4>Magnitude: ' + feature.properties.mag + '</h4><h4>USGS Event Page: <a href=' + feature.properties.url + " target='_blank'>Click here</a></h4>", {maxWidth: 400})
    }


// assigning colors by mag intensity


    const layerOnMap = L.geoJSON(eqdata, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            let radius = feature.properties.mag * 4.5;

            if (feature.properties.mag > 5) {
                fillcolor = '#f06b6b';
            }
            else if (feature.properties.mag >= 4) {
                fillcolor = '#f0936b';
            }
            else if (feature.properties.mag >= 3) {
                fillcolor = '#f3ba4e';
            }
            else if (feature.properties.mag >= 2) {
                fillcolor = '#f3db4c';
            }
            else if (feature.properties.mag >= 1) {
                fillcolor = '#e1f34c';
            }
            else  fillcolor = '#b7f34d';

            return L.circleMarker(latlng, {
                radius: radius,
                color: 'black',
                fillColor: fillcolor,
                fillOpacity: 1,
                weight: 1
            });
        }
    });

// finally add whoe thing to map
    createMap(layerOnMap);
}
