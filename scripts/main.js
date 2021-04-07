// Set api token
mapboxgl.accessToken = 'pk.eyJ1IjoicHVja2IiLCJhIjoiY2ttbHR0MmNnMDE3eTJucGdzemRmdmV1NiJ9.AXo5MlyGCM9BEfuXWdJajQ';

// Initialate map
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [4.322840, 52.067101],
zoom: 11.15
});

// var geocoder = new MapboxGeocoder({
// accessToken: mapboxgl.accessToken,
// mapboxgl: mapboxgl
// })

//get coords zoekbalk
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: 'country,region,place,postcode,locality,neighborhood'
});

// place with id
var features = [];

geocoder.addTo('#geocoder');

// Add geocoder result to container.
geocoder.on('result', function (e) {
    let coords = e.result.geometry.coordinates;

    //update map, go to coordinates
    map.flyTo({
        center: coords,
        zoom: 15
    });

    features = [];
    getCafes(coords);
    // getCultural(coords);
});

//andere api  parameter coords
function getCafes(coords) {
    const openTripMapKey = '5ae2e3f221c38a28845f05b6a22cdc4a0cfb0a132d606ec9a0834be3';
    let url = 'https://api.opentripmap.com/0.1/en/places/radius',
        qString = '?radius=1500&lon=' + coords[0] + '&lat=' + coords[1] + '&kinds=cafes&limit=25&apikey=' + openTripMapKey;

    fetch(url + qString)
        .then(resp => {
            return resp.json();
        }).then(data => {
        let cafes = data.features;

        for (let i = 0; i < cafes.length; i++) {
            let cafe = cafes[i];

            let obj = {};
            obj.id = cafe.id;
            obj.type = 'Feature';
            obj.properties = {};
            obj.properties.description = '<strong>' + cafe.properties.name + '</strong>';
            obj.properties.icon = 'cafe';
            obj.geometry = {};
            obj.geometry.type = 'Point';
            obj.geometry.coordinates = cafe.geometry.coordinates;

            features.push(obj);
        }
        placeMarkers();
    }).catch((error) => {
        alert(error);
    })
}

//markers gemaakt
function placeMarkers() {
    map.addSource('places', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': features
        }
    });

    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
            'icon-image': '{icon}-15',
            'icon-size': 2,
            'icon-allow-overlap': true
        }
    });

    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'places', function (e) {

        const openTripMapKey = '5ae2e3f221c38a28845f05b65370e244b3b310f07de647889ddf591c';
        let url = 'https://api.opentripmap.com/0.1/en/places/xid/' + e.features[0].id,
            qString = '?apikey=' + openTripMapKey;
        fetch(url + qString)
            .then(resp => {
                return resp.json();
            }).then(data => {
            let address = '<p>' + data.address.road + ' ' + data.address.house_number + '<br>' + data.address.postcode + ' ' + data.address.city + '<br>' + data.address.country + '</p>';
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description + address;

            // Populate the popup and set its coordinates based on the feature found.
            popup.setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        }).catch((error) => {
            alert(error);
        })
    });

    map.on('mouseleave', 'places', function () {
        popup.remove();
    });
}

//markers gemaakt
function placeMarkers() {
    map.addSource('places', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': features
        }
    });

    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
            'icon-image': '{icon}-15',
            'icon-size': 2,
            'icon-allow-overlap': true
        }
    });

    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'places', function (e) {

        const openTripMapKey = '5ae2e3f221c38a28845f05b65370e244b3b310f07de647889ddf591c';
        let url = 'https://api.opentripmap.com/0.1/en/places/xid/' + e.features[0].id,
            qString = '?apikey=' + openTripMapKey;
        fetch(url + qString)
            .then(resp => {
                return resp.json();
            }).then(data => {
            let address = '<p>' + data.address.road + ' ' + data.address.house_number + '<br>' + data.address.postcode + ' ' + data.address.city + '<br>' + data.address.country + '</p>';
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description + address;

            // Populate the popup and set its coordinates based on the feature found.
            popup.setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        }).catch((error) => {
            alert(error);
        })
    });

    map.on('mouseleave', 'places', function () {
        popup.remove();
    });
}




// map.on('load', function () {
// // Listen for the `geocoder.input` event that is triggered when a user
// // makes a selection
// geocoder.on('result', function (ev) {
// console.log(ev.result.center);
//
//  });
// });
//
// document.getElementById('citybutton').onclick = function(){
//             	getAPIdata();
//             }
//
//             // init data stream
//             var geocoder = new MapboxGeocoder({
//                 accessToken: mapboxgl.accessToken,
//                 mapboxgl: mapboxgl
//             });
//
//             // // Voeg de zoekbalk toe
//             // map.addControl( geocoder, 'top-left');
//
            map.on('load', function () {
            	// Listen for the `geocoder.input` event that is triggered when a user
            	// makes a selection
            	geocoder.on('result', function (ev) {
            	  console.log(ev.result.center);
                //document.getElementById('coordinaten').innerHTML = ev.result.center[0] + '-' + ev.result.center[1];
                getAPIdata(ev.result.center[0], ev.result.center[1]);
            	});
            });

            function getAPIdata(ingevoerdeLon, ingevoerdeLat) {

            	// construct request
            	var request = 'https://api.openweathermap.org/data/2.5/weather?appid=639b70cdea4ec366f54e164e3bc7269c&lon=' +ingevoerdeLon+ '&lat=' +ingevoerdeLat;
            	// get current weather
            	fetch(request)

            	// parse response to JSON format
            	.then(function(response) {
            		return response.json();
            	})

            	.then(function(response) {
            		// show full JSON object
            		console.log(response);//response.main.temp --komt het in de console.
            		var weatherBox = document.getElementById('weer');
            		//weatherBox.innerHTML = response;
            		//weatherBox.innerHTML = response.weather[0].description;
            		weatherBox.innerHTML = (response.main.temp - 273.15).toFixed(1) + ' &#176;C </br>';

                var weatherBox2 = document.getElementById('weersverwachting');
                weatherBox2.innerHTML = (response.weather[0].description) + '<br>' + '' + 'Windspeed: ' + response.wind.speed + ' m/s ' + '<br>' + '' + ' Winddirection: ' + response.wind.deg + ' ' + '&#176' + '<br>' + '' + 'Atmosphere pressure: ' + response.main.pressure + ' ' + 'kPa';
                 // + '' + (response.weather[0].description);
            		// weatherBox.innerHTML = degC + '&#176;C <br>';
            	});
            }

            function getNews() {

               var request = 'https://test.spaceflightnewsapi.net/api/v2/articles?_limit=5';

               fetch(request)  //fetch is geef mij info, vraag stellen

               // parse response to JSON format . daarna gebeurt dit,
               .then(function(response) {
                 return response.json();
               })

               .then(function(response) {

                 console.log(response);
                var nieuws = document.getElementById('nieuws');
                 //nieuws.innerHTML = response;
                nieuws.innerHTML = 'Space News' + '</br>'+ (response[0].title) + '</br>' + (response[1].title) + '</br>' +(response[2].title) + '</br>' +(response[3].title);
               //  weatherBox.innerHTML = 'Weather' + '</br>' + (response.main.temp - 273.15).toFixed(1) + ' &#176;C </br>' + '' + (response.weather[0].description) + '</br>' + 'Windspeed: ' + response.wind.speed + ' m/s';
               });
             }
             getNews();
