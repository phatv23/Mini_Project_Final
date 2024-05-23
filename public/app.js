let map;


function initMap() {
    map = new longdo.Map({
        placeholder: document.getElementById('map')
    });

    // Get current geolocation
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const { latitude, longitude } = position.coords;
            addMarker(latitude, longitude);
        },
        function(error) {
            console.error('Error getting geolocation:', error);
        }
    );

    
    let data  = ''
    fetch('/api/locations')
    .then(function(response) {
      return response.json();
    })  .then(function(myJson) {
      data = myJson

      map.Tags.add(function(tile, zoom) {
        // var bound = longdo.Util.boundOfTile(map.projection(), tile);
          for (var i = 0; i < data.length; ++i) {

            map.Overlays.add(new longdo.Marker(data[i], {
                title: 'รหัสสาขา: '+ data[i].store_id,

                detail: data[i].store_name +"<br><br>"+ data[i].address + "<br><br>" + data[i].tel,
                visibleRange: { min: zoom, max: zoom },
                icon: { url: 'https://mmmap15.longdo.com/mmmap/images/icons_big/7-11.png' },
             }));
          }
      });

    });  

}

// Function to add a marker to the map
function addMarker(latitude, longitude) {

    //Location The Tara
    latitude =  13.901792321911685
    longitude =  100.53131853881565

    const marker = new longdo.Marker({ lon: longitude, lat: latitude });

    map.Overlays.add(marker);

    // Set map center to the marker position
    map.location(latitude + ',' + longitude);

}



// Initialize the map after the LongDo API script has loaded
window.onload = initMap;
